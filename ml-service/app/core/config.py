"""Configuration settings for the ML service."""
import os
from pathlib import Path
from typing import Optional

try:
    from pydantic_settings import BaseSettings
except ImportError:
    from pydantic import BaseSettings


class Settings(BaseSettings):
    """Application settings."""
    
    # API Settings
    API_V1_PREFIX: str = "/api/v1"
    PROJECT_NAME: str = "Múnda AI ML Service"
    VERSION: str = "1.0.0"
    
    # Server Settings
    HOST: str = "0.0.0.0"
    PORT: int = 8001
    
    # Model Paths
    MODELS_DIR: Path = Path(__file__).parent.parent.parent.parent / "models"
    SOIL_TYPE_MODEL: str = "styp.pkl"
    SOIL_PH_MODEL: str = "sph.pkl"
    CROP_TYPE_MODEL: str = "ctyp.pkl"
    SOIL_QUALITY_MODEL: str = "sqm.pkl"
    OBJECT_DETECTION_MODEL: str = "frozen_inference_graph.pb"
    OBJECT_DETECTION_CONFIG: str = "ssd_mobilenet_v3_large_coco_2020_01_14.pbtxt"
    COCO_LABELS: str = "coco.txt"
    
    # CORS
    CORS_ORIGINS: list = ["http://localhost:3000", "http://localhost:5000"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

