"""Model loading and management utilities."""
import pickle
import os
from pathlib import Path
from typing import Optional, Any
import logging

import numpy as np
import tensorflow as tf
from tensorflow import saved_model

from app.core.config import settings

logger = logging.getLogger(__name__)


class ModelLoader:
    """Singleton class to load and manage ML models."""
    
    _instance: Optional['ModelLoader'] = None
    _models: dict = {}
    _object_detection_model: Optional[Any] = None
    _coco_labels: Optional[list] = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelLoader, cls).__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not hasattr(self, '_initialized'):
            self._initialized = True
            self._load_all_models()
    
    def _load_pickle_model(self, model_name: str, model_file: str) -> Optional[Any]:
        """Load a pickle model file."""
        try:
            model_path = settings.MODELS_DIR / model_file
            if not model_path.exists():
                logger.error(f"Model file not found: {model_path}")
                return None
            
            with open(model_path, 'rb') as f:
                model = pickle.load(f)
            logger.info(f"Successfully loaded {model_name}: {model_path}")
            return model
        except Exception as e:
            logger.error(f"Error loading {model_name}: {str(e)}")
            return None
    
    def _load_object_detection_model(self):
        """Load TensorFlow object detection model."""
        try:
            model_path = settings.MODELS_DIR / settings.OBJECT_DETECTION_MODEL
            config_path = settings.MODELS_DIR / settings.OBJECT_DETECTION_CONFIG
            
            if not model_path.exists():
                logger.warning(f"Object detection model not found: {model_path}")
                return
            
            # Load TensorFlow model
            # Note: This is a frozen graph, we'll need to use tf.compat.v1
            # For production, consider converting to SavedModel format
            logger.info(f"Object detection model found at: {model_path}")
            # We'll implement the actual loading in the detection service
            self._object_detection_model_path = str(model_path)
            self._object_detection_config_path = str(config_path)
            
        except Exception as e:
            logger.error(f"Error loading object detection model: {str(e)}")
    
    def _load_coco_labels(self):
        """Load COCO class labels."""
        try:
            labels_path = settings.MODELS_DIR / settings.COCO_LABELS
            if not labels_path.exists():
                logger.warning(f"COCO labels not found: {labels_path}")
                return
            
            with open(labels_path, 'r') as f:
                labels = [line.strip() for line in f.readlines()]
            self._coco_labels = labels
            logger.info(f"Loaded {len(labels)} COCO labels")
        except Exception as e:
            logger.error(f"Error loading COCO labels: {str(e)}")
    
    def _load_all_models(self):
        """Load all ML models."""
        logger.info("Loading ML models...")
        
        # Load pickle models
        self._models['soil_type'] = self._load_pickle_model(
            'Soil Type', settings.SOIL_TYPE_MODEL
        )
        self._models['soil_ph'] = self._load_pickle_model(
            'Soil pH', settings.SOIL_PH_MODEL
        )
        self._models['crop_type'] = self._load_pickle_model(
            'Crop Type', settings.CROP_TYPE_MODEL
        )
        self._models['soil_quality'] = self._load_pickle_model(
            'Soil Quality', settings.SOIL_QUALITY_MODEL
        )
        
        # Load object detection model
        self._load_object_detection_model()
        
        # Load COCO labels
        self._load_coco_labels()
        
        logger.info("Model loading completed")
    
    def get_model(self, model_name: str) -> Optional[Any]:
        """Get a loaded model by name."""
        return self._models.get(model_name)
    
    def get_object_detection_paths(self) -> tuple:
        """Get object detection model paths."""
        return (
            getattr(self, '_object_detection_model_path', None),
            getattr(self, '_object_detection_config_path', None)
        )
    
    def get_coco_labels(self) -> Optional[list]:
        """Get COCO class labels."""
        return self._coco_labels


# Global model loader instance
model_loader = ModelLoader()

