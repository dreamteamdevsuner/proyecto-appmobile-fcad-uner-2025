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
import Splash from './components/SplashScreen';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { DataProvider } from './providers/DataContext';
//import * as NavigationBar from 'expo-navigation-bar';

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  SplashScreen.preventAutoHideAsync();

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

  if (!appIsReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#000000' }}>
      {showSplash ? (
        <Splash onFinish={() => setShowSplash(false)} />
      ) : (
        <AuthProvider>
          <DataProvider>
            <PaperProvider theme={AppDarkTheme}>
              <NavigationContainer theme={AppDarkTheme}>
                <SafeAreaView style={{ flex: 1 }}>
                  <StatusBar style="light" backgroundColor="#000000" />
                  <Navigator></Navigator>
                </SafeAreaView>
              </NavigationContainer>
            </PaperProvider>
          </DataProvider>
        </AuthProvider>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
