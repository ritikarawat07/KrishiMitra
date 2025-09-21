import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { TextInput, Button, RadioButton, HelperText, Divider } from 'react-native-paper';

const FieldForm = ({
  initialData = {},
  onSubmit,
  loading = false,
  submitButtonText = 'Submit',
  showCancelButton = false,
  onCancel,
  mode = 'create', // 'create' or 'edit'
}) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    location: initialData.location || '',
    area: initialData.area ? String(initialData.area) : '',
    cropType: initialData.cropType || 'wheat',
    soilMoisture: initialData.soilMoisture ? String(initialData.soilMoisture) : '',
    temperature: initialData.temperature ? String(initialData.temperature) : '',
    humidity: initialData.humidity ? String(initialData.humidity) : '',
    soilPh: initialData.soilPh ? String(initialData.soilPh) : '',
    nLevel: initialData.nLevel ? String(initialData.nLevel) : '',
    pLevel: initialData.pLevel ? String(initialData.pLevel) : '',
    kLevel: initialData.kLevel ? String(initialData.kLevel) : '',
  });

  const [errors, setErrors] = useState({});

  const cropTypes = [
    { label: 'Wheat', value: 'wheat' },
    { label: 'Rice', value: 'rice' },
    { label: 'Maize', value: 'maize' },
    { label: 'Sugarcane', value: 'sugarcane' },
    { label: 'Cotton', value: 'cotton' },
    { label: 'Vegetables', value: 'vegetables' },
    { label: 'Fruits', value: 'fruits' },
    { label: 'Other', value: 'other' },
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Field name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.area) newErrors.area = 'Area is required';
    if (isNaN(formData.area) || parseFloat(formData.area) <= 0) {
      newErrors.area = 'Please enter a valid area';
    }
    
    // Validate sensor data if in edit mode or if values are provided
    if (mode === 'edit' || formData.soilMoisture) {
      if (!formData.soilMoisture) newErrors.soilMoisture = 'Soil moisture is required';
      if (!formData.temperature) newErrors.temperature = 'Temperature is required';
      if (!formData.humidity) newErrors.humidity = 'Humidity is required';
      if (!formData.soilPh) newErrors.soilPh = 'Soil pH is required';
      if (!formData.nLevel) newErrors.nLevel = 'Nitrogen level is required';
      if (!formData.pLevel) newErrors.pLevel = 'Phosphorus level is required';
      if (!formData.kLevel) newErrors.kLevel = 'Potassium level is required';
      
      // Validate numeric values
      const numericFields = [
        'soilMoisture', 'temperature', 'humidity', 'soilPh', 
        'nLevel', 'pLevel', 'kLevel'
      ];
      
      numericFields.forEach(field => {
        if (formData[field] && isNaN(formData[field])) {
          newErrors[field] = 'Please enter a valid number';
        }
      });
      
      // Validate ranges
      if (formData.soilMoisture) {
        const moisture = parseFloat(formData.soilMoisture);
        if (moisture < 0 || moisture > 100) {
          newErrors.soilMoisture = 'Must be between 0 and 100';
        }
      }
      
      if (formData.humidity) {
        const humidity = parseFloat(formData.humidity);
        if (humidity < 0 || humidity > 100) {
          newErrors.humidity = 'Must be between 0 and 100';
        }
      }
      
      if (formData.soilPh) {
        const ph = parseFloat(formData.soilPh);
        if (ph < 0 || ph > 14) {
          newErrors.soilPh = 'Must be between 0 and 14';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Convert string numbers to numbers
      const submissionData = {
        ...formData,
        area: parseFloat(formData.area),
        ...(formData.soilMoisture && {
          soilMoisture: parseFloat(formData.soilMoisture),
          temperature: parseFloat(formData.temperature),
          humidity: parseFloat(formData.humidity),
          soilPh: parseFloat(formData.soilPh),
          nLevel: parseFloat(formData.nLevel),
          pLevel: parseFloat(formData.pLevel),
          kLevel: parseFloat(formData.kLevel),
        }),
      };
      
      onSubmit(submissionData);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Field Information</Text>
      
      <TextInput
        label="Field Name"
        value={formData.name}
        onChangeText={(text) => handleInputChange('name', text)}
        mode="outlined"
        style={styles.input}
        error={!!errors.name}
        disabled={loading}
      />
      {errors.name && (
        <HelperText type="error" visible={!!errors.name}>
          {errors.name}
        </HelperText>
      )}
      
      <TextInput
        label="Location"
        value={formData.location}
        onChangeText={(text) => handleInputChange('location', text)}
        mode="outlined"
        style={styles.input}
        error={!!errors.location}
        disabled={loading}
      />
      {errors.location && (
        <HelperText type="error">
          {errors.location}
        </HelperText>
      )}
      
      <View style={styles.row}>
        <View style={styles.halfInput}>
          <TextInput
            label="Area (acres)"
            value={formData.area}
            onChangeText={(text) => handleInputChange('area', text.replace(/[^0-9.]/g, ''))}
            keyboardType="numeric"
            mode="outlined"
            style={styles.input}
            error={!!errors.area}
            disabled={loading}
          />
          {errors.area && (
            <HelperText type="error">
              {errors.area}
            </HelperText>
          )}
        </View>
      </View>
      
      <Text style={styles.label}>Crop Type</Text>
      <View style={styles.radioGroup}>
        {cropTypes.map((crop) => (
          <View key={crop.value} style={styles.radioButton}>
            <RadioButton.Android
              value={crop.value}
              status={formData.cropType === crop.value ? 'checked' : 'unchecked'}
              onPress={() => handleInputChange('cropType', crop.value)}
              color="#4CAF50"
              disabled={loading}
            />
            <Text style={styles.radioLabel}>{crop.label}</Text>
          </View>
        ))}
      </View>
      
      {(mode === 'edit' || formData.soilMoisture) && (
        <>
          <Divider style={styles.divider} />
          <Text style={styles.sectionTitle}>Sensor Data</Text>
          
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <TextInput
                label="Soil Moisture (%)"
                value={formData.soilMoisture}
                onChangeText={(text) => handleInputChange('soilMoisture', text.replace(/[^0-9.]/g, ''))}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
                error={!!errors.soilMoisture}
                disabled={loading}
              />
              {errors.soilMoisture && (
                <HelperText type="error">
                  {errors.soilMoisture}
                </HelperText>
              )}
            </View>
            
            <View style={styles.halfInput}>
              <TextInput
                label="Temperature (°C)"
                value={formData.temperature}
                onChangeText={(text) => handleInputChange('temperature', text.replace(/[^0-9.-]/g, ''))}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
                error={!!errors.temperature}
                disabled={loading}
              />
              {errors.temperature && (
                <HelperText type="error">
                  {errors.temperature}
                </HelperText>
              )}
            </View>
          </View>
          
          <View style={styles.row}>
            <View style={styles.halfInput}>
              <TextInput
                label="Humidity (%)"
                value={formData.humidity}
                onChangeText={(text) => handleInputChange('humidity', text.replace(/[^0-9.]/g, ''))}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
                error={!!errors.humidity}
                disabled={loading}
              />
              {errors.humidity && (
                <HelperText type="error">
                  {errors.humidity}
                </HelperText>
              )}
            </View>
            
            <View style={styles.halfInput}>
              <TextInput
                label="Soil pH"
                value={formData.soilPh}
                onChangeText={(text) => handleInputChange('soilPh', text.replace(/[^0-9.]/g, ''))}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
                error={!!errors.soilPh}
                disabled={loading}
              />
              {errors.soilPh && (
                <HelperText type="error">
                  {errors.soilPh}
                </HelperText>
              )}
            </View>
          </View>
          
          <Text style={styles.sectionSubtitle}>Soil Nutrient Levels (ppm)</Text>
          
          <View style={styles.row}>
            <View style={styles.thirdInput}>
              <TextInput
                label="Nitrogen (N)"
                value={formData.nLevel}
                onChangeText={(text) => handleInputChange('nLevel', text.replace(/[^0-9.]/g, ''))}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
                error={!!errors.nLevel}
                disabled={loading}
              />
              {errors.nLevel && (
                <HelperText type="error">
                  {errors.nLevel}
                </HelperText>
              )}
            </View>
            
            <View style={styles.thirdInput}>
              <TextInput
                label="Phosphorus (P)"
                value={formData.pLevel}
                onChangeText={(text) => handleInputChange('pLevel', text.replace(/[^0-9.]/g, ''))}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
                error={!!errors.pLevel}
                disabled={loading}
              />
              {errors.pLevel && (
                <HelperText type="error">
                  {errors.pLevel}
                </HelperText>
              )}
            </View>
            
            <View style={styles.thirdInput}>
              <TextInput
                label="Potassium (K)"
                value={formData.kLevel}
                onChangeText={(text) => handleInputChange('kLevel', text.replace(/[^0-9.]/g, ''))}
                keyboardType="numeric"
                mode="outlined"
                style={styles.input}
                error={!!errors.kLevel}
                disabled={loading}
              />
              {errors.kLevel && (
                <HelperText type="error">
                  {errors.kLevel}
                </HelperText>
              )}
            </View>
          </View>
        </>
      )}
      
      <View style={styles.buttonContainer}>
        {showCancelButton && (
          <Button
            mode="outlined"
            onPress={onCancel}
            style={[styles.button, styles.cancelButton]}
            labelStyle={styles.cancelButtonText}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
        
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={[styles.button, styles.submitButton]}
          loading={loading}
          disabled={loading}
        >
          {submitButtonText}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 12,
    color: '#555',
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'white',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  halfInput: {
    width: '48%',
  },
  thirdInput: {
    width: '31%',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    marginTop: 8,
  },
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 8,
  },
  radioLabel: {
    marginLeft: 4,
    fontSize: 14,
    color: '#333',
  },
  divider: {
    marginVertical: 16,
    backgroundColor: '#e0e0e0',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: showCancelButton ? 'space-between' : 'flex-end',
    marginTop: 24,
    marginBottom: 16,
  },
  button: {
    minWidth: 120,
    borderRadius: 8,
  },
  cancelButton: {
    borderColor: '#f44336',
  },
  cancelButtonText: {
    color: '#f44336',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
  },
});

export default FieldForm;
