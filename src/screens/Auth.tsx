import {
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import React from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import Logo from "../components/Logo";
import AuthForm from "../components/AuthForm";

import { Button, Text } from "react-native-paper";
//TODO move a su component
export const Divider = () => {
  // TODO GRIS MOVER A PALETTE DESPUES
  //  #cac4d0
  // TODO GRIS MOVER A PALETTE DESPUES
  const styles = StyleSheet.create({
    divider: {
      marginVertical: 30,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
    },
    dividerDecoration: {
      backgroundColor: "#cac4d0",

      height: 1.2,

      width: 106.83,
    },
  });
  return (
    <View style={styles.divider}>
      <View style={styles.dividerDecoration}></View>
      <Text variant="labelSmall"> o Inicia con</Text>
      <View style={styles.dividerDecoration}></View>
    </View>
  );
};
const GoogleLogin = () => {
  return (
    <View>
      <Divider></Divider>
      <Button
        mode="outlined"
        textColor="black"
        icon={"google"}
        buttonColor="white"
      >
        <Text>Iniciar sesión con Google</Text>
      </Button>
    </View>
  );
};
//Provisorio reemplazar el Record
interface RouteProps extends NativeStackScreenProps<Record<string, any>> {}
const Auth = ({ navigation }: RouteProps) => {
  return (
    <View style={{ paddingHorizontal: 60, paddingTop: 40 }}>
      <Logo></Logo>
      <AuthForm></AuthForm>
      <GoogleLogin></GoogleLogin>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: 40,
          justifyContent: "center",
        }}
      >
        <Text variant="labelMedium">No tengo cuenta.</Text>
        <TouchableWithoutFeedback>
          <Text
            variant="labelMedium"
            style={{ textDecorationLine: "underline" }}
          >
            Registrarme
          </Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
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
