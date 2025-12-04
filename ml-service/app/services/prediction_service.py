"""ML prediction services."""
import logging
import numpy as np
from typing import Dict, Any, Optional

from app.core.model_loader import model_loader
from app.models.schemas import (
    SensorData,
    SoilTypePrediction,
    SoilPHPrediction,
    CropTypePrediction,
    SoilQualityPrediction
)

logger = logging.getLogger(__name__)


class PredictionService:
    """Service for making ML predictions."""
    
    @staticmethod
    def _prepare_features(sensor_data: SensorData) -> np.ndarray:
        """Prepare feature array from sensor data."""
        features = np.array([[
            sensor_data.npk_n,
            sensor_data.npk_p,
            sensor_data.npk_k,
            sensor_data.soil_moisture,
            sensor_data.humidity,
            sensor_data.temperature,
            sensor_data.crop_yield_estimate or 0.0
        ]])
        return features
    
    @staticmethod
    def predict_soil_type(sensor_data: SensorData) -> SoilTypePrediction:
        """Predict soil type from sensor data."""
        try:
            model = model_loader.get_model('soil_type')
            if model is None:
                # Fallback prediction based on sensor data
                soil_types = ['Loamy', 'Clay', 'Sandy', 'Peaty', 'Saline']
                predicted_type = 'Loamy'  # Default
                logger.warning("Soil type model not loaded, using default prediction")
            else:
                features = PredictionService._prepare_features(sensor_data)
                prediction = model.predict(features)
                
                # Handle different prediction formats
                if hasattr(prediction, '__len__') and len(prediction) > 0:
                    predicted_type = str(prediction[0])
                else:
                    predicted_type = str(prediction)
                
                # Get confidence if available
                confidence = None
                if hasattr(model, 'predict_proba'):
                    try:
                        proba = model.predict_proba(features)
                        confidence = float(np.max(proba))
                    except:
                        pass
            
            return SoilTypePrediction(
                soil_type=predicted_type,
                confidence=confidence
            )
        except Exception as e:
            logger.error(f"Error predicting soil type: {str(e)}")
            return SoilTypePrediction(soil_type="Loamy", confidence=None)
    
    @staticmethod
    def predict_soil_ph(sensor_data: SensorData) -> SoilPHPrediction:
        """Predict soil pH from sensor data."""
        try:
            model = model_loader.get_model('soil_ph')
            if model is None:
                # Fallback: estimate pH from NPK and moisture
                estimated_ph = 6.5  # Neutral default
                logger.warning("Soil pH model not loaded, using default prediction")
            else:
                features = PredictionService._prepare_features(sensor_data)
                prediction = model.predict(features)
                
                if isinstance(prediction, (list, np.ndarray)):
                    estimated_ph = float(prediction[0])
                else:
                    estimated_ph = float(prediction)
            
            # Categorize pH
            if estimated_ph < 6.5:
                ph_category = "acidic"
            elif estimated_ph > 7.5:
                ph_category = "alkaline"
            else:
                ph_category = "neutral"
            
            return SoilPHPrediction(
                soil_ph=round(estimated_ph, 2),
                ph_category=ph_category
            )
        except Exception as e:
            logger.error(f"Error predicting soil pH: {str(e)}")
            return SoilPHPrediction(soil_ph=6.5, ph_category="neutral")
    
    @staticmethod
    def predict_crop_type(sensor_data: SensorData) -> CropTypePrediction:
        """Predict recommended crop type from sensor data."""
        try:
            model = model_loader.get_model('crop_type')
            if model is None:
                # Fallback: recommend based on soil conditions
                crop_types = ['Maize', 'Beans', 'Potato', 'Tomato', 'Rice', 'Wheat']
                recommended_crop = 'Maize'  # Default
                logger.warning("Crop type model not loaded, using default prediction")
            else:
                features = PredictionService._prepare_features(sensor_data)
                prediction = model.predict(features)
                
                if hasattr(prediction, '__len__') and len(prediction) > 0:
                    recommended_crop = str(prediction[0])
                else:
                    recommended_crop = str(prediction)
                
                # Get confidence if available
                confidence = None
                if hasattr(model, 'predict_proba'):
                    try:
                        proba = model.predict_proba(features)
                        confidence = float(np.max(proba))
                    except:
                        pass
            
            # Generate image URL (placeholder - in production, use actual image service)
            image_url = f"https://images.example.com/crops/{recommended_crop.lower()}.jpg"
            
            return CropTypePrediction(
                crop_type=recommended_crop,
                confidence=confidence,
                image_url=image_url
            )
        except Exception as e:
            logger.error(f"Error predicting crop type: {str(e)}")
            return CropTypePrediction(
                crop_type="Maize",
                confidence=None,
                image_url="https://images.example.com/crops/maize.jpg"
            )
    
    @staticmethod
    def predict_soil_quality(sensor_data: SensorData) -> SoilQualityPrediction:
        """Predict soil quality score from sensor data."""
        try:
            model = model_loader.get_model('soil_quality')
            if model is None:
                # Fallback: calculate quality based on NPK levels and moisture
                npk_avg = (sensor_data.npk_n + sensor_data.npk_p + sensor_data.npk_k) / 3
                quality_score = min(100, max(0, (npk_avg / 100) * 70 + (sensor_data.soil_moisture / 100) * 30))
                logger.warning("Soil quality model not loaded, using calculated score")
            else:
                features = PredictionService._prepare_features(sensor_data)
                prediction = model.predict(features)
                
                if isinstance(prediction, (list, np.ndarray)):
                    quality_score = float(prediction[0])
                else:
                    quality_score = float(prediction)
                
                # Ensure score is in valid range
                quality_score = max(0, min(100, quality_score))
            
            # Categorize quality
            if quality_score < 30:
                quality_category = "poor"
            elif quality_score < 60:
                quality_category = "fair"
            elif quality_score < 80:
                quality_category = "good"
            else:
                quality_category = "excellent"
            
            return SoilQualityPrediction(
                soil_quality_score=round(quality_score, 2),
                quality_category=quality_category
            )
        except Exception as e:
            logger.error(f"Error predicting soil quality: {str(e)}")
            return SoilQualityPrediction(
                soil_quality_score=50.0,
                quality_category="fair"
            )

