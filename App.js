import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SigninScreen from './src/screens/SigninScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import BottomTab from './src/navigation/BottomTab';
import HomeScreen from './src/screens/HomeScreen';
import { db } from './firebaseConfig';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WelcomeScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SigninScreen" component={SigninScreen} />
        <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
        <Stack.Screen name="HomeScreen" component={BottomTab} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
