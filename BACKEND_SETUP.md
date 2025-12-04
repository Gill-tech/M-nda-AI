# Múnda AI Backend Setup Guide

This document provides setup instructions for both the Node.js backend and Python ML service.

## Architecture Overview

The backend consists of two microservices:

1. **Node.js Backend** (Express + MongoDB) - Port 5000
   - Farmer authentication and management
   - IoT sensor data processing
   - Credit scoring
   - SMS alerts
   - API endpoints for frontend

2. **Python ML Service** (FastAPI) - Port 8001
   - ML model predictions
   - Soil analysis
   - Crop recommendations
   - Plant detection

## Prerequisites

- Node.js (v16 or higher)
- Python 3.8 or higher
- MongoDB (local or cloud instance)
- npm or yarn

## Setup Instructions

### 1. Python ML Service Setup

```bash
cd ml-service

# Create virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Start the service
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

The ML service will be available at `http://localhost:8001`
API documentation: `http://localhost:8001/docs`

### 2. Node.js Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your configuration:
# - MONGODB_URI (MongoDB connection string)
# - JWT_SECRET (secret key for JWT tokens)
# - ML_SERVICE_URL (http://localhost:8001)
# - Twilio credentials (optional, for SMS)

# Start MongoDB (if running locally)
# mongod

# Start the server
npm run dev  # Development mode with auto-reload
# or
npm start   # Production mode
```

The backend will be available at `http://localhost:5000`

## Environment Variables

### ML Service (.env)
```
HOST=0.0.0.0
PORT=8001
CORS_ORIGINS=http://localhost:3000,http://localhost:5000
```

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/munda-ai
JWT_SECRET=your-secret-key
ML_SERVICE_URL=http://localhost:8001
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-number
CORS_ORIGINS=http://localhost:3000
```

## API Endpoints

### Backend (Node.js)

#### Authentication
- `POST /api/auth/register` - Register farmer
- `POST /api/auth/login` - Login farmer
- `GET /api/auth/me` - Get current farmer (protected)

#### IoT & Insights
- `POST /api/iot/sensor-data` - Process IoT sensor data (protected)
- `GET /api/iot/insights` - Get latest insights (protected)

#### Credit Scoring
- `POST /api/credit/calculate` - Calculate credit score (protected)
- `GET /api/credit` - Get credit score (protected)

### ML Service (Python)

- `POST /api/v1/predict/soil-type` - Predict soil type
- `POST /api/v1/predict/soil-ph` - Predict soil pH
- `POST /api/v1/predict/crop-type` - Recommend crop type
- `POST /api/v1/predict/soil-quality` - Predict soil quality
- `POST /api/v1/detect-plant` - Detect plants in image
- `GET /api/v1/health` - Health check

## Testing the Setup

### 1. Test ML Service

```bash
curl http://localhost:8001/api/v1/health
```

### 2. Test Backend

```bash
curl http://localhost:5000/
```

### 3. Register a Farmer

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "age": 35,
    "phone": "+254712345678",
    "password": "password123",
    "cooperativeMembership": true,
    "cooperativeName": "Nakuru Farmers Coop",
    "education": "secondary",
    "farmingExperience": 10,
    "assetValue": 50000
  }'
```

### 4. Process IoT Sensor Data

```bash
# First, login to get token
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone": "+254712345678", "password": "password123"}' \
  | jq -r '.token')

# Then, send sensor data
curl -X POST http://localhost:5000/api/iot/sensor-data \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "iotKitSerial": "IOT-001",
    "npk": {"n": 60, "p": 45, "k": 40},
    "soilMoisture": 55,
    "humidity": 75,
    "temperature": 25,
    "cropYieldEstimate": 80
  }'
```

## Project Structure

```
M-nda-AI/
├── backend/              # Node.js backend
│   ├── src/
│   │   ├── config/      # Configuration
│   │   ├── controllers/ # Route controllers
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # Express routes
│   │   ├── services/    # Business logic
│   │   └── server.js    # Main server
│   └── package.json
│
├── ml-service/          # Python ML service
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── core/        # Core utilities
│   │   ├── models/     # Pydantic schemas
│   │   └── services/    # ML services
│   └── requirements.txt
│
├── models/              # ML model files (.pkl)
└── src/                 # CSV datasets
```

## Troubleshooting

### ML Service Issues

1. **Models not loading**: Ensure model files exist in `/models` directory
2. **Import errors**: Make sure all dependencies are installed
3. **Port already in use**: Change PORT in `.env`

### Backend Issues

1. **MongoDB connection error**: Check MONGODB_URI in `.env`
2. **ML service connection error**: Ensure ML service is running on port 8001
3. **JWT errors**: Check JWT_SECRET is set in `.env`

## Next Steps

1. Set up MongoDB (local or cloud like MongoDB Atlas)
2. Configure Twilio for SMS (optional)
3. Deploy services to production
4. Set up monitoring and logging
5. Add unit and integration tests

## Support

For issues or questions, please refer to the main README.md or create an issue in the repository.

