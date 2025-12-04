"""Pydantic schemas for request/response models."""
from typing import Optional, List
from pydantic import BaseModel, Field


class SensorData(BaseModel):
    """IoT sensor data input."""
    npk_n: float = Field(..., description="Nitrogen level", ge=0, le=100)
    npk_p: float = Field(..., description="Phosphorus level", ge=0, le=100)
    npk_k: float = Field(..., description="Potassium level", ge=0, le=100)
    soil_moisture: float = Field(..., description="Soil moisture percentage", ge=0, le=100)
    humidity: float = Field(..., description="Air humidity percentage", ge=0, le=100)
    temperature: float = Field(..., description="Temperature in Celsius", ge=-20, le=50)
    crop_yield_estimate: Optional[float] = Field(None, description="Estimated crop yield")


class SoilTypePrediction(BaseModel):
    """Soil type prediction response."""
    soil_type: str = Field(..., description="Predicted soil type")
    confidence: Optional[float] = Field(None, description="Prediction confidence score")


class SoilPHPrediction(BaseModel):
    """Soil pH prediction response."""
    soil_ph: float = Field(..., description="Predicted soil pH value")
    ph_category: str = Field(..., description="pH category (acidic/neutral/alkaline)")


class CropTypePrediction(BaseModel):
    """Crop type prediction response."""
    crop_type: str = Field(..., description="Recommended crop type")
    confidence: Optional[float] = Field(None, description="Prediction confidence score")
    image_url: Optional[str] = Field(None, description="Crop image URL")


class SoilQualityPrediction(BaseModel):
    """Soil quality prediction response."""
    soil_quality_score: float = Field(..., description="Soil quality score (0-100)")
    quality_category: str = Field(..., description="Quality category (poor/fair/good/excellent)")


class PlantDetectionRequest(BaseModel):
    """Plant detection request."""
    image_base64: Optional[str] = Field(None, description="Base64 encoded image")
    image_url: Optional[str] = Field(None, description="Image URL")


class DetectedPlant(BaseModel):
    """Detected plant information."""
    class_name: str = Field(..., description="Detected plant class")
    confidence: float = Field(..., description="Detection confidence")
    bbox: List[float] = Field(..., description="Bounding box coordinates [x, y, width, height]")


class PlantDetectionResponse(BaseModel):
    """Plant detection response."""
    detected_plants: List[DetectedPlant] = Field(..., description="List of detected plants")
    count: int = Field(..., description="Number of plants detected")

