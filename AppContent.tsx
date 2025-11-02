import React, { useEffect } from 'react';
import {
  scheduleDailyNotificationProfesional,
  scheduleDailyNotificationReclutador,
} from './services/notifications/localNotification.service';
import { useAuth } from './appContext/authContext';
import Navigator from './navigator/Navigator';
import { navigationRef } from './navigator/navigationRef';
import * as Notifications from 'expo-notifications';
import { registerForPushNotifications } from './services/notifications/pushNotification.service';
import { supabase } from './supabase/supabaseClient';

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

  useEffect(() => {
    if (!state.user) return;

    async function saveToken() {
      const token = await registerForPushNotifications();
      if (!token) return;

      await supabase
        .from('usuario')
        .update({ expo_push_token: token })
        .eq('id', state.user?.id); // Actualiza el token en la base de datos *le puse ? porque a veces state.user es null

      console.log('✅ Expo push token guardado en BD:', token);
    }

    saveToken();
  }, [state.user?.id]);

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
