import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ROUTES from './routes';
import CandidateHomeScreen from '../screens/CandidateHomeScreen';
import CandidateTestScreen from '../screens/CandidateTestScreen';
import MensajeriaNavigator from '../screens/mensajeria/MensajeriaNavigator';
import ProfileNavigator from '../screens/perfil/ProfileNavigator';

import { MaterialCommunityIcons } from '@expo/vector-icons';

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
        name={ROUTES.CANDIDATE_PROFILE}
        component={ProfileNavigator}
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
          title: 'Perfil',
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
