import { supabase } from '../supabase/supabaseClient';
import { DBOfertaTrabajoSkill, DBUsuario } from '@database/index';
import { OfertaTrabajoData, OfertaValues } from '@models/index';

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

    const { data: direccion, error: direccionError } = await supabase
      .from('direccion')
      .insert([
        {
          direccion: data.direccion,
          latitud: data.latitud,
          longitud: data.longitud,
        },
      ])
      .select()
      .single();

    if (direccionError) throw direccionError;

    const { data: oferta, error: ofertaError } = await supabase
      .from('ofertatrabajo')
      .insert([
        {
          idpublicacion: publicacion.id,
          idempresa: data.idempresa,
          titulo: data.titulo,
          descripcion: data.descripcion,
          idmodalidad: data.idmodalidad ?? null,
          idtipojornada: data.idtipojornada ?? null,
          idestadooferta: 1,
          idcontratacion: data.idcontratacion ?? null,
          iddepartamento: data.iddepartamento ?? null,
          iddireccion: direccion.id ?? null,
          idarea: data.idarea ?? null,
          beneficios: data.beneficios,
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

    console.log('OFERTA', oferta);
    return oferta;
  } catch (err: any) {
    console.error('Error creando oferta:', err);
    throw err;
  }
}

export async function editarOferta(data: OfertaTrabajoData) {
  try {
    let direccion;

    if (data.iddireccion) {
      const { data: direccionData, error: direccionError } = await supabase
        .from('direccion')
        .update({
          direccion: data.direccion,
          latitud: data.latitud,
          longitud: data.longitud,
        })
        .eq('id', data.iddireccion)
        .select()
        .single();
      if (direccionError) throw direccionError;
      direccion = direccionData;
    } else {
      const { data: direccionData, error: direccionError } = await supabase
        .from('direccion')
        .insert([
          {
            direccion: data.direccion,
            latitud: data.latitud,
            longitud: data.longitud,
          },
        ])
        .select()
        .single();

      if (direccionError) throw direccionError;
      direccion = direccionData;
    }

    const { data: oferta, error: ofertaError } = await supabase
      .from('ofertatrabajo')
      .update({
        titulo: data.titulo,
        descripcion: data.descripcion,
        idempresa: data.idempresa ?? null,
        idmodalidad: data.idmodalidad ?? null,
        idtipojornada: data.idtipojornada ?? null,
        idcontratacion: data.idcontratacion ?? null,
        iddepartamento: data.iddepartamento ?? null,
        iddireccion: direccion ? direccion.id : null,
        idarea: data.idarea ?? null,
        beneficios: data.beneficios,
      })
      .eq('id', data.id)
      .select()
      .single();

    if (ofertaError) throw ofertaError;

    // borramos todas las skills para actualizar a las nuevas
    await supabase
      .from('ofertatrabajoskill')
      .delete()
      .eq('idofertatrabajo', oferta.id);

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
    console.error('Error editando oferta:', err);
    throw err;
  }
}

export type UsuarioMatch = DBUsuario & {
  idOfertaTrabajoMatch: string;
  idProfesional: string;
};

export async function getUsuariosMatchOferta(
  ofertaId: string,
): Promise<UsuarioMatch[]> {
  const { data, error } = await supabase
    .from('ofertatrabajomatch')
    .select(
      `
      id,
      profesional:profesional (
        id,
        usuario:usuario (
          id, nombre, apellido, email, fotoperfil, idplan, activo, rol, bio
        )
      )
    `,
    )
    .eq('idofertatrabajo', ofertaId)
    .eq('activo', true);

  if (error) throw new Error(error.message);
  if (!data) return [];

  const usuarios: UsuarioMatch[] = data.flatMap((match) => {
    const profesionales = Array.isArray(match.profesional)
      ? match.profesional
      : match.profesional
        ? [match.profesional]
        : [];

    return profesionales.flatMap((prof) => {
      const usuarios = Array.isArray(prof.usuario)
        ? prof.usuario
        : prof.usuario
          ? [prof.usuario]
          : [];

      return usuarios.map((usr) => ({
        ...usr,
        idProfesional: prof.id,
        idOfertaTrabajoMatch: match.id,
      }));
    });
  });

  console.log(`Usuarios fetched ofertaId ${ofertaId}:`, usuarios);
  return usuarios;
}

export async function getOferta(ofertaId: string): Promise<OfertaValues> {
  const { data: oferta, error } = await supabase
    .from('ofertatrabajo')
    .select(
      `
    id,
    activo,
    titulo,
    descripcion,
    beneficios,
    idmodalidad,
    idtipojornada,
    idcontratacion,
    iddepartamento,
    idarea,
    empresa: idempresa (
      id,
      nombre
    ),
    direccion: iddireccion (
      id,
      direccion,
      latitud,
      longitud
    ),

    skills: ofertatrabajoskill (
      id,
      nombre,
      nivel: idnivel (id, nombre),
      skill: idskill (
        id,
        nombre,
        idtiposkill
      )
    )
  `,
    )
    .eq('id', ofertaId)
    .eq('activo', true)
    .single();

  if (error) throw new Error(error.message);
  if (!oferta) throw new Error('Oferta no encontrada');

  const direccion = Array.isArray(oferta.direccion)
    ? oferta.direccion[0]
    : oferta.direccion;
  const empresa = Array.isArray(oferta.empresa)
    ? oferta.empresa[0]
    : oferta.empresa;
  const skills = Array.isArray(oferta.skills) ? oferta.skills : [oferta.skills];

  const ofertaMapped: OfertaValues = {
    id: oferta.id,
    titulo: oferta.titulo,
    institucion: empresa?.nombre ?? null,
    idinstitucion: empresa?.id ?? null,
    localizacion: direccion?.direccion ?? '',
    lat: Number(direccion?.latitud ?? 0),
    lng: Number(direccion?.longitud ?? 0),
    iddireccion: direccion?.id ?? null,

    area: oferta.idarea ?? null,
    modalidad: oferta.idmodalidad ?? null,
    jornada: oferta.idtipojornada ?? null,
    contrato: oferta.idcontratacion ?? null,

    descripcion: oferta.descripcion ?? '',
    beneficios: oferta.beneficios ?? '',
    idiomasNiveles: [],

    softSkills: skills
      ?.filter((s) => {
        const skill = Array.isArray(s.skill) ? s.skill[0] : s.skill;
        return skill?.idtiposkill === 1;
      })
      .map((s) => {
        const skill = Array.isArray(s.skill) ? s.skill[0] : s.skill;
        return skill?.id;
      }),

    hardSkills: skills
      ?.filter((s) => {
        const skill = Array.isArray(s.skill) ? s.skill[0] : s.skill;
        return skill?.idtiposkill === 2;
      })
      .map((s) => {
        const skill = Array.isArray(s.skill) ? s.skill[0] : s.skill;
        return skill?.id;
      }),
  };
  return ofertaMapped;
}

export async function getOfertasPorEstadoProfesional(
  userId: string,
  idEstadoMatch: number,
) {
  try {
    const { data, error } = await supabase
      .from('ofertatrabajomatch')
      .select(
        `
        id,
        fechacreacion,
        idestadomatch,
        profesional!inner ( idusuario ),
        ofertatrabajo!inner (
          id,
          titulo,
          descripcion,
          idmodalidad,
          idtipojornada,
          empresa:idempresa ( nombre ),
          direccion:iddireccion ( direccion )
        )
      `,
      )
      .eq('profesional.idusuario', userId)
      .eq('idestadomatch', idEstadoMatch)
      .eq('activo', true)
      .order('fechacreacion', { ascending: false });

    if (error) throw new Error(error.message);

    return data.map((item: any) => {
      const oferta = Array.isArray(item.ofertatrabajo)
        ? item.ofertatrabajo[0]
        : item.ofertatrabajo;
      const empresa = Array.isArray(oferta?.empresa)
        ? oferta.empresa[0]
        : oferta?.empresa;
      const direccion = Array.isArray(oferta?.direccion)
        ? oferta.direccion[0]
        : oferta?.direccion;

      return {
        matchId: item.id,
        ofertaId: oferta.id,
        titulo: oferta.titulo,
        descripcion: oferta.descripcion,
        empresa: empresa?.nombre || 'Empresa',
        ubicacion: direccion?.direccion || 'Remoto / A confirmar',
        fechaMatch: item.fechacreacion,
      };
    });
  } catch (error: any) {
    console.error('Error fetching ofertas profesional:', error);
    return [];
  }
}
