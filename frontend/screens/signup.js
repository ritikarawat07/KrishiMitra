"use client"

// screens/Signup.js
import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from "react-native"
import { Picker } from "@react-native-picker/picker"
import { auth } from "../firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"

// Language options with their display names and codes
const LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: 'हिंदी (Hindi)', value: 'hi' },
  { label: 'ଓଡ଼ିଆ (Odia)', value: 'or' },
  { label: 'বাংলা (Bengali)', value: 'bn' },
  { label: 'தமிழ் (Tamil)', value: 'ta' },
  { label: 'తెలుగు (Telugu)', value: 'te' },
  { label: 'मराठी (Marathi)', value: 'mr' },
];

export default function Signup({ navigation }) {
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    if (!phone || !password || !confirmPassword || !fullName) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    // Password strength validation
    const passwordRegex = /^(?=.[A-Za-z])(?=.\d)(?=.[@$!%#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    if (!passwordRegex.test(password)) {
      Alert.alert("Error", "Password must be at least 8 characters long, include a number, and a special character")
      return
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long")
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
      return
    }

    if (phone.length < 10) {
      Alert.alert("Error", "Please enter a valid phone number")
      return
    }

    setLoading(true)
    try {
      // For Firebase Auth using email format: phone@krishimitra.com
      const email = phone + "@krishimitra.com"
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // You can store additional user info in Firestore here
      Alert.alert("Success", "Account created successfully!")
      navigation.navigate("Login")
    } catch (err) {
      Alert.alert("Signup Failed", err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join KrishiMitra to get started</Text>
        </View>

        <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Enter your full name"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="Enter your phone number"
          placeholderTextColor="#999"
          maxLength={15}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Create a password (min 8 chars, 1 number & special char)"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
        />
        
        <View style={styles.passwordToggle}>
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.toggleText}>
              {showPassword ? 'Hide Password' : 'Show Password'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Preferred Language</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedLanguage}
            onValueChange={(itemValue) => setSelectedLanguage(itemValue)}
            style={styles.picker}
            dropdownIconColor="#2e7d32"
          >
            {LANGUAGES.map((lang) => (
              <Picker.Item key={lang.value} label={lang.label} value={lang.value} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="Confirm your password"
          placeholderTextColor="#999"
        />

        <TouchableOpacity style={styles.signupButton} onPress={handleSignup} disabled={loading}>
          <Text style={styles.signupButtonText}>{loading ? "Creating Account..." : "Create Account"}</Text>
        </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginButtonText}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: "#2e7d32",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  loginButton: {
    alignItems: "center",
    padding: 10,
  },
  loginButtonText: {
    color: "#666",
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#fff",
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  passwordToggle: {
    alignItems: 'flex-end',
    marginTop: -15,
    marginBottom: 15,
  },
  toggleText: {
    color: '#2e7d32',
    fontSize: 14,
  },
})