import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import React from "react";
import { Button, Text, TextInput } from "react-native-paper";

const InitialScreenLoginForm = () => {
  return (
    <View style={initialScreenLoginForm.container}>
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
      <View style={initialScreenLoginForm.forgotPasswordContainer}>
        <TouchableWithoutFeedback>
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
const initialScreenLoginForm = StyleSheet.create({
  container: { flex: 3, flexDirection: "column", gap: 20 },
  forgotPasswordContainer: {},
});

export default InitialScreenLoginForm;
