import { StyleSheet, View } from "react-native";
import React from "react";
import { Card, Text } from "react-native-paper";

const Logo = () => {
  return (
    <View style={styles.logoContainer}>
      <Card style={styles.logo}>
        <Text variant="titleSmall" style={styles.logoText}>
          J
        </Text>
      </Card>
    </View>
  );
};
const styles = StyleSheet.create({
  logoContainer: {
    display: "flex",
    flex: 1,
  },
  logo: {
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    borderRadius: 40,
  },
  logoText: { color: "white" },
});

export default Logo;
