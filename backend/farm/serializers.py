from rest_framework import serializers
from .models import Field

class FieldSerializer(serializers.ModelSerializer):
    """Serializer for the Field model"""
    class Meta:
        model = Field
        fields = [
            'id', 'name', 'location', 'area', 'crop_type',
            'moisture', 'temperature', 'humidity', 'soil_ph',
            'n_level', 'p_level', 'k_level', 'last_updated', 'created_at'
        ]
        read_only_fields = ['last_updated', 'created_at']

class PredictionRequestSerializer(serializers.Serializer):
    """Serializer for prediction requests"""
    soil_moisture = serializers.FloatField(required=True)
    temperature = serializers.FloatField(required=True)
    humidity = serializers.FloatField(required=True)
    soil_ph = serializers.FloatField(required=True)
    n_level = serializers.FloatField(required=True)
    p_level = serializers.FloatField(required=True)
    k_level = serializers.FloatField(required=True)

class PredictionResponseSerializer(serializers.Serializer):
    """Serializer for prediction responses"""
    field_id = serializers.IntegerField()
    predictions = serializers.DictField(child=serializers.FloatField())
