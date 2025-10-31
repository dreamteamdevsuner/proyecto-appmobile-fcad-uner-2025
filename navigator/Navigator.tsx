import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';

import { useAuth } from '../appContext/authContext';
import PrivateNavigator from '../app/private/privateNavigator/PrivateNavigator';
import PublicNavigator from '../app/public/PublicNavigator';
import * as SplashScreen from 'expo-splash-screen';
import { supabase } from '../supabase/supabaseClient';

//Agregar Root Stack Params Luego
const Stack = createNativeStackNavigator();
const Navigator = () => {
  const { state, logout } = useAuth();

  useEffect(() => {
    console.log('here');
    const { data: onAuthStateSubscription } = supabase.auth.onAuthStateChange(
      function (e, session) {
        if (e === 'SIGNED_OUT') {
          logout();
        }
      },
    );
    return () => {
      return onAuthStateSubscription.subscription.unsubscribe();
    };
  }, []);

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
