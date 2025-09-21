import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const Dashboard = () => {
  const [sensorData, setSensorData] = useState({
    temperature: 28.5,
    humidity: 65,
    soilMoisture: 42,
    nLevel: 0.5,
    pLevel: 0.3,
    kLevel: 0.6,
  });

  // Mock data for the chart
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ['Yield Trends']
  };

  const chartConfig = {
    backgroundColor: '#4CAF50',
    backgroundGradientFrom: '#4CAF50',
    backgroundGradientTo: '#8BC34A',
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Farm Dashboard</Title>
      </View>

      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statValue}>{sensorData.temperature}°C</Title>
            <Paragraph>Temperature</Paragraph>
          </Card.Content>
        </Card>
        <Card style={styles.statCard}>
          <Card.Content>
            <Title style={styles.statValue}>{sensorData.humidity}%</Title>
            <Paragraph>Humidity</Paragraph>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.chartContainer}>
        <Card style={styles.chartCard}>
          <Card.Content>
            <Title>Yield Trend</Title>
            <LineChart
              data={chartData}
              width={Dimensions.get('window').width - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </Card.Content>
        </Card>
      </View>

      <View style={styles.quickActions}>
        <Button 
          mode="contained" 
          style={styles.actionButton}
          onPress={() => {}}
        >
          View Detailed Report
        </Button>
        <Button 
          mode="outlined" 
          style={styles.actionButton}
          onPress={() => {}}
        >
          Add New Field
        </Button>
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
    padding: 20,
    backgroundColor: '#4CAF50',
  },
  headerTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  statCard: {
    width: '48%',
    borderRadius: 12,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  chartContainer: {
    padding: 15,
  },
  chartCard: {
    borderRadius: 12,
    elevation: 3,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  quickActions: {
    padding: 15,
    marginBottom: 20,
  },
  actionButton: {
    marginVertical: 5,
    borderRadius: 8,
  },
});

export default Dashboard;
