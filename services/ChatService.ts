import { OfertasUsuariosChat } from '@models/OfertasUsuariosChat';
import { supabase } from '../supabase/supabaseClient';
import {
  RealtimePostgresInsertPayload,
  RealtimeChannel,
} from '@supabase/supabase-js';
import { Message } from '@models/Message';

type MensajeRecord = {
  id: string;
  idchat: string;
  texto: string;
  idusuario: string;
  fechacreacion: string;
};

export function subscribeToChat(
  chatID: string,
  userID: string,
  onNewMessage: (msg: Message) => void,
): RealtimeChannel {
  console.log('Subscribe To Chat');
  const channel = supabase
    .channel(`chat-${chatID}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'mensaje',
        filter: `idchat=eq.${chatID}`,
      },
      (payload: RealtimePostgresInsertPayload<MensajeRecord>) => {
        const nuevo = payload.new;
        onNewMessage({
          id: nuevo.id,
          text: nuevo.texto,
          sender: nuevo.idusuario,
        });
      },
    )
    .subscribe((status) => {
      console.log('Channel:', status);
    });

  return channel;
}

export function unsubscribeFromChat(channel: RealtimeChannel) {
  supabase.removeChannel(channel);
}

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

export async function enviarMensaje({
  idChat,
  idUsuario,
  texto,
}: {
  idChat: string;
  idUsuario: string;
  texto: string;
}) {
  const { data, error } = await supabase
    .from('mensaje')
    .insert([
      {
        idchat: idChat,
        idusuario: idUsuario,
        texto,
      },
    ])
    .select(
      `
      id,
      texto,
      fechacreacion,
      idusuario
    `,
    )
    .single();

  if (error) {
    console.error('Error al enviar mensaje:', error.message);
    throw error;
  }

  return data;
}

export async function getOfertasUsuariosChat(
  idUsuarioReclutador: string,
): Promise<OfertasUsuariosChat[]> {
  const { data, error } = await supabase
    .from('chat')
    .select(
      `
      id,
      activo,
      profesional: idusuarioprofesional (
        id,
        usuario: idusuario(
           id,
           rol,
           fotoperfil,
           nombre
        )
      ),
      idusuarioreclutador (
         idusuario
      ),
      idofertatrabajomatch (
        id,
        ofertatrabajo: idofertatrabajo (
          id,
          titulo
        )
      )
    `,
    )
    .eq('activo', true)
    .eq('idusuarioreclutador.idusuario', idUsuarioReclutador);

  if (error) throw new Error(error.message);
  if (!data) return [];

  const ofertaUsuarios: OfertasUsuariosChat[] = [];

  for (const chat of data) {
    const ofertaTrabajoMatch = Array.isArray(chat.idofertatrabajomatch)
      ? chat.idofertatrabajomatch[0]
      : chat.idofertatrabajomatch;
    const ofertaTrabajo = Array.isArray(ofertaTrabajoMatch.ofertatrabajo)
      ? ofertaTrabajoMatch.ofertatrabajo[0]
      : ofertaTrabajoMatch.ofertatrabajo;

    const idOferta = ofertaTrabajo.id;
    const nombreOferta = ofertaTrabajo.titulo ?? '';

    if (!idOferta) continue;

    let oferta = ofertaUsuarios.find((o) => o.idOferta === idOferta);

    if (!oferta) {
      oferta = { idOferta, nombreOferta, chats: [] };
      ofertaUsuarios.push(oferta);
    }

    const profesional = Array.isArray(chat.profesional)
      ? chat.profesional[0]
      : chat?.profesional;
    const usuario = Array.isArray(profesional?.usuario)
      ? profesional.usuario[0]
      : profesional?.usuario;

    oferta.chats.push({
      id: usuario.id,
      name: usuario.nombre,
      role: usuario.rol,
      avatarUrl: usuario.fotoperfil,
      idProfesional: profesional.id,
      idOfertaTrabajoMatch: ofertaTrabajoMatch.id,
    });
  }

  console.log(
    `Ofertas Chats fetched idUsuarioReclutador ${idUsuarioReclutador}:`,
    ofertaUsuarios,
  );
  return ofertaUsuarios;
}
