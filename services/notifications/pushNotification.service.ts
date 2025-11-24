import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { supabase } from '../../supabase/supabaseClient';

export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('No se otorgaron permisos para notificaciones.');
    return null;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();
  return tokenData.data;
}

export async function savePushTokenToDatabase(userId: string, token: string) {
  const { data, error } = await supabase
    .from('usuario')
    .update({ expo_push_token: token })
    .eq('id', userId);

  if (error) {
    console.error('Error guardando push token en BD');
    return null;
  }

  return data;
}

export async function sendPushNotification(
  expoPushToken: string,
  title: string,
  body: string,
  data: Record<string, any> = {},
) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: title,
    body: body,
    data: data,
  };

  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    console.log('🔔 Push enviado');
  } catch (error) {
    console.error('Error enviando push notification');
  }
}
