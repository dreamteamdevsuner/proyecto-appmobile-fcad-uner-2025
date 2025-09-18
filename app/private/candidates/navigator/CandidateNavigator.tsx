import { View, Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ROUTES from '../routes';
import CandidateHomeScreen from '../screens/CandidateHomeScreen';
import CandidateTestScreen from '../screens/CandidateTestScreen';
import { ProfileScreen } from '../../shared/ProfileScreen';
import Mensajeria from '../screens/mensajeria';
import MensajeriaNavigator from '../screens/mensajeria/MensajeriaNavigator';

const Tab = createBottomTabNavigator();
const CandidateNavigator = () => {
  return (
    <Tab.Navigator initialRouteName={ROUTES.CANDIDATE_HOME}>
      <Tab.Screen
        name={ROUTES.CANDIDATE_HOME}
        component={CandidateHomeScreen}
      ></Tab.Screen>
      <Tab.Screen
        name={ROUTES.CANDIDATE_MENSAJERIA_TAB}
        component={MensajeriaNavigator}
        options={{ headerShown: false }}
      ></Tab.Screen>
      <Tab.Screen
        name={ROUTES.CANDIDATE_TEST}
        component={CandidateTestScreen}
      ></Tab.Screen>
      <Tab.Screen name="ProfileScreen" component={ProfileScreen}></Tab.Screen>
    </Tab.Navigator>
  );
};

export default CandidateNavigator;
