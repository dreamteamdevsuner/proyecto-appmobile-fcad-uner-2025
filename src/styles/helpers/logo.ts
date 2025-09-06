import { StyleSheet } from "react-native";
import { LOGO } from "../../constants/ui/logo";

export const logoStyles = StyleSheet.create({
  logoContainer: {
    //MOVER  A CONSTANTS NO HARDCODEAR
    width: 265,
    height: 276,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: LOGO.WIDTH,
    height: LOGO.HEIGHT,
    backgroundColor: LOGO.BACKGROUND_COLOR,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: { color: "white" },
});
