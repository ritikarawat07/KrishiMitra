import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Card, Title, ProgressBar, Button, IconButton } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const Sensor = () => {
  const [sensorData, setSensorData] = useState({
    temperature: 28.5,
    humidity: 65,
    soilMoisture: 42,
    nLevel: 0.5,
    pLevel: 0.3,
    kLevel: 0.6,
  });

  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock data for the chart
  const generateChartData = (value, range = 10) => {
    return {
      labels: Array(range).fill(''),
      datasets: [{
        data: Array(range).fill(0).map(() => 
          value + (Math.random() * 5 - 2.5)
        ),
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        strokeWidth: 2
      }]
    };
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '2',
      strokeWidth: '1',
      stroke: '#4CAF50'
    }
  };

  const refreshData = () => {
    // Simulate data refresh
    setSensorData({
      temperature: 25 + Math.random() * 10,
      humidity: 60 + Math.random() * 20,
      soilMoisture: 30 + Math.random() * 40,
      nLevel: Math.random(),
      pLevel: Math.random(),
      kLevel: Math.random(),
    });
    setLastUpdated(new Date());
  };

  useEffect(() => {
    const interval = setInterval(refreshData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const SensorCard = ({ title, value, unit, min, max }) => (
    <Card style={styles.sensorCard}>
      <Card.Content>
        <View style={styles.sensorHeader}>
          <Title style={styles.sensorTitle}>{title}</Title>
          <Title style={styles.sensorValue}>
            {value.toFixed(2)} {unit}
          </Title>
        </View>
        <ProgressBar 
          progress={(value - min) / (max - min)} 
          color="#4CAF50"
          style={styles.progressBar}
        />
        <View style={styles.chartContainer}>
          <LineChart
            data={generateChartData(value, 6)}
            width={Dimensions.get('window').width - 80}
            height={80}
            chartConfig={chartConfig}
            bezier
            withDots={false}
            withShadow={false}
            withInnerLines={false}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLines={false}
            style={styles.chart}
          />
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Sensor Data</Title>
        <View style={styles.headerActions}>
          <IconButton
            icon="refresh"
            size={24}
            onPress={refreshData}
            color="#fff"
          />
          <IconButton
            icon={isConnected ? 'wifi' : 'wifi-off'}
            size={24}
            onPress={() => setIsConnected(!isConnected)}
            color={isConnected ? '#4CAF50' : '#f44336'}
          />
        </View>
      </View>

      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          Last updated: {lastUpdated.toLocaleTimeString()}
        </Text>
        <View style={[styles.statusIndicator, { 
          backgroundColor: isConnected ? '#4CAF50' : '#f44336' 
        }]} />
      </View>

      <View style={styles.sensorsContainer}>
        <SensorCard 
          title="Temperature" 
          value={sensorData.temperature} 
          unit="°C" 
          min={15} 
          max={45} 
        />
        <SensorCard 
          title="Humidity" 
          value={sensorData.humidity} 
          unit="%" 
          min={20} 
          max={100} 
        />
        <SensorCard 
          title="Soil Moisture" 
          value={sensorData.soilMoisture} 
          unit="%" 
          min={0} 
          max={100} 
        />
        <SensorCard 
          title="Nitrogen (N)" 
          value={sensorData.nLevel * 100} 
          unit="%" 
          min={0} 
          max={100} 
        />
        <SensorCard 
          title="Phosphorus (P)" 
          value={sensorData.pLevel * 100} 
          unit="%" 
          min={0} 
          max={100} 
        />
        <SensorCard 
          title="Potassium (K)" 
          value={sensorData.kLevel * 100} 
          unit="%" 
          min={0} 
          max={100} 
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#4CAF50',
  },
  headerTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  sensorsContainer: {
    padding: 15,
  },
  sensorCard: {
    marginBottom: 15,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: 'white',
  },
  sensorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sensorTitle: {
    fontSize: 16,
    fontWeight: '500',
    margin: 0,
    color: '#333',
  },
  sensorValue: {
    fontSize: 16,
    fontWeight: 'bold',
    margin: 0,
    color: '#4CAF50',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 10,
    backgroundColor: '#e0e0e0',
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    marginVertical: 5,
  },
});

export default Sensor;
