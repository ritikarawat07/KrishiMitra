import os
import joblib
import numpy as np
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.conf import settings
import firebase_admin
from firebase_admin import db
from .models import Field
from .serializers import (
    FieldSerializer, 
    PredictionRequestSerializer,
    PredictionResponseSerializer
)

class SensorDataView(APIView):
    """API view to fetch sensor data from Firebase"""
    permission_classes = [AllowAny]
    
    def get(self, request, field_id):
        try:
            # Try to get data from local database first
            try:
                field = Field.objects.get(pk=field_id)
                return Response({
                    'field_id': field_id,
                    'sensor_data': field.get_sensor_data()
                })
            except Field.DoesNotExist:
                # Fallback to Firebase if not found locally
                ref = db.reference(f'fields/{field_id}/sensor_data')
                data = ref.get()
                
                if not data:
                    return Response(
                        {'error': f'No data found for field {field_id}'},
                        status=status.HTTP_404_NOT_FOUND
                    )
                
                return Response({
                    'field_id': field_id,
                    'sensor_data': data,
                    'source': 'firebase'
                })
                
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class PredictView(APIView):
    """API view to make predictions using ML models"""
    permission_classes = [AllowAny]
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.models = self._load_models()
    
    def _load_models(self):
        """Load ML models from disk"""
        models = {}
        try:
            models['yield'] = joblib.load(os.path.join(settings.ML_MODELS_DIR, 'yield_model.pkl'))
            models['irrigation'] = joblib.load(os.path.join(settings.ML_MODELS_DIR, 'irrigation_model.pkl'))
            models['fertilization'] = joblib.load(os.path.join(settings.ML_MODELS_DIR, 'fertilization_model.pkl'))
        except Exception as e:
            print(f"Error loading models: {str(e)}")
        return models
    
    def post(self, request, field_id):
        serializer = PredictionRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Prepare input data for ML models
            input_data = np.array([[
                serializer.validated_data['soil_moisture'],
                serializer.validated_data['temperature'],
                serializer.validated_data['humidity'],
                serializer.validated_data['soil_ph'],
                serializer.validated_data['n_level'],
                serializer.validated_data['p_level'],
                serializer.validated_data['k_level']
            ]])
            
            # Make predictions
            predictions = {}
            
            # Yield prediction
            if 'yield' in self.models and self.models['yield'] is not None:
                yield_pred = self.models['yield'].predict(input_data)[0]
                predictions['yield_kg_per_ha'] = float(yield_pred)
            
            # Irrigation recommendation (binary classification)
            if 'irrigation' in self.models and self.models['irrigation'] is not None:
                irrigation_pred = self.models['irrigation'].predict(input_data)[0]
                predictions['irrigation_needed'] = bool(irrigation_pred)
            
            # Fertilizer recommendation (multi-class classification)
            if 'fertilization' in self.models and self.models['fertilization'] is not None:
                fert_pred = self.models['fertilization'].predict(input_data)[0]
                fertilizer_types = ['NPK', 'Urea', 'DAP', 'MOP', 'None']
                predictions['recommended_fertilizer'] = fertilizer_types[fert_pred] if fert_pred < len(fertilizer_types) else 'Unknown'
            
            # Save prediction to Firebase
            try:
                ref = db.reference(f'fields/{field_id}/predictions')
                ref.push().set({
                    'timestamp': {'.sv': 'timestamp'},
                    'predictions': predictions
                })
            except Exception as e:
                print(f"Warning: Could not save prediction to Firebase: {str(e)}")
            
            return Response({
                'field_id': field_id,
                'predictions': predictions
            })
            
        except Exception as e:
            return Response(
                {'error': f'Prediction failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
