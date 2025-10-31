import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Configura cómo se muestran las notificaciones locales o push
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // ✅ Muestra el banner de notificación
    shouldPlaySound: true, // ✅ Reproduce sonido si está disponible
    shouldSetBadge: false, // ✅ No cambia el ícono de la app
  }),
});

// Función para programar una notificación diaria
export const scheduleDailyNotification = async (): Promise<void> => {
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('No se otorgaron permisos para notificaciones 😢');
      return;
    }
  }

  // Cancelar notificaciones anteriores para no duplicar
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Programar notificación diaria
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '¿Ya viste las nuevas ofertas de hoy? 🔥',
      body: 'Podría estar tu próximo match laboral 😉',
    },
    trigger: {
      type: 'timeInterval',
      seconds: 10,
      repeats: false,
      //hour: 10,
      //minute: 0,
      //repeats: true,
    },
  });
};
