import React from "react";
import ResetPasswordScreen from "./ResetPasswordScreen";
import Auth from "./Auth";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const PublicNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="Auth"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Auth" component={Auth}></Stack.Screen>
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
      ></Stack.Screen>
    </Stack.Navigator>
  );
};

export default PublicNavigator;
