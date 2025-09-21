import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, Searchbar, Button, Chip, ActivityIndicator } from 'react-native-paper';

const Mandi = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock data for mandi rates
  const mockMandiData = [
    { id: 1, crop: 'Wheat', variety: 'Sharbati', minPrice: 2100, maxPrice: 2300, unit: 'Quintal', market: 'Delhi Mandi', date: '2023-06-15' },
    { id: 2, crop: 'Rice', variety: 'Basmati', minPrice: 3500, maxPrice: 3800, unit: 'Quintal', market: 'Karnal Mandi', date: '2023-06-15' },
    { id: 3, crop: 'Maize', variety: 'Desi', minPrice: 1800, maxPrice: 2100, unit: 'Quintal', market: 'Nashik Mandi', date: '2023-06-15' },
    { id: 4, crop: 'Soybean', variety: 'JS-9560', minPrice: 4200, maxPrice: 4500, unit: 'Quintal', market: 'Indore Mandi', date: '2023-06-15' },
    { id: 5, crop: 'Cotton', variety: 'BT Cotton', minPrice: 6500, maxPrice: 7200, unit: 'Quintal', market: 'Yavatmal Mandi', date: '2023-06-15' },
  ];

  const [mandiData, setMandiData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const cropTypes = ['all', 'Wheat', 'Rice', 'Maize', 'Soybean', 'Cotton'];

  // Simulate API call
  const fetchMandiData = () => {
    setRefreshing(true);
    setLoading(true);
    
    // Simulate network request
    setTimeout(() => {
      setMandiData(mockMandiData);
      setFilteredData(mockMandiData);
      setRefreshing(false);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchMandiData();
  }, []);

  // Filter data based on search and selected crop
  useEffect(() => {
    let result = [...mandiData];
    
    // Filter by crop type
    if (selectedCrop !== 'all') {
      result = result.filter(item => item.crop === selectedCrop);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        item => 
          item.crop.toLowerCase().includes(query) ||
          item.variety.toLowerCase().includes(query) ||
          item.market.toLowerCase().includes(query)
      );
    }
    
    setFilteredData(result);
  }, [searchQuery, selectedCrop, mandiData]);

  const onRefresh = () => {
    fetchMandiData();
  };

  const PriceCard = ({ item }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Title style={styles.cropName}>{item.crop}</Title>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>₹{item.minPrice} - ₹{item.maxPrice}</Text>
            <Text style={styles.unit}>per {item.unit}</Text>
          </View>
        </View>
        <Text style={styles.variety}>{item.variety}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.market}>{item.market}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.headerTitle}>Mandi Rates</Title>
      </View>
      
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search crops, markets..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor="#4CAF50"
          placeholderTextColor="#999"
        />
      </View>
      
      <View style={styles.chipContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipScroll}
        >
          {cropTypes.map((crop) => (
            <Chip
              key={crop}
              selected={selectedCrop === crop}
              onPress={() => setSelectedCrop(crop)}
              style={[
                styles.chip,
                selectedCrop === crop && styles.chipSelected
              ]}
              textStyle={[
                styles.chipText,
                selectedCrop === crop && styles.chipTextSelected
              ]}
            >
              {crop.charAt(0).toUpperCase() + crop.slice(1)}
            </Chip>
          ))}
        </ScrollView>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading market rates...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#4CAF50']}
              tintColor="#4CAF50"
            />
          }
          contentContainerStyle={styles.scrollContent}
        >
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <PriceCard key={item.id} item={item} />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No data found</Text>
              <Button 
                mode="contained" 
                onPress={fetchMandiData}
                style={styles.retryButton}
                labelStyle={styles.retryButtonText}
              >
                Retry
              </Button>
            </View>
          )}
        </ScrollView>
      )}
    </View>
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
  searchContainer: {
    padding: 15,
    paddingBottom: 5,
  },
  searchBar: {
    elevation: 2,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  searchInput: {
    fontSize: 14,
  },
  chipContainer: {
    paddingVertical: 10,
    paddingLeft: 15,
  },
  chipScroll: {
    paddingRight: 15,
  },
  chip: {
    marginRight: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  chipSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  chipText: {
    color: '#333',
    fontSize: 12,
  },
  chipTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
    paddingTop: 0,
  },
  card: {
    marginBottom: 15,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: 'white',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  cropName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  unit: {
    fontSize: 12,
    color: '#999',
  },
  variety: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
    marginTop: 5,
  },
  market: {
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 20,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Mandi;
