import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { Button, DefaultTheme, PaperProvider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    //hardcodeando paleta custom , pasando blue como primary
    <PaperProvider theme={{ ...DefaultTheme, colors: { primary: "blue" } }}>
      <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
        <View style={styles.contentWrapper}>
          <View style={styles.container}>
            <Text
              style={{ textTransform: "capitalize" }}
              variant="headlineLarge"
            >
              jobsy
            </Text>
          </View>
          <View style={styles.btnContainer}>
            <Button mode="outlined">Iniciar sesión</Button>
            <Button>Registrarse</Button>
          </View>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  contentWrapper: { flexDirection: "column", gap: 2 },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
