// Firebase imports
import { initializeApp } from 'firebase/app';
import { 
  initializeAuth, 
  getReactNativePersistence,
  signInWithPhoneNumber, 
  signOut 
} from 'firebase/auth';
import { 
  getDatabase, ref, onValue, set, push, update, remove, query, orderByChild, limitToLast, get 
} from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ------------------ Firebase Config ------------------
const firebaseConfig = {
  apiKey: "AIzaSyAPIt7VwEcJEXBiG-aaJtjrEVkNytoA9CM",
  authDomain: "krishimitra-9a885.firebaseapp.com",
  databaseURL: "https://krishimitra-9a885-default-rtdb.firebaseio.com",
  projectId: "krishimitra-9a885",
  storageBucket: "krishimitra-9a885.appspot.com",
  messagingSenderId: "510791372926",
  appId: "1:510791372926:web:d6bd44e9e3658366f6882f",
};

// ------------------ Initialize Firebase ------------------
const app = initializeApp(firebaseConfig);

// ✅ Correct Auth initialization for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const database = getDatabase(app);

// ------------------ Authentication ------------------
export const sendOTP = async (phoneNumber, appVerifier) => {
  try {
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    return confirmationResult;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

export const verifyOTP = async (confirmationResult, otp) => {
  try {
    return await confirmationResult.confirm(otp);
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

export const logOut = () => signOut(auth);

// ------------------ Realtime Database (same as yours) ------------------
export const listenToFieldData = (fieldId, callback) => {
  const fieldRef = ref(database, `fields/${fieldId}`);
  return onValue(fieldRef, (snapshot) => callback(snapshot.val()));
};

// ... keep your DB functions as is ...

// ------------------ Export ------------------
export { auth, database };