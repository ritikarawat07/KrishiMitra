import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Card, Button, Title, Paragraph } from 'react-native-paper';

const Home = ({ navigation }) => {
  const features = [
    { 
      title: 'Dashboard', 
      description: 'View your farm statistics and overview',
      icon: 'view-dashboard',
      screen: 'Dashboard'
    },
    { 
      title: 'Sensor Data', 
      description: 'Monitor real-time sensor data',
      icon: 'chart-line',
      screen: 'Sensor'
    },
    { 
      title: 'Yield Prediction', 
      description: 'Get crop yield predictions',
      icon: 'chart-areaspline',
      screen: 'YieldPrediction'
    },
    { 
      title: 'Mandi Rates', 
      description: 'Check latest market prices',
      icon: 'currency-inr',
      screen: 'Mandi'
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://via.placeholder.com/150' }} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <Text style={styles.title}>KrishiMitra</Text>
        <Text style={styles.subtitle}>Your Smart Farming Companion</Text>
      </View>

      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <TouchableOpacity 
            key={index}
            onPress={() => navigation.navigate(feature.screen)}
            activeOpacity={0.8}
          >
            <Card style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <Text style={styles.cardTitle}>{feature.title}</Text>
                <Text style={styles.cardDescription}>{feature.description}</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
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
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#4CAF50',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 5,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
  },
  featuresContainer: {
    padding: 15,
  },
  card: {
    marginBottom: 15,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: 'white',
  },
  cardContent: {
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  cardDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default Home;
