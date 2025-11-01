import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Configura cómo se muestran las notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Función base para pedir permisos (la usamos en ambas notificaciones)
const ensureNotificationPermissions = async () => {
  if (!Device.isDevice) return false;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('No se otorgaron permisos para notificaciones 😢');
    return false;
  }

  return true;
};

// ✅ Notificación para PROFESIONAL
export const scheduleDailyNotificationProfesional = async (): Promise<void> => {
  const hasPermission = await ensureNotificationPermissions();
  if (!hasPermission) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '¿Ya viste las nuevas ofertas de hoy? 🔥',
      body: 'Quizás está tu próximo trabajo soñando 😉',
    },
    trigger: {
      //hour: 10,
      // minute: 0,
      // repeats: true
      type: 'timeInterval',
      seconds: 10,
      repeats: false,
    },
  });
};

// ✅ Notificación para RECLUTADOR
export const scheduleDailyNotificationReclutador = async (): Promise<void> => {
  const hasPermission = await ensureNotificationPermissions();
  if (!hasPermission) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '¿Ya viste los nuevos profesionales de hoy? 🔥',
      body: 'Puede estar tu próximo match laboral 😉',
    },
    trigger: {
      //hour: 10,
      // minute: 0,
      // repeats: true,
      type: 'timeInterval',
      seconds: 10,
      repeats: false,
    },
  });
};
