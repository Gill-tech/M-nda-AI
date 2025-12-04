/** Credit score model schema. */
const mongoose = require('mongoose');

const creditScoreSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true,
    unique: true,
  },
  riskScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  riskCategory: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true,
  },
  loanAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  reasoning: {
    type: String,
    trim: true,
  },
  factors: {
    cooperativeMembership: Boolean,
    education: String,
    farmingExperience: Number,
    assetValue: Number,
    lossHistory: {
      rainPattern: Boolean,
      drought: Boolean,
      heatwave: Boolean,
      storms: Boolean,
      mudslides: Boolean,
    },
    existingLoans: Number,
    soilQuality: Number,
  },
  recommendedBanks: [{
    name: String,
    interestRate: Number,
    maxLoanAmount: Number,
    distance: Number, // in km
  }],
  calculatedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

creditScoreSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CreditScore', creditScoreSchema);

