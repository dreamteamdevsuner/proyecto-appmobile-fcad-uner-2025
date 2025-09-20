import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ROUTES from './routes';
import RecruiterHomeScreen from '../screens/RecruiterHomeScreen';
import RecruiterSwipeMatchScreen from '../screens/RecruiterSwipeMatchScreen';
import FavoritosNavigator from '../screens/favoritos/FavoritosNavigator';
import MensajeriaNavigator from '../screens/mensajeria/MensajeriaNavigator';
import { ProfileScreen } from '../../shared/ProfileScreen';
import SettingProfile from '../../shared/SettingProfile';

import { Icon, MD3Colors } from 'react-native-paper';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

import { PrivateStackParamList } from './types';

const Stack = createNativeStackNavigator();

function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Mi Perfil"
        component={ProfileScreen}
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

const Tab = createBottomTabNavigator<PrivateStackParamList>();

const RecruiterNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false,
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
        name={ROUTES.RECRUITER_PERFIL_TAB}
        component={ProfileStack}
        options={{
          headerShown: false,
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
