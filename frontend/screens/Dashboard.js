import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const Dashboard = ({ navigation }) => {
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);

  const LANGUAGES = [
    { label: 'English', value: 'en' },
    { label: 'हिंदी (Hindi)', value: 'hi' },
    { label: 'ଓଡ଼ିଆ (Odia)', value: 'or' },
    { label: 'বাংলা (Bengali)', value: 'bn' },
    { label: 'தமிழ் (Tamil)', value: 'ta' },
    { label: 'తెలుగు (Telugu)', value: 'te' },
    { label: 'मराठी (Marathi)', value: 'mr' },
  ];

  const toggleSpeaker = () => {
    setIsSpeaking(!isSpeaking);
    // In a real app, this would toggle text-to-speech
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => navigation.navigate('landing'),
        },
      ]
    );
  };
  const features = [
    {
      id: 1,
      title: 'Yield Prediction',
      description: 'Predict crop yield based on various parameters',
      icon: 'analytics',
      screen: 'YieldPrediction',
      color: '#4CAF50',
      iconLib: 'material',
      component: 'YieldPrediction'
    },
    {
      id: 2,
      title: 'Mandi Rates',
      description: 'Check live market prices for your crops',
      icon: 'store',
      screen: 'Mandi',
      color: '#FF9800',
      iconLib: 'material',
      component: 'Mandi'
    },
    {
      id: 3,
      title: 'Sensor Dashboard',
      description: 'Monitor live sensor data from your fields',
      icon: 'speedometer',
      screen: 'Sensor',
      color: '#2196F3',
      iconLib: 'material-community',
      component: 'Sensor'
    },
    {
      id: 4,
      title: 'AI Assistant',
      description: 'Get farming advice from our AI chatbot',
      icon: 'robot',
      screen: 'Chatbot',
      color: '#9C27B0',
      iconLib: 'material-community',
      component: 'Chatbot'
    }
  ];

  const renderIcon = (item) => {
    const size = 32;
    const color = '#fff';
    
    switch(item.iconLib) {
      case 'material':
        return <MaterialIcons name={item.icon} size={size} color={color} />;
      case 'material-community':
        return <MaterialCommunityIcons name={item.icon} size={size} color={color} />;
      default:
        return null;
    }
  };

  // Get current language label
  const currentLanguage = LANGUAGES.find(lang => lang.value === selectedLanguage)?.label || 'English';

  const handleFeaturePress = (screen) => {
    console.log('Navigating to:', screen);
    if (navigation && navigation.navigate) {
      navigation.navigate(screen);
    } else {
      console.error('Navigation not available');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <View style={styles.nameContainer}>
            <Text style={styles.farmerName}>Ram</Text>
            <Text style={styles.welcomeSubtitle}>Manage your farm with ease</Text>
          </View>
        </View>
      </View>
      
      {/* Quick Actions Bar */}
      <View style={styles.quickActionsBar}>
        <TouchableOpacity 
          style={styles.quickAction}
          onPress={() => setHasNotifications(false)}
        >
          <View style={styles.quickActionIcon}>
            <Text style={styles.quickActionEmoji}>🔔</Text>
            {hasNotifications && <View style={styles.notificationDot} />}
          </View>
          <Text style={styles.quickActionText}>Alerts</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickAction}
          onPress={toggleSpeaker}
        >
          <View style={[styles.quickActionIcon, styles.micButton]}>
            <Ionicons name="mic" size={20} color="#fff" />
          </View>
          <Text style={styles.quickActionText}>Voice</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickAction}
          onPress={() => setShowLanguageModal(true)}
        >
          <View style={styles.quickActionIcon}>
            <Text style={styles.quickActionEmoji}>🌐</Text>
          </View>
          <Text style={styles.quickActionText}>{LANGUAGES.find(lang => lang.value === selectedLanguage)?.label.split(' ')[0]}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickAction}
          onPress={handleLogout}
        >
          <View style={[styles.quickActionIcon, styles.logoutIcon]}>
            <Text style={styles.quickActionEmoji}>🚪</Text>
          </View>
          <Text style={[styles.quickActionText, styles.logoutText]}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.quickStats}>
        <View style={styles.quickStat}>
          <Text style={styles.weatherEmoji}>🌤️</Text>
          <Text style={styles.quickStatText}>28°C</Text>
          <Text style={styles.weatherLabel}>Partly Cloudy</Text>
        </View>
        <View style={styles.quickStat}>
          <Text style={styles.weatherEmoji}>💧</Text>
          <Text style={styles.quickStatText}>65%</Text>
          <Text style={styles.weatherLabel}>Humidity</Text>
        </View>
        <View style={styles.quickStat}>
          <Text style={styles.weatherEmoji}>🌧️</Text>
          <Text style={styles.quickStatText}>42%</Text>
          <Text style={styles.weatherLabel}>Rain Chance</Text>
        </View>
      </View>

      <View style={styles.featuresGrid}>
        {features.map((feature) => (
          <TouchableOpacity 
            key={feature.id}
            style={[styles.featureCard, { backgroundColor: feature.color }]}
            onPress={() => handleFeaturePress(feature.screen)}
          >
            <View style={styles.featureIconContainer}>
              {renderIcon(feature)}
            </View>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity 
          style={[styles.actionButton, {backgroundColor: '#4CAF50'}]}
          onPress={() => {}}
        >
          <Text style={styles.actionButtonText}>View Detailed Report</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, {borderWidth: 1, borderColor: '#4CAF50'}]}
          onPress={() => {}}
        >
          <Text style={[styles.actionButtonText, {color: '#4CAF50'}]}>Add New Field</Text>
        </TouchableOpacity>
      </View>

      {/* Language Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showLanguageModal}
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowLanguageModal(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Select Language</Text>
                <View style={styles.languageList}>
                  {LANGUAGES.map((lang) => (
                    <TouchableOpacity 
                      key={lang.value}
                      style={[
                        styles.languageItem,
                        selectedLanguage === lang.value && styles.selectedLanguage
                      ]}
                      onPress={() => {
                        setSelectedLanguage(lang.value);
                        setShowLanguageModal(false);
                      }}
                    >
                      <Text style={styles.languageText}>{lang.label}</Text>
                      {selectedLanguage === lang.value && (
                        <Ionicons name="checkmark" size={20} color="#4CAF50" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 10,
    paddingTop: 30,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  welcomeContainer: {
    marginBottom: 0,
    paddingBottom: 0,
  },
  welcomeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 0,
  },
  farmerName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 0,
  },
  welcomeSubtitle: {
    fontSize: 11,
    color: '#666',
    fontStyle: 'italic',
    marginRight: 8,
    marginTop: 0,
  },
  
  /* Quick Actions Bar */
  quickActionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    paddingTop: 5,
    paddingBottom: 8,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  quickAction: {
    alignItems: 'center',
    minWidth: 60,
    paddingTop: 4,
  },
  quickActionIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  micButton: {
    backgroundColor: '#25D366',
    shadowColor: '#128C7E',
    shadowOpacity: 0.3,
  },
  quickActionEmoji: {
    fontSize: 16,
  },
  quickActionText: {
    fontSize: 10,
    color: '#495057',
    fontWeight: '500',
  },
  logoutIcon: {
    backgroundColor: '#fff5f5',
  },
  logoutText: {
    color: '#e74c3c',
    fontSize: 10,
  },
  actionIcons: {
    display: 'none', // Hide the old action icons
  },
  
  /* New Menu Styles */
  menuContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginTop: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuEmoji: {
    fontSize: 20,
  },
  menuTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#888',
  },
  chevron: {
    marginLeft: 'auto',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 72, // 40 (icon) + 16 (margin) + 16 (padding)
  },
  logoutItem: {
    backgroundColor: '#fff8f8',
  },
  logoutText: {
    color: '#e74c3c',
  },
  notificationDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF3B30',
  },
  speakerToggle: {
    width: 40,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    marginLeft: 'auto',
    padding: 2,
    justifyContent: 'center',
  },
  speakerOn: {
    backgroundColor: '#4CAF50',
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignSelf: 'flex-end',
  },
  languageButton: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    minWidth: 50,
    alignItems: 'center',
  },
  languageText: {
    color: '#333',
    fontSize: 11,
    fontWeight: '500',
  },
  logoutButton: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: '#f8d7da',
    borderRadius: 10,
    minWidth: 50,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#721c24',
    fontSize: 11,
    fontWeight: '500',
  },
  actionIcon: {
    padding: 6,
    position: 'relative',
  },
  emojiIcon: {
    fontSize: 20,
  },
  notificationBadge: {
    position: 'absolute',
    right: 4,
    top: 4,
    backgroundColor: '#FF3B30',
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  voiceAssistantContainer: {
    padding: 20,
    alignItems: 'center',
  },
  voiceAssistantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  voiceAssistantEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  voiceAssistantText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  languageList: {
    paddingBottom: 20,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedLanguage: {
    backgroundColor: '#f5faf5',
  },
  languageText: {
    fontSize: 16,
    color: '#333',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 25,
    backgroundColor: '#4CAF50',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 20,
  },
  welcomeText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 18,
  },
  farmerName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 5,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickStat: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minWidth: 100,
  },
  weatherEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  weatherLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
  quickStatText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: '600',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 15,
  },
  featureCard: {
    width: '48%',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  featureDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  quickActions: {
    padding: 15,
    marginBottom: 20,
  },
  actionButton: {
    marginVertical: 8,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default Dashboard;