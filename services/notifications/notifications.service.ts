import { supabase } from '../../supabase/supabaseClient';

export type AppNotification = {
  id: string;
  texto: string;
  tipo: string;
  idestadonotificacion: number; // 1 pendiente, 2 enviado, 3 leído
<<<<<<< HEAD
  created_at?: string;
};

// 🟢 Obtener las notificaciones del usuario logueado
export async function getUserNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notificacion')
    .select('*')
    .eq('idusuario', userId)
    .eq('activo', true)
    .order('id', { ascending: false });

  if (error) {
    console.error('❌ Error trayendo notificaciones:', error);
=======
  activo: boolean;
  idofertatrabajo?: string | null;
  ofertatrabajo?: { titulo?: string } | null;
};

// Obtener las notificaciones del usuario logueado
export async function getUserNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notificacion')
    .select(
      `
      id,
      texto,
      tipo,
      idestadonotificacion,
      activo,
      idofertatrabajo,
      created_at,
      ofertatrabajo (
        titulo
      )
    `,
    )
    .eq('idusuario', userId)
    .eq('activo', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error trayendo notificaciones:', error);
>>>>>>> 4065919fa030c096a568d2d0fae98a861f2249db
    return [];
  }

  return data as AppNotification[];
}

<<<<<<< HEAD
// ✅ Marcar como leída
=======
// Marcar como leída
>>>>>>> 4065919fa030c096a568d2d0fae98a861f2249db
export async function markNotificationAsRead(notificationId: string) {
  const { error } = await supabase
    .from('notificacion')
    .update({ idestadonotificacion: 3 })
    .eq('id', notificationId);

  if (error) {
<<<<<<< HEAD
    console.error('❌ Error marcando como leída:', error);
=======
    console.error('Error marcando como leída:', error);
>>>>>>> 4065919fa030c096a568d2d0fae98a861f2249db
  }
}
