/** ML insights model schema. */
const mongoose = require('mongoose');

const insightSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true,
  },
  farm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true,
  },
  sensorData: {
    npk: {
      n: Number,
      p: Number,
      k: Number,
    },
    soilMoisture: Number,
    humidity: Number,
    temperature: Number,
    cropYieldEstimate: Number,
  },
  predictions: {
    soilType: String,
    soilPh: Number,
    phCategory: String,
    recommendedCrop: String,
    cropImageUrl: String,
    companionCrop: String,
    soilQualityScore: Number,
    qualityCategory: String,
  },
  recommendations: {
    landPreparation: [String],
    soilImprovement: [String],
    nutrients: [String],
  },
  waterAlert: {
    needsWater: Boolean,
    litersNeeded: Number,
    message: String,
  },
  summary: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Insight', insightSchema);

