import React from 'react';
import ResetPasswordScreen from './ResetPasswordScreen';
import * as Linking  from 'expo-linking';
import Auth from './Auth';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import SignUpScreen from './SignUpScreen';
import PUBLIC_NAVIGATOR_ROUTES from './PUBLIC_NAVIGATOR_ROUTES';
import UpdatePasswordScreen from './UpdatePasswordScreen';

const PublicNavigator = () => {
  const Stack = createNativeStackNavigator();
 
  SplashScreen.hideAsync();
  return (
    <Stack.Navigator
      initialRouteName={PUBLIC_NAVIGATOR_ROUTES.AUTH}
      screenOptions={{ headerShown: false, orientation: 'portrait' }}
    >
      <Stack.Screen
        name={PUBLIC_NAVIGATOR_ROUTES.AUTH}
        component={Auth}
      ></Stack.Screen>
      <Stack.Screen
        name={PUBLIC_NAVIGATOR_ROUTES.RESET_PASSWORD}
        component={ResetPasswordScreen}
      ></Stack.Screen>
      <Stack.Screen
        name={PUBLIC_NAVIGATOR_ROUTES.SIGN_UP}
        component={SignUpScreen}
      ></Stack.Screen>
      <Stack.Screen
        name={PUBLIC_NAVIGATOR_ROUTES.UPDATE_PASSWORD}
        component={UpdatePasswordScreen}
      ></Stack.Screen>
    </Stack.Navigator>
  );
};

export default PublicNavigator;
