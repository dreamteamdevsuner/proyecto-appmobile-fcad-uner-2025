import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import InitialLoginScreen from "../screens/InitialLoginScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import HomeScreen from "../screens/HomeScreen";

//Agregar Root Stack Params Luego
const Stack = createNativeStackNavigator();
const Navigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="InitialLoginScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen
        name="InitialLoginScreen"
        component={InitialLoginScreen}
      ></Stack.Screen>
      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
      ></Stack.Screen>
      <Stack.Screen name="HomeScreen" component={HomeScreen}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default Navigator;
