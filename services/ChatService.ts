import { OfertasUsuariosChat } from '@models/OfertasUsuariosChat';
import { supabase } from '../supabase/supabaseClient';
import {
  RealtimePostgresInsertPayload,
  RealtimeChannel,
} from '@supabase/supabase-js';
import { Message } from '@models/Message';
import { UserItemInfo } from '@models/UserItemInfo';

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
  console.log('Subscribe To Chat', chatID);
  const channel = supabase
    .channel(`chat-${chatID}-${Date.now()}`)
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
        console.log('Nuevo mensaje recibido:', nuevo.id);
        onNewMessage({
          id: nuevo.id,
          text: nuevo.texto,
          sender: nuevo.idusuario,
        });
      },
    )
    .subscribe((status) => {
      console.log('Channel status:', status);
    });

  return channel;
}

export function unsubscribeFromChat(channel: RealtimeChannel) {
  supabase.removeChannel(channel);
}

export async function getChatConMensajes(
  idOfertaTrabajoMatch: string,
  idUsuarioLogueado: string,
  offset: number,
) {
  const { data: match, error: matchError } = await supabase
    .from('ofertatrabajomatch')
    .select('idprofesional')
    .eq('id', idOfertaTrabajoMatch)
    .single();

  if (matchError) {
    console.error(
      'Error al obtener match para obtener mensajes:',
      matchError.message,
    );
    return null;
  }

  const { data, error } = await supabase
    .from('chat')
    .select(
      `
      id,
      idusuarioprofesional (idusuario),
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
    .order('fechacreacion', { referencedTable: 'mensaje', ascending: false })
    .range(offset, offset + 4, { referencedTable: 'mensaje' })
    .maybeSingle();

  if (error) {
    console.error('Error al obtener chat con mensajes:', error.message);
    return null;
  }

  if (!data) {
    console.log(
      'No se encontró chat para esta oferta y profesional. Se creará uno.',
    );

    const { data: reclutador, error: recError } = await supabase
      .from('reclutador')
      .select('id')
      .eq('idusuario', idUsuarioLogueado)
      .single();

    if (recError) {
      console.error(
        'Error al obtener reclutador para crear chat:',
        recError.message,
      );
      return null;
    }
    const { data: newChat, error: insertError } = await supabase
      .from('chat')
      .insert([
        {
          idusuarioprofesional: match.idprofesional,
          idusuarioreclutador: reclutador.id, // solo el reclutador puede iniciar un chat
          idofertatrabajomatch: idOfertaTrabajoMatch,
          idestadochat: 2,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Error creando chat:', insertError.message);
      return null;
    }

    return {
      idChat: newChat.id,
      idProfesional: newChat.idusuarioprofesional,
      idReclutador: newChat.idusuarioreclutador,
      mensajes: newChat.mensaje || [],
    };
  }

  return {
    idChat: data.id,
    idProfesional: data.idusuarioprofesional,
    idReclutador: data.idusuarioreclutador,
    mensajes: data.mensaje || [],
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
      profesional: idusuarioprofesional!inner (
        id,
        usuario: idusuario!inner(
           id,
           rol,
           fotoperfil,
           nombre
        )
      ),
      idusuarioreclutador!inner (
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

export async function getProfesionalChat(
  idUsuarioProfesional: string,
): Promise<UserItemInfo[]> {
  const { data, error } = await supabase
    .from('chat')
    .select(
      `
      id,
      activo,
      profesional: idusuarioprofesional!inner (
        id,
        usuario: idusuario!inner(
           id,
           rol,
           fotoperfil,
           nombre
        )
      ),
      reclutador: idusuarioreclutador!inner (
      id,
         usuario: idusuario!inner(
         id, rol, fotoperfil, nombre
         )
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
    .eq('profesional.usuario.id', idUsuarioProfesional);
  // .not('profesional', 'is', null);

  if (error) throw new Error(error.message);
  if (!data) return [];

  const chats: UserItemInfo[] = [];

  for (const chat of data) {
    const ofertaTrabajoMatch = Array.isArray(chat.idofertatrabajomatch)
      ? chat.idofertatrabajomatch[0]
      : chat.idofertatrabajomatch;
    const ofertaTrabajo = Array.isArray(ofertaTrabajoMatch.ofertatrabajo)
      ? ofertaTrabajoMatch.ofertatrabajo[0]
      : ofertaTrabajoMatch.ofertatrabajo;
    const reclutador = Array.isArray(chat.reclutador)
      ? chat.reclutador[0]
      : chat?.reclutador;
    const profesional = Array.isArray(chat.profesional)
      ? chat.profesional[0]
      : chat?.profesional;
    const usuarioReclutador = Array.isArray(reclutador?.usuario)
      ? reclutador.usuario[0]
      : reclutador?.usuario;

    chats.push({
      id: usuarioReclutador.id,
      name: usuarioReclutador.nombre,
      role: usuarioReclutador.rol,
      avatarUrl: usuarioReclutador.fotoperfil,
      idProfesional: profesional.id,
      idOfertaTrabajoMatch: ofertaTrabajoMatch.id,
      ofertaName: ofertaTrabajo.titulo,
    });
  }

  return chats;
}
