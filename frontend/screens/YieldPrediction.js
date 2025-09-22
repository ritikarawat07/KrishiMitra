import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Text, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { Card, Title, TextInput, Button, Divider, ProgressBar, Menu, HelperText } from 'react-native-paper';
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

// Mock sensor data function (replace with real-time fetch from Firebase or API)
const fetchSensorData = () => {
  return {
    soilMoisture: (Math.random() * 50 + 30).toFixed(1), // 30-80%
    nLevel: (Math.random() * 50 + 50).toFixed(0),
    pLevel: (Math.random() * 50 + 40).toFixed(0),
    kLevel: (Math.random() * 50 + 30).toFixed(0),
  };
};

const YieldPrediction = () => {
  const scrollViewRef = useRef();
  const [menuVisible, setMenuVisible] = useState(false);
  const [location, setLocation] = useState({});
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [sensorData, setSensorData] = useState({
    soilMoisture: '--',
    nLevel: '--',
    pLevel: '--',
    kLevel: '--',
  });

  const [formData, setFormData] = useState({
    fieldName: '',
    cropType: 'wheat',
    landArea: '',
    landUnit: 'acre',
    location: 'Fetching location...',
    soilMoisture: '--',
    nLevel: '--',
    pLevel: '--',
    kLevel: '--',
  });

  // Available crop types
  const cropTypes = [
    { label: 'Wheat', value: 'wheat' },
    { label: 'Rice', value: 'rice' },
    { label: 'Maize', value: 'maize' },
    { label: 'Cotton', value: 'cotton' },
    { label: 'Sugarcane', value: 'sugarcane' },
  ];

  // Fetch device location
  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setFormData(prev => ({ ...prev, location: 'Location permission denied' }));
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        let address = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        setLocation(location.coords);
        const city = address[0]?.city || address[0]?.region || 'Unknown location';
        setFormData(prev => ({ ...prev, location: city }));
      } catch (error) {
        console.error('Error getting location:', error);
        setFormData(prev => ({ ...prev, location: 'Unable to fetch location' }));
      } finally {
        setLoadingLocation(false);
      }
    })();
  }, []);

  // Simulate real-time sensor data (replace with actual hardware API call)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate sensor data updates
      const newSensorData = {
        soilMoisture: (Math.random() * 50 + 30).toFixed(1), // 30-80%
        nLevel: (Math.random() * 50 + 50).toFixed(0),
        pLevel: (Math.random() * 50 + 40).toFixed(0),
        kLevel: (Math.random() * 50 + 30).toFixed(0),
      };
      
      setSensorData(newSensorData);
      
      // Update form data with new sensor readings
      setFormData(prev => ({
        ...prev,
        soilMoisture: newSensorData.soilMoisture,
        nLevel: newSensorData.nLevel,
        pLevel: newSensorData.pLevel,
        kLevel: newSensorData.kLevel,
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const landUnits = ['acre', 'hectare', 'bigha', 'guntha'];

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) setErrors({...errors, [name]: null});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fieldName) newErrors.fieldName = 'Field Name is required';
    if (!formData.landArea) newErrors.landArea = 'Land area is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Get crop-specific data based on crop type and growth stage
  const getCropSpecificData = (cropType) => {
    const cropData = {
      wheat: {
        name: 'Wheat',
        stages: {
          initial: { duration: 25, water: 2.5, fertilizer: 'DAP (50kg/acre)' },
          vegetative: { duration: 30, water: 3.5, fertilizer: 'Urea (50kg/acre)' },
          flowering: { duration: 25, water: 4.0, fertilizer: 'MOP (25kg/acre)' },
          maturity: { duration: 30, water: 2.5, fertilizer: 'No fertilizer needed' }
        },
        avgYield: 45, // quintals/acre
        commonPests: ['Aphids', 'Termites', 'Armyworm'],
        remedies: ['Neem oil spray', 'Garlic-chili extract', 'Biological controls']
      },
      rice: {
        name: 'Rice',
        stages: {
          initial: { duration: 30, water: 5.0, fertilizer: 'DAP (50kg/acre)' },
          vegetative: { duration: 40, water: 6.0, fertilizer: 'Urea (60kg/acre)' },
          flowering: { duration: 30, water: 7.0, fertilizer: 'MOP (30kg/acre)' },
          maturity: { duration: 30, water: 4.0, fertilizer: 'No fertilizer needed' }
        },
        avgYield: 35,
        commonPests: ['Stem borer', 'Leaf folder', 'Brown plant hopper'],
        remedies: ['Neem cake', 'Cartap hydrochloride', 'Imidacloprid']
      },
      // Add more crops as needed
    };

    return cropData[cropType] || {
      name: cropType,
      stages: {
        initial: { duration: 30, water: 3.0, fertilizer: 'NPK (50kg/acre)' },
        vegetative: { duration: 35, water: 4.0, fertilizer: 'Urea (50kg/acre)' },
        flowering: { duration: 30, water: 4.5, fertilizer: 'MOP (25kg/acre)' },
        maturity: { duration: 30, water: 2.5, fertilizer: 'No fertilizer needed' }
      },
      avgYield: 30,
      commonPests: ['General pests'],
      remedies: ['Neem oil spray', 'Organic pest control']
    };
  };

  // Calculate growth stage based on days since planting
  const getGrowthStage = (days) => {
    if (days < 25) return 'initial';
    if (days < 55) return 'vegetative';
    if (days < 85) return 'flowering';
    return 'maturity';
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    setLoading(true);

    // Get current date and time
    const now = new Date();
    const predictionTime = now.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // Simulate API call for predictions
    setTimeout(() => {
      // Get crop-specific data
      const cropData = getCropSpecificData(formData.cropType);
      
      // Calculate days since planting (random for demo, replace with actual date)
      const daysSincePlanting = Math.floor(Math.random() * 120);
      const growthStage = getGrowthStage(daysSincePlanting);
      const stageData = cropData.stages[growthStage];
      
      // Calculate yield based on soil conditions and growth stage
      const soilQualityScore = (parseFloat(formData.soilMoisture) / 100) * 0.4 + 
                             (parseFloat(formData.nLevel) / 200) * 0.2 +
                             (parseFloat(formData.pLevel) / 100) * 0.2 +
                             (parseFloat(formData.kLevel) / 150) * 0.2;
      
      const baseYield = cropData.avgYield * (0.7 + soilQualityScore * 0.6); // 70-130% of average
      const yieldValue = Math.max(10, Math.min(100, baseYield)).toFixed(1); // Clamp between 10-100
      
      // Determine irrigation needs based on soil moisture and growth stage
      const soilMoisture = parseFloat(formData.soilMoisture);
      const needsIrrigation = soilMoisture < (growthStage === 'flowering' ? 50 : 40);
      
      // Get recommendations
      const recommendations = [];
      if (soilMoisture < 30) {
        recommendations.push('Immediate irrigation required');
      } else if (needsIrrigation) {
        recommendations.push(`Irrigate with ${stageData.water} inches of water`);
      }
      
      if (parseFloat(formData.nLevel) < 50) {
        recommendations.push('Apply nitrogen-rich fertilizer');
      }
      if (parseFloat(formData.pLevel) < 30) {
        recommendations.push('Apply phosphorus-rich fertilizer');
      }
      if (parseFloat(formData.kLevel) < 40) {
        recommendations.push('Apply potassium-rich fertilizer');
      }
      
      // Calculate confidence based on data quality
      const confidence = Math.min(95, 70 + Math.random() * 25).toFixed(0);
      
      setPrediction({
        cropType: cropData.name,
        fieldName: formData.fieldName,
        predictionTime,
        yieldPrediction: yieldValue,
        irrigationNeeded: needsIrrigation,
        recommendedFertilizer: stageData.fertilizer,
        pestRemedy: cropData.remedies[Math.floor(Math.random() * cropData.remedies.length)],
        confidence,
        soilQuality: soilQualityScore > 0.7 ? 'Excellent' : soilQualityScore > 0.5 ? 'Good' : 'Needs Improvement',
        waterRequirement: `${stageData.water} inches`,
        growthStage: growthStage.charAt(0).toUpperCase() + growthStage.slice(1),
        daysToHarvest: Math.max(0, 120 - daysSincePlanting),
        recommendations,
        commonPests: cropData.commonPests,
        currentStage: growthStage,
        soilMoisture: soilMoisture.toFixed(1) + '%',
        npkLevels: {
          nitrogen: formData.nLevel + ' ppm',
          phosphorus: formData.pLevel + ' ppm',
          potassium: formData.kLevel + ' ppm'
        }
      });
      setLoading(false);
      
      // Scroll to results
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      }, 100);
    }, 1500);
  };

  const resetForm = () => {
    setFormData({
      fieldName: '',
      cropType: 'wheat',
      landArea: '',
      landUnit: 'acre',
      location: 'Gurgaon',
      soilMoisture: '',
      nLevel: '',
      pLevel: '',
      kLevel: '',
    });
    setPrediction(null);
    setErrors({});
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.header}>
          <Title style={styles.headerTitle}>Yield Prediction</Title>
          <Text style={styles.subtitle}>Enter field data to get predictions</Text>
        </View>

        <Card style={styles.formCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Crop Details</Text>

            {/* Field Name */}
            <TextInput
              label="Field Name"
              value={formData.fieldName}
              onChangeText={(text) => handleInputChange('fieldName', text)}
              mode="outlined"
              style={styles.input}
              error={!!errors.fieldName}
            />
            {errors.fieldName && <HelperText type="error">{errors.fieldName}</HelperText>}

            {/* Crop Type Dropdown */}
            <Text style={styles.label}>Crop Type</Text>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <TouchableOpacity 
                  onPress={() => setMenuVisible(true)}
                  style={[styles.input, styles.dropdownInput]}
                >
                  <Text style={styles.dropdownText}>
                    {cropTypes.find(crop => crop.value === formData.cropType)?.label || 'Select Crop'}
                  </Text>
                  <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
                </TouchableOpacity>
              }
            >
              {cropTypes.map((crop) => (
                <Menu.Item
                  key={crop.value}
                  onPress={() => {
                    handleInputChange('cropType', crop.value);
                    setMenuVisible(false);
                  }}
                  title={crop.label}
                />
              ))}
            </Menu>

            {/* Land Area */}
            <View style={styles.row}>
              <View style={styles.inputHalf}>
                <TextInput
                  label="Land Area"
                  value={formData.landArea}
                  keyboardType="numeric"
                  mode="outlined"
                  onChangeText={(text) => handleInputChange('landArea', text.replace(/[^0-9.]/g, ''))}
                  error={!!errors.landArea}
                  style={styles.input}
                />
                {errors.landArea && <HelperText type="error">{errors.landArea}</HelperText>}
              </View>
              <View style={styles.inputHalf}>
                <TextInput
                  label="Unit"
                  value={formData.landUnit}
                  mode="outlined"
                  editable={false}
                  style={styles.input}
                />
              </View>
            </View>

            {/* Autofetched Location */}
            <View style={styles.locationContainer}>
              <TextInput
                label="Location"
                value={formData.location}
                mode="outlined"
                editable={false}
                style={[styles.input, styles.locationInput]}
                right={
                  loadingLocation ? (
                    <TextInput.Icon name="loading" />
                  ) : (
                    <TextInput.Icon 
                      name="crosshairs-gps" 
                      onPress={() => {
                        setLoadingLocation(true);
                        // Retry getting location
                        // ... (you can extract the location fetching logic into a separate function)
                      }}
                    />
                  )
                }
              />
            </View>

            <Divider style={styles.divider} />

            {/* Sensor Data */}
            <Text style={styles.sectionTitle}>Real-time Sensor Data</Text>
            <View style={styles.sensorContainer}>
              <View style={styles.sensorItem}>
                <Text style={styles.sensorLabel}>🌱 Soil Moisture</Text>
                <Text style={styles.sensorValue}>{sensorData.soilMoisture}%</Text>
                <View style={styles.progressBarContainer}>
                  <ProgressBar 
                    progress={sensorData.soilMoisture / 100} 
                    color={sensorData.soilMoisture < 40 ? '#ff6b6b' : '#4caf50'} 
                    style={styles.progressBar}
                  />
                </View>
              </View>
              
              <View style={styles.sensorRow}>
                <View style={styles.sensorItem}>
                  <Text style={styles.sensorLabel}>N</Text>
                  <Text style={styles.sensorValue}>{sensorData.nLevel} ppm</Text>
                </View>
                <View style={styles.sensorItem}>
                  <Text style={styles.sensorLabel}>P</Text>
                  <Text style={styles.sensorValue}>{sensorData.pLevel} ppm</Text>
                </View>
                <View style={styles.sensorItem}>
                  <Text style={styles.sensorLabel}>K</Text>
                  <Text style={styles.sensorValue}>{sensorData.kLevel} ppm</Text>
                </View>
              </View>
              
              <View style={styles.lastUpdatedContainer}>
                <MaterialIcons name="update" size={14} color="#666" />
                <Text style={styles.lastUpdatedText}>Updated just now</Text>
              </View>
            </View>

            {/* Submit */}
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.submitButton}
              loading={loading}
              disabled={loading}
            >
              {loading ? 'Predicting...' : 'Get Prediction'}
            </Button>
            <Button
              mode="outlined"
              onPress={resetForm}
              style={[styles.resetButton, { marginTop: 10 }]}
            >
              Reset
            </Button>
          </Card.Content>
        </Card>

        {/* Prediction Results */}
        {prediction && (
          <Card style={styles.resultCard}>
            <Card.Content>
              <View style={styles.resultHeader}>
                <Title style={styles.resultTitle}>Yield Prediction</Title>
                <Text style={styles.resultSubtitle}>Predicted on: {prediction.predictionTime}</Text>
                
                <View style={styles.yieldContainer}>
                  <Text style={styles.yieldValue}>{prediction.yieldPrediction}</Text>
                  <Text style={styles.yieldUnit}>quintals/acre</Text>
                </View>
              </View>

              <View style={styles.resultSection}>
                <View style={styles.infoCard}>
                  <View style={styles.infoItem}>
                    <View style={[styles.infoIcon, {backgroundColor: 'rgba(33, 150, 243, 0.1)'}]}>
                      <MaterialIcons name="opacity" size={24} color="#2196F3" />
                    </View>
                    <View>
                      <Text style={styles.infoLabel}>Irrigation</Text>
                      <Text style={[styles.infoValue, {color: prediction.irrigationNeeded ? '#2196F3' : '#4CAF50'}]}>
                        {prediction.irrigationNeeded 
                          ? prediction.recommendations?.find(r => r.includes('irrigation')) || 'Needed'
                          : 'Not needed'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.infoItem}>
                    <View style={[styles.infoIcon, {backgroundColor: 'rgba(76, 175, 80, 0.1)'}]}>
                      <MaterialIcons name="grass" size={24} color="#4CAF50" />
                    </View>
                    <View>
                      <Text style={styles.infoLabel}>Fertilizer</Text>
                      <Text style={styles.infoValue}>{prediction.recommendedFertilizer}</Text>
                    </View>
                  </View>

                  <View style={[styles.infoItem, {borderBottomWidth: 0}]}>
                    <View style={[styles.infoIcon, {backgroundColor: 'rgba(233, 30, 99, 0.1)'}]}>
                      <MaterialIcons name="bug-report" size={24} color="#E91E63" />
                    </View>
                    <View>
                      <Text style={styles.infoLabel}>Pest Control</Text>
                      <Text style={[styles.infoValue, {color: '#E91E63'}]}>{prediction.pestRemedy}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <Button
                mode="contained"
                onPress={() => setPrediction(null)}
                style={styles.hideButton}
                icon="close"
                contentStyle={styles.hideButtonContent}
                labelStyle={styles.hideButtonLabel}
              >
                Close Report
              </Button>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    paddingBottom: 24,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputHalf: {
    width: '48%',
  },
  inputThird: {
    width: '31%',
  },
  divider: {
    marginVertical: 20,
    backgroundColor: '#e0e0e0',
    height: 1,
  },
  submitButton: {
    marginTop: 8,
    backgroundColor: '#2e7d32',
    borderRadius: 8,
    paddingVertical: 6,
  },
  resetButton: {
    borderColor: '#2e7d32',
    borderRadius: 8,
    paddingVertical: 6,
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 0,
    elevation: 3,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  infoIcon: {
    marginRight: 16,
    borderRadius: 14,
    padding: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 15,
    color: '#666',
    marginBottom: 4,
    fontFamily: 'sans-serif-medium',
    letterSpacing: 0.2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    lineHeight: 22,
  },
  progressBarContainer: {
    flex: 1,
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    elevation: 1,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1b5e20',
    borderRadius: 5,
  },
  lastUpdatedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  yieldContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginVertical: 24,
    marginBottom: 16,
  },
  yieldValue: {
    fontSize: 56,
    fontWeight: '700',
    color: '#2E7D32',
    textShadowColor: 'rgba(46, 125, 50, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  yieldUnit: {
    fontSize: 18,
    color: '#666',
    marginLeft: 6,
    fontWeight: '600',
    opacity: 0.9,
  },
  confidenceValue: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#0d47a1',
    minWidth: 40,
    textAlign: 'right',
  },
  simpleRecsContainer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  simpleRecItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    minWidth: '48%',
    elevation: 1,
  },
  simpleRecText: {
    marginLeft: 8,
    fontSize: 13,
    color: '#333',
  },
  yieldContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginVertical: 20,
    backgroundColor: '#e8f5e9',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
});

export default YieldPrediction;
