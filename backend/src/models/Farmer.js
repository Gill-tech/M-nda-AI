/** Farmer model schema. */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const farmerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  age: {
    type: Number,
    required: [true, 'Please provide age'],
    min: [18, 'Age must be at least 18'],
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
    unique: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  cooperativeMembership: {
    type: Boolean,
    default: false,
  },
  cooperativeName: {
    type: String,
    trim: true,
  },
  education: {
    type: String,
    enum: ['no education', 'primary', 'secondary', 'tertiary education'],
  },
  farmingExperience: {
    type: Number,
    default: 0,
    min: 0,
  },
  assetValue: {
    type: Number,
    default: 0,
    min: 0,
  },
  existingLoans: [{
    amount: Number,
    institution: String,
    status: {
      type: String,
      enum: ['active', 'paid', 'defaulted'],
    },
    date: Date,
  }],
  lossHistory: {
    rainPattern: { type: Boolean, default: false },
    drought: { type: Boolean, default: false },
    heatwave: { type: Boolean, default: false },
    storms: { type: Boolean, default: false },
    mudslides: { type: Boolean, default: false },
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

// Hash password before saving
farmerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
farmerSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Farmer', farmerSchema);

