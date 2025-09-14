import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import HomeScreen from "../app/HomeScreen";
import ResetPasswordScreen from "../app/ResetPasswordScreen";
import AuthForm from "../components/AuthForm";
import Auth from "../app/Auth";

//Agregar Root Stack Params Luego
const Stack = createNativeStackNavigator();
const Navigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="InitialLoginScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="InitialLoginScreen" component={Auth}></Stack.Screen>
      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
      ></Stack.Screen>
      <Stack.Screen name="HomeScreen" component={HomeScreen}></Stack.Screen>
    </Stack.Navigator>
  );
};

export default Navigator;
