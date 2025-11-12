import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, KeyboardAvoidingView, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PrivateStackParamList } from '../../navigator/types';
import ROUTES from '../../navigator/routes';
import ProfileScreen from '.';
import SettingProfile from '../../../shared/perfil/ajustes/SettingProfile';
import NotificationsProfile from '../../../candidates/screens/notificaciones/NotificationsProfile';

import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@appContext/authContext';
import { useUserProfile } from '../../../../../hooks/useUserProfile';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../../../../../supabase/supabaseClient';

const ProfileStack = createNativeStackNavigator<PrivateStackParamList>();

const ProfileNavigator = () => {
  const { state } = useAuth();
  const { onRefresh } = useUserProfile(state.user?.id);
  /*  const fetchProfileRef = useRef(onRefresh);
  useEffect(() => {
    fetchProfileRef.current = onRefresh;
  }, [onRefresh]); // Runs whenever onRefresh changes
  useEffect(() => {
    let loggedUserUpdatesListener: RealtimeChannel;
    console.log('IN EFFECT');
    if (state?.user?.id) {
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
          async (payload) => {
            console.log('updating ');
            console.log('GOT SUPABASE PAYLOAD:', payload); // 👈 Add this

            if (fetchProfileRef.current) {
              console.log('UPDATING ');
              await fetchProfileRef.current();
            }
            // Update UI or application state with new profile data
          },
        )
        .subscribe();
    }
    return () => {
      console.log('UNMOUNTING');

      if (loggedUserUpdatesListener) {
        loggedUserUpdatesListener.unsubscribe();
      }
    };
  }, [state.user?.id]); */

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
      <ProfileStack.Navigator>
        <ProfileStack.Screen
          name={ROUTES.CANDIDATE_PROFILE}
          component={ProfileScreen}
          options={({ navigation }) => ({
            title: 'Mi perfil',
            headerShown: true,
            headerRight: () => (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 12,
                }}
              >
                <TouchableOpacity
                  style={{ marginRight: 16 }}
                  onPress={() => {
                    navigation.navigate(ROUTES.CANDIDATE_NOTIFICATIONS);
                  }}
                >
                  <Ionicons
                    name="notifications-outline"
                    size={24}
                    color="#F1F1F1"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  // onPress={() => navigation.navigate(ROUTES.CANDIDATE_SETTING)}
                  onPress={() => navigation.navigate(ROUTES.CANDIDATE_SETTING)}
                >
                  <Ionicons name="settings-outline" size={24} color="#F1F1F1" />
                </TouchableOpacity>
              </View>
            ),
          })}
        />
        <ProfileStack.Screen
          name={ROUTES.CANDIDATE_SETTING}
          component={SettingProfile}
          options={{ title: 'Ajustes' }}
        />
        <ProfileStack.Screen
          name={ROUTES.CANDIDATE_NOTIFICATIONS}
          component={NotificationsProfile}
          options={{ title: 'Notificaciones' }}
        />
      </ProfileStack.Navigator>
    </KeyboardAvoidingView>
  );
};

export default ProfileNavigator;
