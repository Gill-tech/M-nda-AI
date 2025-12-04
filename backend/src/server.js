/** Main server file. */
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const config = require('./config/config');

// Import routes
const authRoutes = require('./routes/authRoutes');
const iotRoutes = require('./routes/iotRoutes');
const creditRoutes = require('./routes/creditRoutes');

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: config.CORS_ORIGINS,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Múnda AI Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      iot: '/api/iot',
      credit: '/api/credit',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/iot', iotRoutes);
app.use('/api/credit', creditRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server running in ${config.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;

