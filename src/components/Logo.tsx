import { StyleSheet, View } from "react-native";
import React from "react";
import { Card, Text } from "react-native-paper";
import { logoStyles } from "../styles/helpers/logo";

const Logo = () => {
  return (
    <View style={logoStyles.logoContainer}>
      <Card style={logoStyles.logo}>
        <Text variant="titleSmall" style={logoStyles.logoText}>
          J
        </Text>
      </Card>
    </View>
  );
};
const styles = StyleSheet.create({});

export default Logo;
