import { View, Text } from "react-native";
import React from "react";
import HomeScreen from "./HomeScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Favoritos from './screens/favoritos';

const PrivateNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="HomeScreen" component={HomeScreen}></Stack.Screen>
      <Stack.Screen name='Favoritos' component={Favoritos}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default PrivateNavigator;
