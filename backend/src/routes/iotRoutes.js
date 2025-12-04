/** IoT sensor data routes. */
const express = require('express');
const router = express.Router();
const { processSensorData, getLatestInsights, getIoTKitData } = require('../controllers/iotController');
const { protect } = require('../middleware/auth');

router.get('/kit/:iotKitSerial', getIoTKitData); // Public endpoint for IoT kit lookup
router.post('/sensor-data', protect, processSensorData);
router.get('/insights', protect, getLatestInsights);

module.exports = router;

