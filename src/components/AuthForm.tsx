import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import React from "react";
import { Button, Text, TextInput } from "react-native-paper";
import Logo from "./Logo";

const AuthForm = () => {
  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={30}>
      <View style={authStyles.container}>
        <TextInput
          onBlur={() => {
            // Keyboard.dismiss();
          }}
          label={"Correo electrónico"}
          mode="outlined"
        />
        <TextInput
          onBlur={() => {
            // Keyboard.dismiss();
          }}
          label={"Contraseña"}
          mode="outlined"
        />

        <View style={authStyles.forgotPasswordContainer}>
          <TouchableWithoutFeedback style={authStyles.forgotPassword}>
            <Text
              variant="labelMedium"
              style={{ borderBottomColor: "black", borderBottomWidth: 1 }}
            >
              ¿Olvidaste tu contraseña ?
            </Text>
          </TouchableWithoutFeedback>
        </View>
        <Button mode="contained" style={{ backgroundColor: "black" }}>
          <Text style={{ color: "white" }}>Iniciar sesión</Text>
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};
const authStyles = StyleSheet.create({
  container: { flexDirection: "column", gap: 20 },
  forgotPasswordContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  forgotPassword: {},
});

export default AuthForm;
