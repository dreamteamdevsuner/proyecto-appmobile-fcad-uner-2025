import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    };
  },
});

const ensureNotificationPermissions = async () => {
  if (!Device.isDevice) return false;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('No se otorgaron permisos para notificaciones.');
    return false;
  }

  return true;
};

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
      hour: 10,
      minute: 0,
      repeats: true,
      //type: 'timeInterval',
      //seconds: 10,
      //repeats: false,
    },
  });
};

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
      hour: 10,
      minute: 0,
      repeats: true,
      //type: 'timeInterval',
      //seconds: 10,
      //repeats: false,
    },
  });
};
