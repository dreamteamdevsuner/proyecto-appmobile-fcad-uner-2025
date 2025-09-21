import { View, Text } from 'react-native';
import React, { useContext } from 'react';
import HomeScreen from './HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext, Role } from '../../appContext/authContext';
import RecruiterNavigator from './recruiter/navigator/RecruiterNavigator';
import CandidateNavigator from './candidates/navigator/CandidateNavigator';
const Stack = createNativeStackNavigator();
const PrivateNavigator = () => {
  const { userState } = useContext(AuthContext);

  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="HomeScreen"
        component={
          userState.user.role === Role.candidate
            ? CandidateNavigator
            : RecruiterNavigator
        }
      ></Stack.Screen>
    </Stack.Navigator>
  );
};

export default PrivateNavigator;
