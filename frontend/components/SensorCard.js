import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Card, ProgressBar, useTheme } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const SensorCard = ({ 
  title, 
  value, 
  unit, 
  icon, 
  color = '#4CAF50',
  min = 0,
  max = 100,
  showProgress = true,
  size = 'medium'
}) => {
  const theme = useTheme();
  const progress = (value - min) / (max - min);
  
  // Determine status color based on value
  const getStatusColor = () => {
    if (value < min + (max - min) * 0.3) return '#f44336'; // Low
    if (value > min + (max - min) * 0.7) return '#4CAF50'; // Good
    return '#FFA000'; // Medium
  };
  
  const iconSize = size === 'large' ? 28 : 20;
  const valueSize = size === 'large' ? 28 : 20;
  const titleSize = size === 'large' ? 16 : 14;
  
  return (
    <Card style={[styles.card, size === 'large' && styles.largeCard]}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            {icon && (
              <MaterialIcons 
                name={icon} 
                size={iconSize} 
                color={color} 
                style={styles.icon} 
              />
            )}
            <Text 
              style={[
                styles.title, 
                { fontSize: titleSize },
                size === 'large' && styles.largeTitle
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
          </View>
          <View style={styles.valueContainer}>
            <Text 
              style={[
                styles.value, 
                { color: getStatusColor(), fontSize: valueSize },
                size === 'large' && styles.largeValue
              ]}
            >
              {value} {unit}
            </Text>
          </View>
        </View>
        
        {showProgress && (
          <View style={styles.progressContainer}>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>{min}{unit}</Text>
              <Text style={styles.progressLabel}>{max}{unit}</Text>
            </View>
            <ProgressBar 
              progress={progress} 
              color={getStatusColor()}
              style={[styles.progressBar, { backgroundColor: theme.colors.surfaceVariant }]}
            />
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: 'white',
  },
  largeCard: {
    marginBottom: 16,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  icon: {
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flexShrink: 1,
  },
  largeTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  valueContainer: {
    marginLeft: 8,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  largeValue: {
    fontSize: 28,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 10,
    color: '#666',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
});

export default SensorCard;
