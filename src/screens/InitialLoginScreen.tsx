import {
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Logo from "../components/Logo";
import InitialScreenLoginForm from "../components/InitialScreenLoginForm";
import InitialScreenLoginFormSeparator from "../components/InitialScreenLoginFormSeparator";
import { Button, Text } from "react-native-paper";
//Provisorio reemplazar el Record
interface RouteProps extends NativeStackScreenProps<Record<string, any>> {}
const InitialLoginScreen = ({ navigation }: RouteProps) => {
  return (
    <View style={initialLoginStyles.container}>
      {/* <Logo></Logo> */}
      <KeyboardAvoidingView
        style={initialLoginStyles.loginForm}
        behavior="height"
      >
        <InitialScreenLoginForm></InitialScreenLoginForm>

        <View style={initialLoginStyles.footer}>
          <InitialScreenLoginFormSeparator></InitialScreenLoginFormSeparator>
          <Button
            mode="contained"
            icon={"google"}
            style={{ backgroundColor: "white" }}
          >
            <Text>Iniciar sesión con Google</Text>
          </Button>

          <Text variant="labelSmall">
            No tengo una cuenta .
            <Text
              variant="labelSmall"
              style={{ textDecorationLine: "underline" }}
            >
              Registrarme
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
      {/* 
      <TouchableOpacity onPress={() => navigation.navigate("HomeScreen")}>
        <Text>Iniciar sesion</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("ResetPasswordScreen")}
      >
        <Text>test route</Text>
      </TouchableOpacity> */}
    </View>
  );
};
const initialLoginStyles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 60, paddingVertical: 30 },
  loginForm: { flex: 1 },
  footer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default InitialLoginScreen;
