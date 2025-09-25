import React from 'react';
import { TouchableOpacity, KeyboardAvoidingView, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PrivateStackParamList } from '../../navigator/types';
import ROUTES from '../../navigator/routes';
import ProfileScreen from '.';
import SettingProfile from '../../../shared/perfil/ajustes/SettingProfile';
import NotificationsProfile from '../../../shared/NotificationsProfile';

import { Ionicons } from '@expo/vector-icons';

const ProfileStack = createNativeStackNavigator<PrivateStackParamList>();

const ProfileNavigator = () => (
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
                  color="black"
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate(ROUTES.CANDIDATE_SETTING)}
              >
                <Ionicons name="settings-outline" size={24} color="black" />
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

export default ProfileNavigator;
