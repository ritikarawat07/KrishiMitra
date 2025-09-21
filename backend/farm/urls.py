from django.urls import path
from . import views

app_name = 'farm'

urlpatterns = [
    path('sensor-data/<int:field_id>/', views.SensorDataView.as_view(), name='sensor-data'),
    path('predict/<int:field_id>/', views.PredictView.as_view(), name='predict'),
]
