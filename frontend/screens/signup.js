import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

export default function Signup({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const handleSendOTP = async () => {
    try {
      const phoneNumber = '+91' + phone;
      const recaptcha = new RecaptchaVerifier('recaptcha', {}, auth);
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptcha);
      setConfirmation(confirmationResult);
      Alert.alert("OTP Sent");
    } catch (err) {
      Alert.alert("Error sending OTP", err.message);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      await confirmation.confirm(otp);
      const email = phone+'@krishimitra.com';
      await createUserWithEmailAndPassword(auth, email, formData.password);
      Alert.alert("Signup Successful");
      navigation.navigate('Login');
    } catch (err) {
      Alert.alert("OTP Verification Failed", err.message);
    }
  };

  const handleSignup = () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log('Signup data:', formData);
      setLoading(false);
      // Navigate to login after successful signup
      navigation.navigate('Login');
    }, 1000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Create Account</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          value={formData.name}
          onChangeText={(text) => setFormData({...formData, name: text})}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(text) => setFormData({...formData, email: text})}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          secureTextEntry
          value={formData.password}
          onChangeText={(text) => setFormData({...formData, password: text})}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm your password"
          secureTextEntry
          value={formData.confirmPassword}
          onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          value={phone}
          onChangeText={(text) => setPhone(text)}
          keyboardType="phone-pad"
        />
      </View>

      {!confirmation ? 
        <Button 
          mode="contained" 
          onPress={handleSendOTP}
          style={styles.signupButton}
          labelStyle={styles.buttonLabel}
        >
          Send OTP
        </Button> :
        <>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Enter OTP</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              value={otp}
              onChangeText={(text) => setOtp(text)}
              keyboardType="number-pad"
            />
          </View>
          <Button 
            mode="contained" 
            onPress={handleVerifyOTP}
            style={styles.signupButton}
            labelStyle={styles.buttonLabel}
          >
            Verify OTP & Sign Up
          </Button>
        </>
      }

      <Button 
        mode="contained" 
        onPress={handleSignup}
        style={styles.signupButton}
        labelStyle={styles.buttonLabel}
        loading={loading}
        disabled={loading}
      >
        {loading ? 'Creating Account...' : 'Sign Up'}
      </Button>

      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
      <View id="recaptcha"/>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#2E7D32',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  signupButton: {
    marginTop: 20,
    paddingVertical: 8,
    backgroundColor: '#2E7D32',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    color: '#666',
  },
  loginLink: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
});
