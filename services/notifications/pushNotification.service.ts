import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { supabase } from '../../supabase/supabaseClient';

// Función para registrar push token en Expo
export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) {
    if (__DEV__) {
      console.warn(
        'Solo se pueden enviar notificaciones push desde un dispositivo físico',
      );
    }
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

// Función para guardar token en Supabase
export async function savePushTokenToDatabase(userId: string, token: string) {
  const { data, error } = await supabase
    .from('usuario')
    .update({ expo_push_token: token })
    .eq('id', userId);

  if (error) {
    console.error('Error guardando push token en BD:', error);
    return null;
  }

  return data;
}
