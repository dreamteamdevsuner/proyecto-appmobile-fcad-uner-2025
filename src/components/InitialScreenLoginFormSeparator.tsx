import { View, StyleSheet, TouchableWithoutFeedback } from "react-native";
import React from "react";
import { Button, Text, TextInput } from "react-native-paper";

const InitialScreenLoginFormSeparator = () => {
  return (
    <View style={separator.container}>
      <View style={separator.decoration}></View>
      <Text variant="labelSmall"> o Inicia con</Text>
      <View style={separator.decoration}></View>
    </View>
  );
};
const separator = StyleSheet.create({
  container: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 10,
  },
  decoration: { height: 2, backgroundColor: "lightgray", flex: 1 },
});

export default InitialScreenLoginFormSeparator;
