/** Credit scoring service. */
const fs = require('fs');
const path = require('path');
const csv = require('csvtojson');
const Farmer = require('../models/Farmer');
const Insight = require('../models/Insight');

/**
 * Load credit scoring data from CSV.
 */
let creditScoringData = null;

const loadCreditScoringData = async () => {
  if (creditScoringData) {
    return creditScoringData;
  }
  
  try {
    // Path relative to project root (two levels up from services/)
    const csvPath = path.join(__dirname, '../../../src/pdc_data_zenodo.csv');
    creditScoringData = await csv().fromFile(csvPath);
    console.log(`Loaded ${creditScoringData.length} credit scoring records`);
    return creditScoringData;
  } catch (error) {
    console.error('Error loading credit scoring data:', error);
    return [];
  }
};

/**
 * Calculate risk score based on farmer data.
 */
const calculateRiskScore = async (farmer, latestInsight) => {
  let score = 50; // Start with neutral score (0-100, lower is better)
  
  // Cooperative membership (strong positive factor)
  if (farmer.cooperativeMembership) {
    score -= 15; // Lower risk
  } else {
    score += 10; // Higher risk
  }
  
  // Education level
  const educationScores = {
    'tertiary education': -10,
    'secondary': -5,
    'primary': 0,
    'no education': 5,
  };
  score += educationScores[farmer.education] || 0;
  
  // Farming experience
  if (farmer.farmingExperience >= 10) {
    score -= 10;
  } else if (farmer.farmingExperience >= 5) {
    score -= 5;
  } else if (farmer.farmingExperience < 2) {
    score += 10;
  }
  
  // Asset value
  if (farmer.assetValue >= 100000) {
    score -= 10;
  } else if (farmer.assetValue >= 50000) {
    score -= 5;
  } else if (farmer.assetValue < 10000) {
    score += 10;
  }
  
  // Loss history (negative factors)
  const lossHistory = farmer.lossHistory || {};
  if (lossHistory.drought) score += 8;
  if (lossHistory.rainPattern) score += 5;
  if (lossHistory.heatwave) score += 5;
  if (lossHistory.storms) score += 5;
  if (lossHistory.mudslides) score += 7;
  
  // Existing loans
  const activeLoans = (farmer.existingLoans || []).filter(
    loan => loan.status === 'active'
  ).length;
  if (activeLoans > 2) {
    score += 15;
  } else if (activeLoans > 0) {
    score += 5;
  }
  
  // Defaulted loans (major red flag)
  const defaultedLoans = (farmer.existingLoans || []).filter(
    loan => loan.status === 'defaulted'
  ).length;
  score += defaultedLoans * 20;
  
  // Soil quality (from latest insight)
  if (latestInsight) {
    const soilQuality = latestInsight.predictions?.soilQualityScore || 50;
    if (soilQuality >= 80) {
      score -= 5;
    } else if (soilQuality < 40) {
      score += 10;
    }
  }
  
  // Ensure score is within bounds
  score = Math.max(0, Math.min(100, score));
  
  return score;
};

/**
 * Calculate recommended loan amount.
 */
const calculateLoanAmount = (riskScore, assetValue, farmingExperience, soilQuality) => {
  // Base loan amount calculation
  let baseAmount = assetValue * 0.5; // 50% of asset value as base
  
  // Adjust based on risk score
  const riskMultiplier = (100 - riskScore) / 100; // Lower risk = higher multiplier
  baseAmount *= riskMultiplier;
  
  // Adjust based on farming experience
  if (farmingExperience >= 10) {
    baseAmount *= 1.2;
  } else if (farmingExperience >= 5) {
    baseAmount *= 1.1;
  }
  
  // Adjust based on soil quality
  if (soilQuality >= 70) {
    baseAmount *= 1.15;
  } else if (soilQuality < 40) {
    baseAmount *= 0.8;
  }
  
  // Cooperative membership bonus
  // This would be set in the farmer object
  
  // Round to nearest 1000
  return Math.round(baseAmount / 1000) * 1000;
};

/**
 * Get risk category.
 */
const getRiskCategory = (riskScore) => {
  if (riskScore < 30) {
    return 'low';
  } else if (riskScore < 60) {
    return 'medium';
  } else {
    return 'high';
  }
};

/**
 * Generate risk reasoning.
 */
const generateRiskReasoning = (farmer, riskScore, riskCategory) => {
  const factors = [];
  
  if (farmer.cooperativeMembership) {
    factors.push('Cooperative membership provides additional security');
  } else {
    factors.push('No cooperative membership increases risk');
  }
  
  if (farmer.farmingExperience >= 10) {
    factors.push('Extensive farming experience');
  } else if (farmer.farmingExperience < 2) {
    factors.push('Limited farming experience');
  }
  
  if (farmer.assetValue >= 100000) {
    factors.push('Strong asset base');
  } else if (farmer.assetValue < 10000) {
    factors.push('Limited asset value');
  }
  
  const activeLoans = (farmer.existingLoans || []).filter(
    loan => loan.status === 'active'
  ).length;
  if (activeLoans > 0) {
    factors.push(`${activeLoans} active loan(s)`);
  }
  
  const lossHistory = farmer.lossHistory || {};
  const lossCount = Object.values(lossHistory).filter(Boolean).length;
  if (lossCount > 0) {
    factors.push(`History of ${lossCount} type(s) of crop losses`);
  }
  
  return `Risk Score: ${riskScore}/100 (${riskCategory} risk). Factors: ${factors.join('; ')}.`;
};

/**
 * Get recommended banks with interest rates.
 */
const getRecommendedBanks = (riskCategory, loanAmount, location) => {
  // Mock bank data - in production, this would come from a database or API
  const banks = [
    {
      name: 'Equity Bank',
      baseRate: 12.5,
      distance: 5.2,
    },
    {
      name: 'Cooperative Bank',
      baseRate: 11.8,
      distance: 8.1,
    },
    {
      name: 'KCB Bank',
      baseRate: 13.2,
      distance: 12.5,
    },
    {
      name: 'Family Bank',
      baseRate: 12.0,
      distance: 15.3,
    },
  ];
  
  // Adjust interest rates based on risk category
  const riskMultipliers = {
    low: 1.0,
    medium: 1.15,
    high: 1.35,
  };
  
  return banks.map(bank => ({
    name: bank.name,
    interestRate: (bank.baseRate * riskMultipliers[riskCategory]).toFixed(2),
    maxLoanAmount: Math.round(loanAmount * 1.2), // Banks can offer up to 20% more
    distance: bank.distance,
  })).sort((a, b) => a.distance - b.distance); // Sort by distance
};

module.exports = {
  loadCreditScoringData,
  calculateRiskScore,
  calculateLoanAmount,
  getRiskCategory,
  generateRiskReasoning,
  getRecommendedBanks,
};

