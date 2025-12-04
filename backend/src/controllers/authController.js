/** Authentication controller. */
const Farmer = require('../models/Farmer');
const generateToken = require('../utils/generateToken');

/**
 * Register a new farmer.
 */
const registerFarmer = async (req, res) => {
  try {
    const {
      name,
      age,
      phone,
      email,
      password,
      cooperativeMembership,
      cooperativeName,
      education,
      farmingExperience,
      assetValue,
      iotKitSerial,
    } = req.body;

    // Check if farmer already exists
    const farmerExists = await Farmer.findOne({ phone });
    if (farmerExists) {
      return res.status(400).json({ message: 'Farmer already exists with this phone number' });
    }

    // Create farmer
    const farmer = await Farmer.create({
      name,
      age,
      phone,
      email,
      password,
      cooperativeMembership: cooperativeMembership || false,
      cooperativeName: cooperativeMembership ? cooperativeName : undefined,
      education: education || 'primary',
      farmingExperience: farmingExperience || 0,
      assetValue: assetValue || 0,
      iotKitSerial,
    });

    if (farmer) {
      res.status(201).json({
        _id: farmer._id,
        name: farmer.name,
        phone: farmer.phone,
        email: farmer.email,
        cooperativeMembership: farmer.cooperativeMembership,
        token: generateToken(farmer._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid farmer data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Login farmer.
 */
const loginFarmer = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // Check for farmer
    const farmer = await Farmer.findOne({ phone }).select('+password');
    if (!farmer) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await farmer.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      _id: farmer._id,
      name: farmer.name,
      phone: farmer.phone,
      email: farmer.email,
      cooperativeMembership: farmer.cooperativeMembership,
      token: generateToken(farmer._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get current farmer profile.
 */
const getMe = async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.farmer._id);
    res.json(farmer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerFarmer,
  loginFarmer,
  getMe,
};

