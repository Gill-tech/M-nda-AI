# Múnda AI ML Service

FastAPI microservice for ML predictions in the Múnda AI platform.

## Features

- Soil Type Prediction
- Soil pH Prediction
- Crop Type Recommendation
- Soil Quality Scoring
- Plant Detection (from images)

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Run the service:
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

Or use the main file:
```bash
python -m app.main
```

## API Endpoints

- `POST /api/v1/predict/soil-type` - Predict soil type
- `POST /api/v1/predict/soil-ph` - Predict soil pH
- `POST /api/v1/predict/crop-type` - Recommend crop type
- `POST /api/v1/predict/soil-quality` - Predict soil quality score
- `POST /api/v1/detect-plant` - Detect plants in image
- `GET /api/v1/health` - Health check

## API Documentation

Visit `http://localhost:8001/docs` for interactive API documentation.

