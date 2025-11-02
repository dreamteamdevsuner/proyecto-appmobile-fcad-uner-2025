import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import {
  scheduleDailyNotificationProfesional,
  scheduleDailyNotificationReclutador,
} from './services/notifications/localNotification.service';
import { useAuth } from './appContext/authContext';
import { navigationRef } from './navigator/navigationRef';
import Navigator from './navigator/Navigator';

export default function AppContent() {
  const { state } = useAuth();

  useEffect(() => {
    if (!state.user?.tipousuario?.nombre) return;

    if (state.user.tipousuario.nombre === 'profesional') {
      scheduleDailyNotificationProfesional();
    }

    if (state.user.tipousuario.nombre === 'reclutador') {
      scheduleDailyNotificationReclutador();
    }
  }, [state.user?.tipousuario?.nombre]);

  /*
  // Navegar al touch de la notificación
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(() => {
      if (navigationRef.isReady()) {
        navigationRef.navigate(ROUTES.CANDIDATE_HOME_TAB);
      }
    });

    return () => subscription.remove();
  }, []);
  */

  return <Navigator />;
}
