import { useTheme } from "react-native-paper";

export const useDropdownTheme = () => {
  const { colors } = useTheme();

  return {
    style: {
      backgroundColor: colors.surface,
      borderColor: colors.outlineVariant ?? '#3C3C3C',
      borderWidth: 1,
      borderRadius: 30,
    },
    dropDownContainerStyle: {
      backgroundColor: colors.surface,
      borderColor: colors.outlineVariant ?? '#3C3C3C',
      borderWidth: 1,
      borderRadius: 30,
    },
    textStyle: {
      color: colors.onSurface ?? '#EAEAEA',
      fontSize: 16,
    },
    placeholderStyle: {
      color: "#A0A0A0",
      fontSize: 16,
    },
    badgeStyle: {
      backgroundColor: "#2B2B2B",
      borderRadius: 15,
      paddingHorizontal: 8,
    },
    badgeTextStyle: {
      color: colors.onSurface ?? '#EAEAEA',
      fontSize: 14,
    },
    arrowIconStyle: {
      tintColor: colors.onSurface ?? '#EAEAEA',
    },
    tickIconStyle: {
      tintColor: colors.primary || "#BEB52C",
    },
  };
};
