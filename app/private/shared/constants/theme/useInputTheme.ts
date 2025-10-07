import { useTheme } from "react-native-paper";
import { ViewStyle, TextStyle } from "react-native";

export type InputTheme = {
  theme: any;
  outlineStyle: ViewStyle;
  contentStyle: TextStyle;
};

export const useInputTheme = (): InputTheme => {
  const { colors } = useTheme();

  const backgroundColor = colors.surface || "#121212";
  const borderColor = colors.outline || "#3C3C3C";
  const textColor = colors.onSurface || "#EAEAEA";

  return {
    theme: {
      roundness: 30,
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
      borderColor: colors.outlineVariant ?? '#3C3C3C',
      borderRadius: 30,
      backgroundColor: colors.surface,
    },
    contentStyle: {
      color: textColor,
      fontSize: 16,
      paddingVertical: 8,
    },
  };
};
