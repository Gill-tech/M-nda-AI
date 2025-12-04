/** IoT sensor data controller. */
const Insight = require('../models/Insight');
const Farm = require('../models/Farm');
const mlService = require('../services/mlService');
const recommendationService = require('../services/recommendationService');
const smsService = require('../services/smsService');
const Farmer = require('../models/Farmer');
const { generateMockIoTData } = require('../utils/mockIoTData');

/**
 * Process IoT sensor data and generate insights.
 */
const processSensorData = async (req, res) => {
  try {
    const farmerId = req.farmer._id;
    const {
      iotKitSerial,
      npk,
      soilMoisture,
      humidity,
      temperature,
      cropYieldEstimate,
    } = req.body;

    // Find or create farm
    let farm = await Farm.findOne({ farmer: farmerId });
    if (!farm) {
      farm = await Farm.create({
        farmer: farmerId,
        iotKitSerial,
      });
    } else if (iotKitSerial) {
      farm.iotKitSerial = iotKitSerial;
      await farm.save();
    }

    // Prepare sensor data for ML service
    const sensorData = {
      npk_n: npk.n,
      npk_p: npk.p,
      npk_k: npk.k,
      soil_moisture: soilMoisture,
      humidity: humidity,
      temperature: temperature,
      crop_yield_estimate: cropYieldEstimate || null,
    };

    // Get ML predictions
    const predictions = await mlService.getMLPredictions(sensorData);

    // Get recommendations
    const companionCrop = recommendationService.getCompanionCrop(
      predictions.cropType.crop_type
    );
    const landPreparation = recommendationService.getLandPreparationAdvice(
      predictions.soilType.soil_type,
      predictions.soilPh.soil_ph
    );
    const soilImprovement = await recommendationService.getSoilImprovementSuggestions(
      npk,
      predictions.soilType.soil_type,
      predictions.soilPh.soil_ph,
      predictions.soilQuality.soil_quality_score
    );

    // Calculate water alert
    const waterAlert = recommendationService.calculateWaterAlert(
      soilMoisture,
      temperature,
      humidity
    );

    // Generate summary
    const summary = recommendationService.generateSummary(
      {
        soilType: predictions.soilType.soil_type,
        soilPh: predictions.soilPh.soil_ph,
        phCategory: predictions.soilPh.ph_category,
        recommendedCrop: predictions.cropType.crop_type,
        companionCrop: companionCrop,
        soilQualityScore: predictions.soilQuality.soil_quality_score,
        qualityCategory: predictions.soilQuality.quality_category,
      },
      {
        landPreparation,
        soilImprovement,
      },
      waterAlert
    );

    // Estimate farm size from sensor data (model-derived)
    // This is a simplified calculation - in production, use actual ML model
    const estimatedFarmSize = Math.max(0.5, Math.min(10, (cropYieldEstimate || 50) / 10));

    // Update farm size if not set
    if (!farm.farmSize || farm.farmSize === 0) {
      farm.farmSize = estimatedFarmSize;
      await farm.save();
    }

    // Save insight
    const insight = await Insight.create({
      farmer: farmerId,
      farm: farm._id,
      sensorData: {
        npk,
        soilMoisture,
        humidity,
        temperature,
        cropYieldEstimate: cropYieldEstimate || null,
      },
      predictions: {
        soilType: predictions.soilType.soil_type,
        soilPh: predictions.soilPh.soil_ph,
        phCategory: predictions.soilPh.ph_category,
        recommendedCrop: predictions.cropType.crop_type,
        cropImageUrl: predictions.cropType.image_url,
        companionCrop: companionCrop,
        soilQualityScore: predictions.soilQuality.soil_quality_score,
        qualityCategory: predictions.soilQuality.quality_category,
      },
      recommendations: {
        landPreparation,
        soilImprovement,
        nutrients: soilImprovement.filter(s => s.includes('fertilizer') || s.includes('nutrient')),
      },
      waterAlert,
      summary,
    });

    // Send SMS alerts if needed
    const farmer = await Farmer.findById(farmerId);
    if (farmer && farmer.phone) {
      if (waterAlert.needsWater) {
        await smsService.sendWaterAlert(
          farmer.phone,
          waterAlert.litersNeeded,
          waterAlert.message
        );
      }
      
      // Send summary report
      await smsService.sendSummaryReport(farmer.phone, summary);
    }

    res.status(201).json({
      success: true,
      data: {
        insight,
        farm: {
          _id: farm._id,
          farmSize: farm.farmSize,
        },
      },
    });
  } catch (error) {
    console.error('Error processing sensor data:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing sensor data',
      error: error.message,
    });
  }
};

/**
 * Get latest insights for farmer.
 */
const getLatestInsights = async (req, res) => {
  try {
    const farmerId = req.farmer._id;
    
    const insights = await Insight.find({ farmer: farmerId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('farm', 'farmSize location');

    res.json({
      success: true,
      count: insights.length,
      data: insights,
    });
  } catch (error) {
    console.error('Error fetching insights:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching insights',
    });
  }
};

/**
 * Get mock IoT kit data by serial number.
 */
const getIoTKitData = async (req, res) => {
  try {
    const { iotKitSerial } = req.params;

    if (!iotKitSerial) {
      return res.status(400).json({
        success: false,
        message: 'IoT kit serial number is required',
      });
    }

    // Generate mock data based on serial number
    const mockData = generateMockIoTData(iotKitSerial);

    res.json({
      success: true,
      data: {
        iotKitSerial,
        ...mockData,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error getting IoT kit data:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving IoT kit data',
    });
  }
};

module.exports = {
  processSensorData,
  getLatestInsights,
  getIoTKitData,
};

