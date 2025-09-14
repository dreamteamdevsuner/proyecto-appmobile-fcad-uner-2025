import { View, Text } from 'react-native';
import React from 'react';
import HomeScreen from './HomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Favoritos from './screens/favoritos';
import Mensajeria from './screens/mensajeria';
import Conversacion from './screens/conversacion';
import { PrivateStackParamList } from '../../navigator/types';
import FavoritosOferta from './screens/favoritos-oferta';

const PrivateNavigator = () => {
  const Stack = createNativeStackNavigator<PrivateStackParamList>();
  return (
    <Stack.Navigator initialRouteName='HomeScreen'>
      <Stack.Screen name='HomeScreen' component={HomeScreen}></Stack.Screen>
      <Stack.Screen name='Favoritos' component={Favoritos}></Stack.Screen>
      <Stack.Screen name='Mensajería' component={Mensajeria}></Stack.Screen>
      <Stack.Screen
        name='Conversación'
        component={Conversacion}
        options={({ route }) => ({
          title: route.params.title,
          headerShown: true,
        })}
      ></Stack.Screen>
      <Stack.Screen
        name='FavoritosOferta'
        component={FavoritosOferta}
        options={({ route }) => ({
          title: route.params.title,
          headerShown: true,
        })}
      ></Stack.Screen>
    </Stack.Navigator>
  );
};

export default PrivateNavigator;
