import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import {
  scheduleDailyNotificationProfesional,
  scheduleDailyNotificationReclutador,
} from '@app/private/notifications/notifications';
import { useAuth } from './appContext/authContext';
import { navigationRef } from './app/private/candidates/navigator/navigationRef';
import Navigator from './navigator/Navigator';

export default function AppContent() {
  const { state } = useAuth();

  useEffect(() => {
    if (!state.user?.tipousuario?.nombre) return;

    if (state.user.tipousuario.nombre === 'profesional') {
      console.log('⏰ Programando notificación para PROFESIONAL');
      scheduleDailyNotificationProfesional();
    }

    if (state.user.tipousuario.nombre === 'reclutador') {
      console.log('📣 Programando notificación para RECLUTADOR');
      scheduleDailyNotificationReclutador();
    }
  }, [state.user?.tipousuario?.nombre]);

  /*
  // ✅ Si querés navegar al touch de la notificación más adelante
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
