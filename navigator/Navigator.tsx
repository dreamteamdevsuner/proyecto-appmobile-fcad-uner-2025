import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';

import { useAuth } from '../appContext/authContext';
import PrivateNavigator from '../app/private/privateNavigator/PrivateNavigator';
import PublicNavigator from '../app/public/PublicNavigator';
import * as SplashScreen from 'expo-splash-screen';

//Agregar Root Stack Params Luego
const Stack = createNativeStackNavigator();
const Navigator = () => {
  const { state } = useAuth();

  useEffect(() => {
    if (state.user) {
      SplashScreen.hideAsync();
    }
  }, [state.user]);

  return state.user ? (
    <PrivateNavigator></PrivateNavigator>
  ) : (
    <PublicNavigator></PublicNavigator>
  );
};
export default Navigator;
