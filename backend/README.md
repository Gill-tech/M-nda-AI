# Múnda AI Backend

Node.js + Express + MongoDB backend for the Múnda AI platform.

## Features

- Farmer registration and authentication
- IoT sensor data processing
- ML service integration
- Crop recommendations and insights
- Credit scoring system
- SMS alerts (Twilio integration)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
   - MongoDB connection string
   - JWT secret
   - ML service URL
   - Twilio credentials (optional)

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Run the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new farmer
- `POST /api/auth/login` - Login farmer
- `GET /api/auth/me` - Get current farmer profile (protected)

### IoT & Insights
- `POST /api/iot/sensor-data` - Process IoT sensor data (protected)
- `GET /api/iot/insights` - Get latest insights (protected)

### Credit Scoring
- `POST /api/credit/calculate` - Calculate credit score (protected)
- `GET /api/credit` - Get credit score (protected)

## Environment Variables

See `.env.example` for all available configuration options.

## Project Structure

```
backend/
├── src/
│   ├── config/       # Configuration files
│   ├── controllers/  # Route controllers
│   ├── middleware/   # Express middleware
│   ├── models/       # Mongoose models
│   ├── routes/       # Express routes
│   ├── services/     # Business logic services
│   ├── utils/        # Utility functions
│   └── server.js     # Main server file
├── tests/            # Test files
├── package.json
└── README.md
```

