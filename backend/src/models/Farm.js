/** Farm profile model schema. */
const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farmer',
    required: true,
  },
  farmSize: {
    type: Number, // in acres (model-derived)
    default: 0,
  },
  location: {
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    county: {
      type: String,
      trim: true,
    },
    region: {
      type: String,
      trim: true,
    },
  },
  landTenure: {
    type: String,
    enum: ['own all the land', 'rent all the land', 'own part of the land and rent the rest'],
  },
  currentCrop: {
    type: String,
    trim: true,
  },
  iotKitSerial: {
    type: String,
    unique: true,
    sparse: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Farm', farmSchema);

