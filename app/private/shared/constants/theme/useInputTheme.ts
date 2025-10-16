import { useTheme } from "react-native-paper";
import { ViewStyle, TextStyle } from "react-native";

export type InputTheme = {
  theme: any;
  outlineStyle: ViewStyle;
  contentStyle: TextStyle;
  labelStyle: TextStyle;
  dropdownStyle: ViewStyle;
  dropdownContainerStyle: ViewStyle;
  textStyle: TextStyle;
};

export const useInputTheme = (): InputTheme => {
  const { colors } = useTheme();

  const backgroundColor = colors.surface || "#121212";
  const borderColor = colors.outline || "#3C3C3C";
  const textColor = colors.onSurface || "#EAEAEA";

  return {
    theme: {
      roundness: 16,
      colors: {
        primary: colors.primary,
        background: backgroundColor,
        surface: backgroundColor,
        text: textColor,
        placeholder: "#A0A0A0",
      },
    },
    outlineStyle: {
      borderWidth: 1,
      borderColor,
      backgroundColor,
      borderRadius: 16,
    },
    contentStyle: {
      color: textColor,
      fontSize: 16,
      paddingVertical: 8,
    },
    labelStyle: {
      color: textColor,
      fontSize: 14,
      marginBottom: 4,
    },
    dropdownStyle: {
      backgroundColor,
      borderColor,
      borderWidth: 1,
      borderRadius: 16,
      minHeight: 56,
    },
    dropdownContainerStyle: {
      backgroundColor,
      borderColor,
      borderWidth: 1,
      borderRadius: 16,
    },
      textStyle: {
      color: textColor,
      fontSize: 16,
    },
  };
};
