import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { Card, Title, TextInput, Button, Divider, ProgressBar, RadioButton, HelperText } from 'react-native-paper';

const YieldPrediction = () => {
  const [formData, setFormData] = useState({
    fieldId: '',
    cropType: 'wheat',
    soilMoisture: '',
    temperature: '',
    humidity: '',
    soilPh: '',
    nLevel: '',
    pLevel: '',
    kLevel: '',
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const cropTypes = [
    { label: 'Wheat', value: 'wheat' },
    { label: 'Rice', value: 'rice' },
    { label: 'Maize', value: 'maize' },
    { label: 'Sugarcane', value: 'sugarcane' },
    { label: 'Cotton', value: 'cotton' },
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fieldId) newErrors.fieldId = 'Field ID is required';
    if (!formData.soilMoisture) newErrors.soilMoisture = 'Soil moisture is required';
    if (!formData.temperature) newErrors.temperature = 'Temperature is required';
    if (!formData.humidity) newErrors.humidity = 'Humidity is required';
    if (!formData.soilPh) newErrors.soilPh = 'Soil pH is required';
    if (!formData.nLevel) newErrors.nLevel = 'Nitrogen level is required';
    if (!formData.pLevel) newErrors.pLevel = 'Phosphorus level is required';
    if (!formData.kLevel) newErrors.kLevel = 'Potassium level is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock prediction result
      setPrediction({
        yieldPrediction: (Math.random() * 30 + 20).toFixed(2), // 20-50 quintals
        irrigationNeeded: Math.random() > 0.5,
        recommendedFertilizer: ['Urea', 'DAP', 'MOP', 'NPK'][Math.floor(Math.random() * 4)],
        confidence: (Math.random() * 30 + 70).toFixed(0), // 70-100%
      });
      
      setLoading(false);
    }, 1500);
  };

  const resetForm = () => {
    setFormData({
      fieldId: '',
      cropType: 'wheat',
      soilMoisture: '',
      temperature: '',
      humidity: '',
      soilPh: '',
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
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Title style={styles.headerTitle}>Yield Prediction</Title>
          <Text style={styles.subtitle}>Enter field data to get predictions</Text>
        </View>
        
        <Card style={styles.formCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Field Information</Text>
            
            <TextInput
              label="Field ID"
              value={formData.fieldId}
              onChangeText={(text) => handleInputChange('fieldId', text)}
              mode="outlined"
              style={styles.input}
              error={!!errors.fieldId}
            />
            {errors.fieldId && (
              <HelperText type="error" visible={!!errors.fieldId}>
                {errors.fieldId}
              </HelperText>
            )}
            
            <Text style={styles.label}>Crop Type</Text>
            <View style={styles.radioGroup}>
              {cropTypes.map((crop) => (
                <View key={crop.value} style={styles.radioButton}>
                  <RadioButton.Android
                    value={crop.value}
                    status={formData.cropType === crop.value ? 'checked' : 'unchecked'}
                    onPress={() => handleInputChange('cropType', crop.value)}
                    color="#4CAF50"
                  />
                  <Text style={styles.radioLabel}>{crop.label}</Text>
                </View>
              ))}
            </View>
            
            <Divider style={styles.divider} />
            <Text style={styles.sectionTitle}>Environmental Data</Text>
            
            <View style={styles.row}>
              <View style={styles.inputHalf}>
                <TextInput
                  label="Soil Moisture (%)"
                  value={formData.soilMoisture}
                  onChangeText={(text) => handleInputChange('soilMoisture', text.replace(/[^0-9.]/g, ''))}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  error={!!errors.soilMoisture}
                />
                {errors.soilMoisture && (
                  <HelperText type="error">
                    {errors.soilMoisture}
                  </HelperText>
                )}
              </View>
              
              <View style={styles.inputHalf}>
                <TextInput
                  label="Temperature (°C)"
                  value={formData.temperature}
                  onChangeText={(text) => handleInputChange('temperature', text.replace(/[^0-9.]/g, ''))}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  error={!!errors.temperature}
                />
                {errors.temperature && (
                  <HelperText type="error">
                    {errors.temperature}
                  </HelperText>
                )}
              </View>
            </View>
            
            <View style={styles.row}>
              <View style={styles.inputHalf}>
                <TextInput
                  label="Humidity (%)"
                  value={formData.humidity}
                  onChangeText={(text) => handleInputChange('humidity', text.replace(/[^0-9.]/g, ''))}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  error={!!errors.humidity}
                />
                {errors.humidity && (
                  <HelperText type="error">
                    {errors.humidity}
                  </HelperText>
                )}
              </View>
              
              <View style={styles.inputHalf}>
                <TextInput
                  label="Soil pH"
                  value={formData.soilPh}
                  onChangeText={(text) => handleInputChange('soilPh', text.replace(/[^0-9.]/g, ''))}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  error={!!errors.soilPh}
                />
                {errors.soilPh && (
                  <HelperText type="error">
                    {errors.soilPh}
                  </HelperText>
                )}
              </View>
            </View>
            
            <Divider style={styles.divider} />
            <Text style={styles.sectionTitle}>Soil Nutrient Levels (ppm)</Text>
            
            <View style={styles.row}>
              <View style={styles.inputThird}>
                <TextInput
                  label="Nitrogen (N)"
                  value={formData.nLevel}
                  onChangeText={(text) => handleInputChange('nLevel', text.replace(/[^0-9.]/g, ''))}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  error={!!errors.nLevel}
                />
                {errors.nLevel && (
                  <HelperText type="error">
                    {errors.nLevel}
                  </HelperText>
                )}
              </View>
              
              <View style={styles.inputThird}>
                <TextInput
                  label="Phosphorus (P)"
                  value={formData.pLevel}
                  onChangeText={(text) => handleInputChange('pLevel', text.replace(/[^0-9.]/g, ''))}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  error={!!errors.pLevel}
                />
                {errors.pLevel && (
                  <HelperText type="error">
                    {errors.pLevel}
                  </HelperText>
                )}
              </View>
              
              <View style={styles.inputThird}>
                <TextInput
                  label="Potassium (K)"
                  value={formData.kLevel}
                  onChangeText={(text) => handleInputChange('kLevel', text.replace(/[^0-9.]/g, ''))}
                  keyboardType="numeric"
                  mode="outlined"
                  style={styles.input}
                  error={!!errors.kLevel}
                />
                {errors.kLevel && (
                  <HelperText type="error">
                    {errors.kLevel}
                  </HelperText>
                )}
              </View>
            </View>
            
            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={resetForm}
                style={[styles.button, styles.resetButton]}
                labelStyle={styles.resetButtonText}
                disabled={loading}
              >
                Reset
              </Button>
              
              <Button
                mode="contained"
                onPress={handleSubmit}
                style={[styles.button, styles.submitButton]}
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Predicting...' : 'Get Prediction'}
              </Button>
            </View>
          </Card.Content>
        </Card>
        
        {prediction && (
          <Card style={styles.resultCard}>
            <Card.Content>
              <Title style={styles.resultTitle}>Prediction Results</Title>
              
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Expected Yield:</Text>
                <Text style={styles.resultValue}>
                  {prediction.yieldPrediction} <Text style={styles.resultUnit}>quintals/acre</Text>
                </Text>
                <View style={styles.confidenceContainer}>
                  <Text style={styles.confidenceText}>
                    Confidence: {prediction.confidence}%
                  </Text>
                  <ProgressBar 
                    progress={prediction.confidence / 100} 
                    color="#4CAF50"
                    style={styles.progressBar}
                  />
                </View>
              </View>
              
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Irrigation:</Text>
                <View style={[
                  styles.statusBadge,
                  prediction.irrigationNeeded 
                    ? styles.statusWarning 
                    : styles.statusSuccess
                ]}>
                  <Text style={styles.statusText}>
                    {prediction.irrigationNeeded ? 'Required' : 'Not Required'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.resultItem}>
                <Text style={styles.resultLabel}>Recommended Fertilizer:</Text>
                <View style={styles.fertilizerBadge}>
                  <Text style={styles.fertilizerText}>
                    {prediction.recommendedFertilizer}
                  </Text>
                </View>
              </View>
              
              <Button
                mode="outlined"
                onPress={() => setPrediction(null)}
                style={styles.hideButton}
                icon="eye-off"
              >
                Hide Results
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
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#4CAF50',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 5,
  },
  formCard: {
    margin: 15,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    marginTop: 5,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 5,
  },
  radioLabel: {
    marginLeft: 5,
    color: '#333',
  },
  divider: {
    marginVertical: 15,
    backgroundColor: '#e0e0e0',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  inputHalf: {
    width: '48%',
  },
  inputThird: {
    width: '31%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  resetButton: {
    borderColor: '#4CAF50',
  },
  resetButtonText: {
    color: '#4CAF50',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
  },
  resultCard: {
    margin: 15,
    marginTop: 0,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#f9f9f9',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
  },
  resultItem: {
    marginBottom: 15,
  },
  resultLabel: {
    fontSize: 15,
    color: '#555',
    marginBottom: 5,
  },
  resultValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 5,
  },
  resultUnit: {
    fontSize: 14,
    color: '#888',
    fontWeight: 'normal',
  },
  confidenceContainer: {
    marginTop: 5,
  },
  confidenceText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e0e0e0',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusSuccess: {
    backgroundColor: '#e8f5e9',
  },
  statusWarning: {
    backgroundColor: '#fff3e0',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  fertilizerBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e3f2fd',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  fertilizerText: {
    color: '#1976d2',
    fontWeight: '500',
  },
  hideButton: {
    marginTop: 15,
    borderColor: '#4CAF50',
  },
});

export default YieldPrediction;
