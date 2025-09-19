import { View, Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import RecruiterHomeScreen from '../screens/RecruiterHomeScreen';
import ROUTES from './routes';
import TestRecruiter from '../screens/TestRecruiter';
import RecruiterSwipeMatchScreen from '../screens/RecruiterSwipeMatchScreen';
import { Icon, MD3Colors } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { PrivateStackParamList } from './types';
import FavoritosNavigator from '../screens/favoritos/FavoritosNavigator';
import MensajeriaNavigator from '../screens/mensajeria/MensajeriaNavigator';
import { ProfileScreen } from '../screens/perfil';
import ProfileNavigator from '../screens/perfil/ProfileNavigator';

const Tab = createBottomTabNavigator<PrivateStackParamList>();

const RecruiterNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={ROUTES.RECRUITER_SWIPE_MATCH}
    >
      <Tab.Screen
        options={{
          headerShown: true,
          headerTitle: 'Jobsy',

          //MOVE THIS TO COMPONENT
          header: ({ options }) => {
            return (
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 20,
                }}
              >
                <Icon size={15} source={'star-circle'} color={'black'}></Icon>
                <Text> {options.headerTitle?.toString()} </Text>
              </View>
            );
          },
        }}
        //MOVE THIS TO COMPONENT
        name={ROUTES.RECRUITER_SWIPE_MATCH}
        component={RecruiterSwipeMatchScreen}
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
        name={ROUTES.RECRUITER_HOME}
        component={RecruiterHomeScreen}
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
        name={ROUTES.RECRUITER_TEST}
        component={ProfileNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-outline"
              size={size}
              color={color}
            />
          ),
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
    </Tab.Navigator>
  );
};

export default RecruiterNavigator;
