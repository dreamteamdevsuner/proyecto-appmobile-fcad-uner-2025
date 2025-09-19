import { TouchableOpacity } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ROUTES from '../routes';
import CandidateHomeScreen from '../screens/CandidateHomeScreen';
import CandidateTestScreen from '../screens/CandidateTestScreen';
import { Icon } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ProfileScreen } from '../../recruiter/screens/perfil';
import ProfileNavigator from '../../recruiter/screens/perfil/ProfileNavigator';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const CandidateNavigator = () => {
  return (
    <Tab.Navigator initialRouteName={ROUTES.CANDIDATE_HOME} screenOptions={{}}>
      <Tab.Screen
        name={ROUTES.CANDIDATE_HOME}
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
        name={ROUTES.CANDIDATE_TEST}
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
        }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};

export default CandidateNavigator;
