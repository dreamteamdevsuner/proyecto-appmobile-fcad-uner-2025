import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { scheduleDailyNotification } from '@app/private/notifications/notifications';
import { useAuth } from './appContext/authContext';
import { navigationRef } from './app/private/candidates/navigator/navigationRef';
import Navigator from './navigator/Navigator';
//import ROUTES from './app/private/candidates/navigator/routes';

//import { NavigationContainer } from '@react-navigation/native';
//import { SafeAreaView } from 'react-native-safe-area-context';
//import { StatusBar } from 'expo-status-bar';

export default function AppContent() {
  const { state } = useAuth();

  useEffect(() => {
    if (state.user?.tipousuario?.nombre === 'profesional') {
      console.log('⏰ Programando notificación para profesional');
      scheduleDailyNotification();
    } else {
      console.log('⛔ Usuario NO profesional - no se programa notificación');
    }
  }, [state.user]);

  /* Navegación al home al tocar la notificación 
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      () => {
        if (navigationRef.isReady()) {
          navigationRef.navigate(ROUTES.CANDIDATE_HOME_TAB);
        }
      },
    );
    return () => subscription.remove();
  }, []);
  */

  return <Navigator />;
}
