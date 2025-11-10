import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';

import { useAuth } from '../appContext/authContext';
import PrivateNavigator from '../app/private/privateNavigator/PrivateNavigator';
import PublicNavigator from '../app/public/PublicNavigator';
import * as SplashScreen from 'expo-splash-screen';
import { supabase } from '../supabase/supabaseClient';
import { getUser, SecureStoreItem } from '@utils/secure-store';
import { getItemAsync, setItemAsync } from 'expo-secure-store';
import { RealtimeChannel } from '@supabase/supabase-js';
import { View, ActivityIndicator, Text } from 'react-native';

//Agregar Root Stack Params Luego
const Stack = createNativeStackNavigator();
const Navigator = () => {
  const { state, logout, restoreToken, login } = useAuth();
  const [loadSession, setLoadSession] = useState(false);
  useEffect(() => {
    setLoadSession(true);
    const { data: onAuthStateSubscription } = supabase.auth.onAuthStateChange(
      async function (e, session) {
        if (e === 'INITIAL_SESSION') {
          try {
            const refreshToken = await getItemAsync(
              SecureStoreItem.REFRESH_TOKEN,
            );

            if (refreshToken) {
              await supabase.auth.refreshSession({
                refresh_token: refreshToken,
              });

              await restoreToken();
            } else {
              setLoadSession(false);
            }
          } catch (error) {
            console.log('INITIAL SESSION ERROR', error);
          }
        }
        if (e === 'SIGNED_IN' && session) {
          await login(
            session?.user.id,
            session?.access_token,
            session.refresh_token,
          );
          setLoadSession(false);
        }
        if (e === 'SIGNED_OUT') {
          logout();
        }
        if (e === 'TOKEN_REFRESHED' && session) {
          try {
            await setItemAsync(SecureStoreItem.TOKEN, session.access_token);
            await setItemAsync(
              SecureStoreItem.REFRESH_TOKEN,
              session.refresh_token,
            );
            await restoreToken();
          } catch (error) {
            console.log('error refreshing session');
          } finally {
            setLoadSession(false);
          }
        }
      },
    );
    SplashScreen.hideAsync();

    return () => {
      return onAuthStateSubscription.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let loggedUserUpdatesListener: RealtimeChannel;
    if (state.user) {
      console.log('listening');

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
  if (loadSession) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* You can customize your splash screen or loading indicator here */}
        <ActivityIndicator size={30}></ActivityIndicator>
      </View>
    );
  }
  return state.user && !loadSession ? (
    <PrivateNavigator></PrivateNavigator>
  ) : (
    <PublicNavigator></PublicNavigator>
  );
};
export default Navigator;
