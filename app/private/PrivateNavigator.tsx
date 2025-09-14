import { View, Text } from 'react-native';
import React from 'react';
import HomeScreen from './HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Favoritos from './screens/favoritos';
import Mensajeria from './screens/mensajeria';

const PrivateNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName='HomeScreen'>
      <Stack.Screen name='HomeScreen' component={HomeScreen}></Stack.Screen>
      <Stack.Screen name='Favoritos' component={Favoritos}></Stack.Screen>
      <Stack.Screen name='Mensajeria' component={Mensajeria}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default PrivateNavigator;
