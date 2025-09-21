import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import WelcomePage from './screens/welcomepage';
import Login from './screens/login';
import Signup from './screens/signup';
import Home from './screens/Home';
import Dashboard from './screens/Dashboard';
import Sensor from './screens/Sensor';
import Mandi from './screens/Mandi';
import YieldPrediction from './screens/YieldPrediction';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="WelcomePage"
            screenOptions={{
              headerShown: false,
              headerStyle: {
                backgroundColor: '#4CAF50',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="WelcomePage" 
              component={WelcomePage} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Login" 
              component={Login} 
              options={{ title: 'Login' }} 
            />
            <Stack.Screen 
              name="Signup" 
              component={Signup} 
              options={{ title: 'Sign Up' }} 
            />
            <Stack.Screen 
              name="Home" 
              component={Home} 
              options={{ title: 'KrishiMitra' }} 
            />
            <Stack.Screen 
              name="Dashboard" 
              component={Dashboard} 
              options={{ title: 'Dashboard' }} 
            />
            <Stack.Screen 
              name="Sensor" 
              component={Sensor} 
              options={{ title: 'Sensor Data' }} 
            />
            <Stack.Screen 
              name="Mandi" 
              component={Mandi} 
              options={{ title: 'Mandi Rates' }} 
            />
            <Stack.Screen 
              name="YieldPrediction" 
              component={YieldPrediction} 
              options={{ title: 'Yield Prediction' }} 
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
};

export default App;
