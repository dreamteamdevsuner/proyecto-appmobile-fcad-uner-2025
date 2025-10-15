import React from 'react';
import ResetPasswordScreen from './ResetPasswordScreen';
import Auth from './Auth';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';

const PublicNavigator = () => {
  const Stack = createNativeStackNavigator();

  SplashScreen.hideAsync();
  return (
    <Stack.Navigator
      initialRouteName="Auth"
      screenOptions={{ headerShown: false, orientation: 'portrait' }}
    >
      <Stack.Screen name="Auth" component={Auth}></Stack.Screen>
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
      ></Stack.Screen>
    </Stack.Navigator>
  );
};

export default PublicNavigator;
