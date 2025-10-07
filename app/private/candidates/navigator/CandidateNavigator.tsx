import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ROUTES from './routes';
import CandidateHomeScreen from '../screens/CandidateHomeScreen';
import MensajeriaNavigator from '../screens/mensajeria/MensajeriaNavigator';
import ProfileNavigator from '../screens/perfil/ProfileNavigator';
import FavoritosNavigator from '../screens/favoritos/FavoritosNavigator';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import JobsyHeader from '../../../../components/ui/JobsyHeader';

const Tab = createBottomTabNavigator();

const CandidateNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName={ROUTES.CANDIDATE_HOME_TAB}
      screenOptions={{
        tabBarActiveTintColor: '#BEB52C',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name={ROUTES.CANDIDATE_HOME_TAB}
        component={CandidateHomeScreen}

        options={{
          headerTitle: 'Jobsy',
          tabBarIcon: ({ color, size }) => (

            <MaterialCommunityIcons
              name="account-group-outline"
              size={size}
              color={color}
            />
          ),

          header: ({ options }) => <JobsyHeader headerTitle={options.headerTitle?.toString() ?? 'placeholder title'}></JobsyHeader>
        }}

      />
      <Tab.Screen
        name={ROUTES.CANDIDATE_FAVORITOS_TAB}
        component={FavoritosNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="heart-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.CANDIDATE_PROFILE_TAB}
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
