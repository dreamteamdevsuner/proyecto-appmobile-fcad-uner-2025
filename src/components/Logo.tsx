import { StyleSheet, View } from "react-native";
import React from "react";
import { Text } from "react-native-paper";

const Logo = () => {
  return (
    <View style={styles.logoContainer}>
      <Text>J</Text>
    </View>
  );
};
const styles = StyleSheet.create({
  logoContainer: {
    padding: 20,
  },
});

export default Logo;
