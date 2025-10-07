import { MD3DarkTheme as PaperDarkTheme, configureFonts } from "react-native-paper";
import { DarkTheme as NavigationDarkTheme } from "@react-navigation/native";

const fontConfig = {
  android: {
    regular: { fontFamily: "RobotoRegular", fontWeight: "normal" },
    medium: { fontFamily: "RobotoMedium", fontWeight: "normal" },
    light: { fontFamily: "RobotoLight", fontWeight: "normal" },
    thin: { fontFamily: "RobotoThin", fontWeight: "normal" },
  },
  ios: {
    regular: { fontFamily: "RobotoRegular", fontWeight: "normal" },
    medium: { fontFamily: "RobotoMedium", fontWeight: "normal" },
    light: { fontFamily: "RobotoLight", fontWeight: "normal" },
    thin: { fontFamily: "RobotoThin", fontWeight: "normal" },
  },
};
const fonts = configureFonts({ config: fontConfig as any }) as any;

export const AppDarkTheme = {
  ...PaperDarkTheme,
  dark: true,
  roundness: 12,
  fonts,
  colors: {
  ...PaperDarkTheme.colors,
  ...NavigationDarkTheme.colors,
    primary: '#A06FA6',
    secondary: "#BEB52C",
    background: '#0A090F',
    surface: '#1D1C21',
    card: '#1D1C21',
    border: "#2C2C2C",
    text: "#EAEAEA",
    onSurface: '#EAEAEA',
    outline: '#3C3C3C',
    outlineVariant: '#333333',
    placeholder: '#999999',
    notification: '#BEB52C',
    onPrimary: '#010101', // texto en botones "contained"
    onSecondary: '#F1F1F1', // texto sobre botones secundarios si usás otros colores
  },
};