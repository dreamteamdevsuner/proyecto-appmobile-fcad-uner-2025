import {
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Logo from "../components/Logo";
import AuthForm from "../components/AuthForm";

import { Button, Text } from "react-native-paper";
//Provisorio reemplazar el Record
interface RouteProps extends NativeStackScreenProps<Record<string, any>> {}
const Auth = ({ navigation }: RouteProps) => {
  return (
    <KeyboardAvoidingView behavior="height">
      {/* <Logo></Logo> */}
      <AuthForm></AuthForm>

      {/*   <View style={authLoginStyles.footer}>
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
      </View> */}
    </KeyboardAvoidingView>
  );
};
{
  /* const Auth = ({ navigation }: RouteProps) => {
  return (
    <View style={authLoginStyles.container}>
      <KeyboardAvoidingView style={authLoginStyles.loginForm} behavior="height">
        <Logo></Logo>
        <AuthForm></AuthForm>
      </KeyboardAvoidingView>
       <View style={authLoginStyles.footer}>
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
    </View>
  );
};*/
}
const authLoginStyles = StyleSheet.create({
  // container: { flex: 1 },
  // loginForm: { flex: 1 },
  footer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Auth;
