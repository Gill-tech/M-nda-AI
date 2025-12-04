/** Credit scoring routes. */
const express = require('express');
const router = express.Router();
const { calculateCreditScore, getCreditScore } = require('../controllers/creditController');
const { protect } = require('../middleware/auth');

router.post('/calculate', protect, calculateCreditScore);
router.get('/', protect, getCreditScore);

module.exports = router;

