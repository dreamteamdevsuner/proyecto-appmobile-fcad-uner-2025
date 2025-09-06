import { StyleSheet } from "react-native";
import { BUTTON, BUTTON_DARK, BUTTON_LIGHT } from "../../constants/ui/button";

export const button = StyleSheet.create({
  button: { width: BUTTON.WIDTH, height: BUTTON.HEIGHT },
  buttonDark: {
    backgroundColor: BUTTON_DARK,
  },
  buttonLight: {
    backgroundColor: BUTTON_LIGHT,
  },
});
