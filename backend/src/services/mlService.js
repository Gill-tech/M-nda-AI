/** ML Service integration. */
const axios = require('axios');
const config = require('../config/config');

const ML_SERVICE_BASE_URL = config.ML_SERVICE_URL;

/**
 * Call ML service for predictions.
 */
const getMLPredictions = async (sensorData) => {
  try {
    const baseUrl = `${ML_SERVICE_BASE_URL}/api/v1`;
    
    // Make parallel requests to all prediction endpoints
    const [soilType, soilPh, cropType, soilQuality] = await Promise.all([
      axios.post(`${baseUrl}/predict/soil-type`, sensorData),
      axios.post(`${baseUrl}/predict/soil-ph`, sensorData),
      axios.post(`${baseUrl}/predict/crop-type`, sensorData),
      axios.post(`${baseUrl}/predict/soil-quality`, sensorData),
    ]);

    return {
      soilType: soilType.data,
      soilPh: soilPh.data,
      cropType: cropType.data,
      soilQuality: soilQuality.data,
    };
  } catch (error) {
    console.error('Error calling ML service:', error.message);
    throw new Error('Failed to get ML predictions');
  }
};

module.exports = {
  getMLPredictions,
};

