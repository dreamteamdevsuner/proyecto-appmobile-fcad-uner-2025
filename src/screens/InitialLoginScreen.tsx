import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
//Provisorio reemplazar el Record
interface RouteProps extends NativeStackScreenProps<Record<string, any>> {}
const InitialLoginScreen = ({ navigation }: RouteProps) => {
  return (
    <View>
      <Text>InitialLoginScreen</Text>

      <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")}>
        <Text>Iniciar sesion</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("ResetPasswordScreen")}
      >
        <Text>test route</Text>
      </TouchableOpacity>
    </View>
  );
};

export default InitialLoginScreen;
