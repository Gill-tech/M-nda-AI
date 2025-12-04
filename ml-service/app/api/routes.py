"""API routes for ML service."""
from fastapi import APIRouter, HTTPException
from typing import Dict, Any

from app.models.schemas import (
    SensorData,
    SoilTypePrediction,
    SoilPHPrediction,
    CropTypePrediction,
    SoilQualityPrediction,
    PlantDetectionRequest,
    PlantDetectionResponse
)
from app.services.prediction_service import PredictionService
from app.services.detection_service import DetectionService

router = APIRouter()


@router.post("/predict/soil-type", response_model=SoilTypePrediction)
async def predict_soil_type(sensor_data: SensorData) -> SoilTypePrediction:
    """Predict soil type from sensor data."""
    try:
        return PredictionService.predict_soil_type(sensor_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error predicting soil type: {str(e)}")


@router.post("/predict/soil-ph", response_model=SoilPHPrediction)
async def predict_soil_ph(sensor_data: SensorData) -> SoilPHPrediction:
    """Predict soil pH from sensor data."""
    try:
        return PredictionService.predict_soil_ph(sensor_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error predicting soil pH: {str(e)}")


@router.post("/predict/crop-type", response_model=CropTypePrediction)
async def predict_crop_type(sensor_data: SensorData) -> CropTypePrediction:
    """Predict recommended crop type from sensor data."""
    try:
        return PredictionService.predict_crop_type(sensor_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error predicting crop type: {str(e)}")


@router.post("/predict/soil-quality", response_model=SoilQualityPrediction)
async def predict_soil_quality(sensor_data: SensorData) -> SoilQualityPrediction:
    """Predict soil quality score from sensor data."""
    try:
        return PredictionService.predict_soil_quality(sensor_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error predicting soil quality: {str(e)}")


@router.post("/detect-plant", response_model=PlantDetectionResponse)
async def detect_plant(request: PlantDetectionRequest) -> PlantDetectionResponse:
    """Detect plants in an image."""
    try:
        return DetectionService.detect_plants(
            image_base64=request.image_base64,
            image_url=request.image_url
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error detecting plants: {str(e)}")


@router.get("/health")
async def health_check() -> Dict[str, Any]:
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "ML Service",
        "models_loaded": True
    }

