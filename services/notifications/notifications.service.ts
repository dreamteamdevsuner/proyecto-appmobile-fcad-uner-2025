import { supabase } from '../../supabase/supabaseClient';

export type AppNotification = {
  id: string;
  texto: string;
  tipo: string;
  idestadonotificacion: number; // 1 pendiente, 2 enviado, 3 leído
  created_at?: string;
};

// Obtener las notificaciones del usuario logueado
export async function getUserNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notificacion')
    .select('*')
    .eq('idusuario', userId)
    .eq('activo', true)
    .order('id', { ascending: false });

  if (error) {
    console.error('Error trayendo notificaciones:', error);
    return [];
  }

  return data as AppNotification[];
}

// Marcar como leída
export async function markNotificationAsRead(notificationId: string) {
  const { error } = await supabase
    .from('notificacion')
    .update({ idestadonotificacion: 3 })
    .eq('id', notificationId);

  if (error) {
    console.error('Error marcando como leída:', error);
  }
}
