import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { Button, DefaultTheme, PaperProvider, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Navigator from "./src/navigator/Navigator";

export default function App() {
  return (
    //hardcodeando paleta custom , pasando blue como primary
    <NavigationContainer>
      <PaperProvider theme={{ ...DefaultTheme, colors: { primary: "blue" } }}>
        <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
          <Navigator></Navigator>
          {/* <View style={styles.contentWrapper}>
            <View style={styles.btnContainer}>
              <Button mode="outlined">Iniciar sesión</Button>
              <Button>Registrarse</Button>
            </View>
          </View> */}
        </SafeAreaView>
      </PaperProvider>
    </NavigationContainer>
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
