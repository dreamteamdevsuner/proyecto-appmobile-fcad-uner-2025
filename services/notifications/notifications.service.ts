import { supabase } from '../../supabase/supabaseClient';

export type AppNotification = {
  id: string;
  texto: string;
  tipo: string;
  created_at: string;
  idestadonotificacion: number;
  activo: boolean;
  idofertatrabajo?: string | null;
  ofertatrabajo?: { titulo?: string } | null;
};

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
    console.error('Error trayendo notificaciones');
    return [];
  }

  return data as AppNotification[];
}

export async function markNotificationAsRead(notificationId: string) {
  const { error } = await supabase
    .from('notificacion')
    .update({ idestadonotificacion: 3 })
    .eq('id', notificationId);

  if (error) {
    console.error('Error marcando como leída');
  }
}
