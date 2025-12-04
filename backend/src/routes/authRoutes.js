/** Authentication routes. */
const express = require('express');
const router = express.Router();
const { registerFarmer, loginFarmer, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', registerFarmer);
router.post('/login', loginFarmer);
router.get('/me', protect, getMe);

module.exports = router;

