import { supabase } from '../supabase/supabaseClient';

export async function getChatConMensajes(
  idOfertaTrabajoMatch: string,
  idUsuarioProfesional: string,
) {
  const { data, error } = await supabase
    .from('chat')
    .select(
      `
      id,
      idusuarioprofesional,
      idusuarioreclutador,
      idofertatrabajomatch,
      mensaje (
        id,
        texto,
        fechacreacion,
        idusuario,
        usuario: idusuario (
          nombre,
          apellido,
          fotoperfil
        )
      )
    `,
    )
    .eq('idofertatrabajomatch', idOfertaTrabajoMatch)
    .eq('idusuarioprofesional', idUsuarioProfesional)
    .maybeSingle();

  if (error) {
    console.error('Error al obtener chat con mensajes:', error.message);
    return null;
  }

  if (!data) {
    console.warn('No se encontró chat para esta oferta y profesional');
    return null;
  }

  // Ordenar los mensajes por fecha de creación
  const mensajesOrdenados = data.mensaje
    ? [...data.mensaje].sort(
        (a, b) =>
          new Date(a.fechacreacion).getTime() -
          new Date(b.fechacreacion).getTime(),
      )
    : [];

  return {
    idChat: data.id,
    idProfesional: data.idusuarioprofesional,
    idReclutador: data.idusuarioreclutador,
    mensajes: mensajesOrdenados,
  };
}
