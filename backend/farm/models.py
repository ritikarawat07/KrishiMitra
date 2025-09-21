from django.db import models

class Field(models.Model):
    """
    Model to store field information and sensor data.
    """
    CROP_TYPES = [
        ('rice', 'Rice'),
        ('wheat', 'Wheat'),
        ('maize', 'Maize'),
        ('sugarcane', 'Sugarcane'),
        ('cotton', 'Cotton'),
        ('vegetables', 'Vegetables'),
        ('fruits', 'Fruits'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(max_length=255, help_text="Name of the field")
    location = models.CharField(max_length=255, blank=True, help_text="Geographical location")
    area = models.FloatField(help_text="Area in hectares", default=1.0)
    crop_type = models.CharField(max_length=20, choices=CROP_TYPES, default='other')
    moisture = models.FloatField(help_text="Soil moisture level")
    temperature = models.FloatField(help_text="Temperature in °C")
    humidity = models.FloatField(help_text="Humidity percentage")
    soil_ph = models.FloatField(help_text="Soil pH level")
    n_level = models.FloatField(help_text="Nitrogen level in soil")
    p_level = models.FloatField(help_text="Phosphorus level in soil")
    k_level = models.FloatField(help_text="Potassium level in soil")
    last_updated = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-last_updated']
        verbose_name = 'Field'
        verbose_name_plural = 'Fields'

    def __str__(self):
        return f"{self.name} ({self.get_crop_type_display()})"

    def get_sensor_data(self):
        """Return sensor data as a dictionary"""
        return {
            'moisture': self.moisture,
            'temperature': self.temperature,
            'humidity': self.humidity,
            'soil_ph': self.soil_ph,
            'n_level': self.n_level,
            'p_level': self.p_level,
            'k_level': self.k_level,
            'last_updated': self.last_updated.isoformat()
        }
