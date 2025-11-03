import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';

import { useAuth } from '../appContext/authContext';
import PrivateNavigator from '../app/private/privateNavigator/PrivateNavigator';
import PublicNavigator from '../app/public/PublicNavigator';
import * as SplashScreen from 'expo-splash-screen';
import { supabase } from '../supabase/supabaseClient';
import { getUser, SecureStoreItem } from '@utils/secure-store';
import { setItemAsync } from 'expo-secure-store';
import { RealtimeChannel } from '@supabase/supabase-js';

//Agregar Root Stack Params Luego
const Stack = createNativeStackNavigator();
const Navigator = () => {
  const { state, logout, restoreToken, login } = useAuth();

  useEffect(() => {
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
    let loggedUserUpdatesListener: RealtimeChannel;
    if (state.user) {
      console.log('listening');
      SplashScreen.hideAsync();
      // Assuming a 'profiles' table with user-specific data
      loggedUserUpdatesListener = supabase
        .channel('public:usuario')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'usuario',
            filter: `id=eq.${state.user.id}`,
          },
          (payload) => {
            console.log('Profile updated:', payload.new);
            // Update UI or application state with new profile data
          },
        )
        .subscribe();
    }
    return () => {
      if (loggedUserUpdatesListener) {
        loggedUserUpdatesListener.unsubscribe();
      }
    };
  }, [state.user]);

  return state.user ? (
    <PrivateNavigator></PrivateNavigator>
  ) : (
    <PublicNavigator></PublicNavigator>
  );
};
export default Navigator;
