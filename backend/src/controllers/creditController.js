/** Credit scoring controller. */
const CreditScore = require('../models/CreditScore');
const Insight = require('../models/Insight');
const Farmer = require('../models/Farmer');
const creditScoringService = require('../services/creditScoringService');

/**
 * Calculate and store credit score for farmer.
 */
const calculateCreditScore = async (req, res) => {
  try {
    const farmerId = req.farmer._id;

    // Get farmer data
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    // Get latest insight for soil quality
    const latestInsight = await Insight.findOne({ farmer: farmerId })
      .sort({ createdAt: -1 });

    // Calculate risk score
    const riskScore = await creditScoringService.calculateRiskScore(
      farmer,
      latestInsight
    );

    // Get risk category
    const riskCategory = creditScoringService.getRiskCategory(riskScore);

    // Calculate loan amount
    const loanAmount = creditScoringService.calculateLoanAmount(
      riskScore,
      farmer.assetValue,
      farmer.farmingExperience,
      latestInsight?.predictions?.soilQualityScore || 50
    );

    // Generate reasoning
    const reasoning = creditScoringService.generateRiskReasoning(
      farmer,
      riskScore,
      riskCategory
    );

    // Get recommended banks
    const farm = await require('../models/Farm').findOne({ farmer: farmerId });
    const recommendedBanks = creditScoringService.getRecommendedBanks(
      riskCategory,
      loanAmount,
      farm?.location
    );

    // Save or update credit score
    const creditScore = await CreditScore.findOneAndUpdate(
      { farmer: farmerId },
      {
        farmer: farmerId,
        riskScore,
        riskCategory,
        loanAmount,
        reasoning,
        factors: {
          cooperativeMembership: farmer.cooperativeMembership,
          education: farmer.education,
          farmingExperience: farmer.farmingExperience,
          assetValue: farmer.assetValue,
          lossHistory: farmer.lossHistory || {},
          existingLoans: (farmer.existingLoans || []).filter(
            loan => loan.status === 'active'
          ).length,
          soilQuality: latestInsight?.predictions?.soilQualityScore || 50,
        },
        recommendedBanks,
      },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      data: creditScore,
    });
  } catch (error) {
    console.error('Error calculating credit score:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating credit score',
      error: error.message,
    });
  }
};

/**
 * Get credit score for farmer.
 */
const getCreditScore = async (req, res) => {
  try {
    const farmerId = req.farmer._id;

    const creditScore = await CreditScore.findOne({ farmer: farmerId });
    
    if (!creditScore) {
      return res.status(404).json({
        success: false,
        message: 'Credit score not found. Please calculate it first.',
      });
    }

    res.json({
      success: true,
      data: creditScore,
    });
  } catch (error) {
    console.error('Error fetching credit score:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching credit score',
    });
  }
};

module.exports = {
  calculateCreditScore,
  getCreditScore,
};

