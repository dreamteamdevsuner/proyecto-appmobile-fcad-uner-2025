import React from 'react';
import ResetPasswordScreen from './ResetPasswordScreen';
import * as Linking from 'expo-linking';
import Auth from './Auth';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import SignUpScreen from './SignUpScreen';
import PUBLIC_NAVIGATOR_ROUTES from './PUBLIC_NAVIGATOR_ROUTES';
import UpdatePasswordScreen from './UpdatePasswordScreen';
import VerificarCodigoScreen from './VerificarCodigoScreen';


export type PublicNavigatorParamList = {
  [PUBLIC_NAVIGATOR_ROUTES.AUTH]: undefined;
  [PUBLIC_NAVIGATOR_ROUTES.RESET_PASSWORD]: undefined;
  [PUBLIC_NAVIGATOR_ROUTES.SIGN_UP]: undefined;
  [PUBLIC_NAVIGATOR_ROUTES.UPDATE_PASSWORD]: { email: string };
  [PUBLIC_NAVIGATOR_ROUTES.VERIFY_REGISTER]: { email: string };
};

const Stack = createNativeStackNavigator<PublicNavigatorParamList>();

const PublicNavigator = () => {

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
      <Stack.Screen
        name={PUBLIC_NAVIGATOR_ROUTES.VERIFY_REGISTER}
        component={VerificarCodigoScreen}
      ></Stack.Screen>
    </Stack.Navigator>
  );
};

export default PublicNavigator;
