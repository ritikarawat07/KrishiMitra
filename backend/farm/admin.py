from django.contrib import admin
from .models import Field

@admin.register(Field)
class FieldAdmin(admin.ModelAdmin):
    list_display = ('name', 'crop_type', 'location', 'last_updated')
    list_filter = ('crop_type', 'last_updated')
    search_fields = ('name', 'location')
    readonly_fields = ('last_updated', 'created_at')
    fieldsets = (
        ('Field Information', {
            'fields': ('name', 'location', 'area', 'crop_type')
        }),
        ('Sensor Data', {
            'fields': (
                'moisture', 'temperature', 'humidity', 'soil_ph',
                'n_level', 'p_level', 'k_level'
            )
        }),
        ('Metadata', {
            'fields': ('last_updated', 'created_at'),
            'classes': ('collapse',)
        }),
    )
