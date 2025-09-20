import { TouchableOpacity } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ROUTES from './routes';
import CandidateHomeScreen from '../screens/CandidateHomeScreen';
import CandidateTestScreen from '../screens/CandidateTestScreen';
import MensajeriaNavigator from '../screens/mensajeria/MensajeriaNavigator';
import SettingProfile from '../../shared/SettingProfile';

import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ProfileScreen from '../../recruiter/screens/perfil';

const Stack = createNativeStackNavigator();

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={ROUTES.CANDIDATE_TEST_TAB}
        component={CandidateTestScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Perfil', { screen: 'Ajustes' })
              }
            >
              <Ionicons name="settings-outline" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen name="Ajustes" component={SettingProfile} />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

const CandidateNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName={ROUTES.CANDIDATE_HOME_TAB}
      screenOptions={{
        tabBarActiveTintColor: '#6750A4',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name={ROUTES.CANDIDATE_HOME_TAB}
        component={CandidateHomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-group-outline"
              size={size}
              color={color}
            />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name={ROUTES.CANDIDATE_TEST_TAB}
        component={CandidateTestScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="heart-outline"
              size={size}
              color={color}
            />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="Perfil"
        component={ProfileStack}
        options={{
          headerShown: false,
          headerTitle: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-circle-outline"
              size={size}
              color={color}
            />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name={ROUTES.CANDIDATE_MENSAJERIA_TAB}
        component={MensajeriaNavigator}
        options={{
          headerShown: false,
          title: 'Mensajería',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="message-outline"
              size={size}
              color={color}
            />
          ),
        }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};

export default CandidateNavigator;
