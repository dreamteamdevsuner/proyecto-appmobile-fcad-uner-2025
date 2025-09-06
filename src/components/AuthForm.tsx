import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import React from "react";
import { Button, Text, TextInput } from "react-native-paper";

const AuthForm = () => {
  return (
    <View style={authStyles.container}>
      <TextInput
        onBlur={() => {
          console.log("blur");
        }}
        label={"Correo electrónico"}
        mode="outlined"
      />
      <TextInput
        onBlur={() => {
          console.log("blur");
        }}
        label={"Contraseña"}
        mode="outlined"
      />

      <View style={authStyles.forgotPasswordContainer}>
        <TouchableWithoutFeedback style={authStyles.forgotPassword}>
          <Text
            variant="labelSmall"
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
