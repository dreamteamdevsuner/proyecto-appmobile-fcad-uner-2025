import { View, Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import ROUTES from './routes';
import RecruiterHomeScreen from '../screens/RecruiterHomeScreen';
import RecruiterSwipeMatchScreen, { SwipeStack } from '../screens/RecruiterSwipeMatchScreen';
import FavoritosNavigator from '../screens/favoritos/FavoritosNavigator';
import MensajeriaNavigator from '../screens/mensajeria/MensajeriaNavigator';
import CrearOfertaNavigator from '../screens/crear-oferta/CrearOfertaNavigator';
import ProfileNavigator from '../screens/perfil/ProfileNavigator';

import { Icon } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { PrivateStackParamList } from './types';
import JobsyHeader from '../../../../components/ui/JobsyHeader';

const Tab = createBottomTabNavigator<PrivateStackParamList>();

const RecruiterNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6750A4',
        tabBarInactiveTintColor: 'gray',
      }}
      initialRouteName={ROUTES.RECRUITER_SWIPE_MATCH}
    >
      <Tab.Screen
        options={{
          headerShown: true,
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

        name={ROUTES.RECRUITER_SWIPE_MATCH}
        // component={RecruiterSwipeMatchScreen}
        component={SwipeStack}
      ></Tab.Screen>
      <Tab.Screen
        name={ROUTES.RECRUITER_FAVORITOS_TAB}
        component={FavoritosNavigator}
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
        name={ROUTES.RECRUITER_PERFIL_TAB}
        component={ProfileNavigator}
        options={{
          headerShown: false,
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
        name={ROUTES.RECRUITER_MENSAJERIA_TAB}
        component={MensajeriaNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="message-outline"
              size={size}
              color={color}
            />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name={ROUTES.RECRUITER_CREAR_OFERTA}
        component={CrearOfertaNavigator}
        options={{
          title: 'Nueva Oferta',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="plus" size={size} color={color} />
          ),
        }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};

export default RecruiterNavigator;
