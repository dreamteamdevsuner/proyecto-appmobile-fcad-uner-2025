import { supabase } from '../supabase/supabaseClient';
import { DBOfertaTrabajoSkill } from '@database/index';
import { OfertaTrabajoData } from '@models/OfertaTrabajoData';
import { DBUsuario } from '@database/index';

export async function getOfertasConMatch(
  userId: string,
): Promise<{ id: string; titulo: string; postulantes: number }[]> {
  const { data: ofertas, error } = await supabase
    .from('ofertatrabajo')
    .select(
      `
      id,
      titulo, 
      idpublicacion!inner (
        idusuario
      ),
      ofertatrabajomatch!inner (
        id
      )`,
    )
    .eq('idpublicacion.idusuario', userId)
    .eq('activo', true)
    .eq('ofertatrabajomatch.idestadomatch', 2); // matchs con estado aceptado

  if (error) throw new Error(error.message);

  return ofertas.map((o) => ({
    id: o.id,
    titulo: o.titulo,
    postulantes: o.ofertatrabajomatch?.length || 0,
  }));
}

export async function getMatchRecientes(userId: string): Promise<
  {
    id: string;
    name: string;
    subtitle: string;
    avatarUrl: string;
  }[]
> {
  const { data, error } = await supabase
    .from('ofertatrabajomatch')
    .select(
      `
      id,
      fechacreacion,
      idestadomatch,
      ofertatrabajo!inner (
        id,
        titulo,
        idpublicacion!inner ( idusuario )
      ),
      profesional!inner (
        id,
        usuario!inner (
          id,
          nombre,
          apellido,
          fotoperfil
        )
      )
    `,
    )
    .eq('ofertatrabajo.idpublicacion.idusuario', userId)
    .eq('idestadomatch', 2)
    .order('fechacreacion', { ascending: false })
    .limit(10);

  if (error) throw new Error(error.message);

  return data.map((m: any) => {
    // Manejar ambos casos: array u objeto
    const profesional = Array.isArray(m.profesional)
      ? m.profesional[0]
      : m.profesional;

    const usuario = Array.isArray(profesional?.usuario)
      ? profesional.usuario[0]
      : profesional?.usuario;

    const ofertatrabajo = Array.isArray(m.ofertatrabajo)
      ? m.ofertatrabajo[0]
      : m.ofertatrabajo;

    return {
      id: usuario?.id || '',
      name: usuario ? `${usuario.nombre} ${usuario.apellido}` : '',
      subtitle: ofertatrabajo?.titulo || '',
      avatarUrl: usuario?.fotoperfil || '',
    };
  });
}

export async function crearOferta(data: OfertaTrabajoData) {
  try {
    const { data: publicacion, error: pubError } = await supabase
      .from('publicacion')
      .insert([{ idusuario: data.idusuario }])
      .select()
      .single();

    if (pubError) throw pubError;

    const { data: oferta, error: ofertaError } = await supabase
      .from('ofertatrabajo')
      .insert([
        {
          idpublicacion: publicacion.id,
          idempresa: null,
          titulo: data.titulo,
          descripcion: data.descripcion,
          idmodalidad: data.idmodalidad ?? null,
          idtipojornada: data.idtipojornada ?? null,
          idestadooferta: 1,
          idcontratacion: data.idcontratacion ?? null,
          iddepartamento: data.iddepartamento ?? null,
          iddireccion: data.iddireccion ?? null,
        },
      ])
      .select()
      .single();

    if (ofertaError) throw ofertaError;
    let registrosHard: DBOfertaTrabajoSkill[] = [];
    let registrosSoft: DBOfertaTrabajoSkill[] = [];

    if (data.idsoftskills?.length) {
      registrosSoft = data.idsoftskills.map((id) => ({
        idskill: id,
        idofertatrabajo: oferta.id,
      }));
    }
    if (data.idhardskills?.length) {
      registrosHard = data.idhardskills.map((id) => ({
        idskill: id,
        idofertatrabajo: oferta.id,
      }));
    }
    const registros = [...registrosHard, ...registrosSoft];

    if (registros.length > 0) {
      const { data: ofertatrabajoskill, error } = await supabase
        .from('ofertatrabajoskill')
        .insert(registros)
        .select();

      if (error) throw error;
    }
    return oferta;
  } catch (err: any) {
    console.error('Error creando oferta:', err);
    throw err;
  }
}

export async function getUsuariosMatchOferta(
  ofertaId: string,
): Promise<DBUsuario[]> {
  const { data, error } = await supabase
    .from('ofertatrabajomatch')
    .select(
      `
      profesional:profesional (
        usuario:usuario (id, nombre, apellido, email, fotoperfil, idplan, activo, rol)
      )
    `,
    )
    .eq('idofertatrabajo', ofertaId)
    .eq('activo', true);

  if (error) throw new Error(error.message);
  if (!data) return [];

  const usuarios: DBUsuario[] = [];

  for (const match of data) {
    const profs = Array.isArray(match.profesional)
      ? match.profesional
      : match.profesional
        ? [match.profesional]
        : [];
    for (const prof of profs) {
      const usrs = Array.isArray(prof.usuario)
        ? prof.usuario
        : prof.usuario
          ? [prof.usuario]
          : [];
      usuarios.push(...usrs);
    }
  }

  console.log(`Usuarios fetched ofertaId ${ofertaId}:`, usuarios);
  return usuarios;
}
