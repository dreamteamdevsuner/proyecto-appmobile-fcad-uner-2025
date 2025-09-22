import React from 'react';
import { TouchableOpacity, KeyboardAvoidingView } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PrivateStackParamList } from '../../navigator/types';
import ROUTES from '../../navigator/routes';
import ProfileScreen from '.';
import SettingProfile from '../../../shared/SettingProfile';
import { Ionicons } from '@expo/vector-icons';

const ProfileStack = createNativeStackNavigator<PrivateStackParamList>();

const ProfileNavigator = () => (
  <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name={ROUTES.RECRUITER_PROFILE}
        component={ProfileScreen}
        options={({ navigation }) => ({
          title: 'Mi perfil',
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 12 }}
              onPress={() => navigation.navigate(ROUTES.RECRUITER_SETTINGS)}
            >
              <Ionicons name="settings-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
      />
      <ProfileStack.Screen
        name={ROUTES.RECRUITER_SETTINGS}
        component={SettingProfile}
        options={{ title: 'Ajustes' }}
      />
    </ProfileStack.Navigator>
  </KeyboardAvoidingView>
);

export default ProfileNavigator;
