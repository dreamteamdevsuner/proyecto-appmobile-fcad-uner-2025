import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';

import { useAuth } from '../appContext/authContext';
import PrivateNavigator from '../app/private/privateNavigator/PrivateNavigator';
import PublicNavigator from '../app/public/PublicNavigator';
import * as SplashScreen from 'expo-splash-screen';
import { supabase } from '../supabase/supabaseClient';
import { getUser, SecureStoreItem } from '@utils/secure-store';
import { setItemAsync } from 'expo-secure-store';

//Agregar Root Stack Params Luego
const Stack = createNativeStackNavigator();
const Navigator = () => {
  const { state, logout, restoreToken, login } = useAuth();

  useEffect(() => {
    console.log('here');
    const { data: onAuthStateSubscription } = supabase.auth.onAuthStateChange(
      async function (e, session) {
        if (e === 'INITIAL_SESSION') {
          const user = await getUser();

          if (user) {
            await restoreToken();
          }
        }
        if (e === 'SIGNED_IN' && session) {
          await login(
            session?.user.id,
            session?.access_token,
            session.refresh_token,
          );
        }
        if (e === 'SIGNED_OUT') {
          logout();
        }
        if (e === 'TOKEN_REFRESHED' && session) {
          await setItemAsync(SecureStoreItem.TOKEN, session.access_token);
          await setItemAsync(
            SecureStoreItem.REFRESH_TOKEN,
            session.refresh_token,
          );
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
