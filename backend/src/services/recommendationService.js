/** Recommendation service for crops, land preparation, and nutrients. */
const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');

/**
 * Get companion crop recommendation.
 */
const getCompanionCrop = (mainCrop) => {
  const companionMap = {
    'Maize': 'Beans',
    'Beans': 'Maize',
    'Tomato': 'Basil',
    'Potato': 'Beans',
    'Rice': 'Fish',
    'Wheat': 'Clover',
    'Corn': 'Squash',
  };
  
  return companionMap[mainCrop] || 'Beans';
};

/**
 * Get land preparation recommendations based on soil type and pH.
 */
const getLandPreparationAdvice = (soilType, soilPh) => {
  const advice = [];
  
  // Soil type specific advice
  if (soilType === 'Clay') {
    advice.push('Add organic matter to improve drainage');
    advice.push('Use raised beds for better water management');
    advice.push('Avoid tilling when soil is wet');
  } else if (soilType === 'Sandy') {
    advice.push('Add compost to improve water retention');
    advice.push('Use mulch to reduce water loss');
    advice.push('Consider drip irrigation');
  } else if (soilType === 'Loamy') {
    advice.push('Maintain organic matter levels');
    advice.push('Practice crop rotation');
  }
  
  // pH specific advice
  if (soilPh < 6.0) {
    advice.push('Add lime to raise pH level');
  } else if (soilPh > 7.5) {
    advice.push('Add sulfur or organic matter to lower pH');
  }
  
  return advice.length > 0 ? advice : ['Standard land preparation recommended'];
};

/**
 * Get soil improvement and nutrient recommendations.
 */
const getSoilImprovementSuggestions = async (npk, soilType, soilPh, soilQuality) => {
  const suggestions = [];
  
  // NPK recommendations
  if (npk.n < 50) {
    suggestions.push('Add nitrogen-rich fertilizer (Urea or compost)');
  }
  if (npk.p < 40) {
    suggestions.push('Add phosphorus fertilizer (DAP or bone meal)');
  }
  if (npk.k < 40) {
    suggestions.push('Add potassium fertilizer (Muriate of Potash)');
  }
  
  // Soil quality recommendations
  if (soilQuality < 50) {
    suggestions.push('Add organic compost to improve soil structure');
    suggestions.push('Consider cover crops to enhance soil fertility');
  }
  
  // Soil type specific
  if (soilType === 'Sandy') {
    suggestions.push('Add clay or organic matter to improve texture');
  } else if (soilType === 'Clay') {
    suggestions.push('Add sand or gypsum to improve drainage');
  }
  
  return suggestions.length > 0 ? suggestions : ['Maintain current soil management practices'];
};

/**
 * Calculate water requirement alert.
 */
const calculateWaterAlert = (soilMoisture, temperature, humidity) => {
  const optimalMoisture = 60; // 60% is optimal
  const needsWater = soilMoisture < 40;
  
  if (!needsWater) {
    return {
      needsWater: false,
      litersNeeded: 0,
      message: 'Soil moisture is adequate',
    };
  }
  
  // Calculate liters needed based on deficit
  const deficit = optimalMoisture - soilMoisture;
  const litersNeeded = Math.ceil(deficit * 10); // Rough estimate: 10L per 1% deficit
  
  let message = `Water your crops with ${litersNeeded} liters`;
  if (temperature > 30) {
    message += '. High temperature detected - increase watering frequency.';
  }
  
  return {
    needsWater: true,
    litersNeeded,
    message,
  };
};

/**
 * Generate summary report.
 */
const generateSummary = (predictions, recommendations, waterAlert) => {
  const summary = `
Soil Analysis Summary:
- Soil Type: ${predictions.soilType}
- Soil pH: ${predictions.soilPh} (${predictions.phCategory})
- Soil Quality: ${predictions.qualityCategory} (${predictions.soilQualityScore}/100)

Crop Recommendations:
- Recommended Crop: ${predictions.recommendedCrop}
- Companion Crop: ${predictions.companionCrop}

${waterAlert.needsWater ? `⚠️ ${waterAlert.message}` : '✅ Water levels are adequate'}

Land Preparation: ${recommendations.landPreparation.join(', ')}

Soil Improvement: ${recommendations.soilImprovement.join(', ')}
  `.trim();
  
  return summary;
};

module.exports = {
  getCompanionCrop,
  getLandPreparationAdvice,
  getSoilImprovementSuggestions,
  calculateWaterAlert,
  generateSummary,
};

