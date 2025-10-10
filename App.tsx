import React, { useCallback, useEffect, useState } from 'react';

import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import {
  MD3DarkTheme as PaperDarkTheme,
  PaperProvider,
  configureFonts,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navigator from './navigator/Navigator';
import { AuthProvider } from './appContext/authContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { AppDarkTheme } from './app/private/shared/constants/theme/paperTheme';
import { StatusBar } from 'expo-status-bar';
//import * as NavigationBar from 'expo-navigation-bar';

SplashScreen.preventAutoHideAsync();

SplashScreen.setOptions({
  duration: 1500,
  fade: true,
});

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          RobotoRegular: require('./assets/fonts/Roboto-Regular.ttf'),
          RobotoMedium: require('./assets/fonts/Roboto-Medium.ttf'),
          RobotoLight: require('./assets/fonts/Roboto-Light.ttf'),
          RobotoThin: require('./assets/fonts/Roboto-Thin.ttf'),
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  {
    /* Configuración de la barra de navegación 
  useEffect(() => {
    const setNavBarStyle = async () => {
      await NavigationBar.setBackgroundColorAsync('#000000');
      await NavigationBar.setButtonStyleAsync('light');
      await NavigationBar.setVisibilityAsync('visible'); // 🔹 fuerza a mostrarse
      await NavigationBar.setBehaviorAsync('inset-swipe'); // 🔹 mantiene el color en gestos
    };

    setNavBarStyle();
  }, []);
  */
  }

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <AuthProvider>
        <PaperProvider theme={AppDarkTheme}>
          <NavigationContainer theme={AppDarkTheme}>
            <SafeAreaView style={{ flex: 1 }}>
              <StatusBar style="light" backgroundColor="#000000" />
              <Navigator></Navigator>
              {/* <View style={styles.contentWrapper}>
            <View style={styles.btnContainer}>
              <Button mode="outlined">Iniciar sesión</Button>
              <Button>Registrarse</Button>
            </View>
          </View> */}
            </SafeAreaView>
          </NavigationContainer>
        </PaperProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // contentWrapper: { flexDirection: 'column', gap: 2 },
  // btnContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
});
