import { supabase } from '../../supabase/supabaseClient';
import { Tables } from '../../supabase/types';

/** Usuario base con sus relaciones directas */
export type UsuarioConDetalles = Tables<'usuario'> & {
  direccion: Tables<'direccion'> | null;
  tipousuario: Tables<'tipousuario'> | null;
};

/** Enlace con su tipo de enlace relacionado */
export type EnlaceConTipo = Tables<'enlace'> & {
  tipoenlace: Tables<'tipoenlace'>[] | null;
};

/** Profesional con sus preferencias relacionadas */
export type ProfesionalConPrefs = Tables<'profesional'> & {
  modalidad: Tables<'modalidad'>[] | null;
  tipojornada: Tables<'tipojornada'>[] | null;
};

/** Skill de profesional con la skill y nivel relacionados */
export type SkillConDetalles = Tables<'profesionalskill'> & {
  skill: Tables<'skill'>[] | null;
  nivel: Tables<'nivel'>[] | null;
};

/** Trabajo con la empresa relacionada */
export type TrabajoConEmpresa = Tables<'trabajo'> & {
  empresa: Tables<'empresa'>[] | null;
};

/** Oferta de trabajo con todas sus relaciones para un reclutador */
export type OfertaConDetalles = Tables<'ofertatrabajo'> & {
  modalidad: Tables<'modalidad'> | null;
  tipojornada: Tables<'tipojornada'> | null;
  contratacion: Tables<'contratacion'> | null;
  estadooferta: Tables<'estadooferta'> | null;
};

// TODO: usar perfiles completos?
export interface PerfilCompletoProfesional {
  usuario: UsuarioConDetalles;
  enlaces: EnlaceConTipo[];
  profesional: ProfesionalConPrefs;
  estudios: Tables<'estudio'>[];
  experiencia: TrabajoConEmpresa[];
  skills: SkillConDetalles[];
}

export interface PerfilCompletoReclutador {
  usuario: UsuarioConDetalles;
  enlaces: EnlaceConTipo[];
  reclutador: Tables<'reclutador'>;
  experiencia: TrabajoConEmpresa[];
  ofertasPublicadas: OfertaConDetalles[];
}

/**
 * Obtiene los datos base del usuario, su dirección y tipo.
 */
export const getUsuarioBase = async (
  userId: string,
): Promise<UsuarioConDetalles | null> => {
   
  const { data, error } = await supabase
    .from('usuario')
    .select(
      `
      *,
      direccion(*),
      tipousuario(*)
    `,
    )
    .eq('id', userId)
    .single();
 
  if (error) {
    console.error('Error en getUsuarioBase:', error);
    return null;
  }
  return data;
};

/**
 * Obtiene los enlaces (redes sociales) de un usuario.
 */
export const getEnlaces = async (
  userId: string,
): Promise<EnlaceConTipo[] | null> => {
  const { data, error } = await supabase
    .from('enlace')
    .select(
      `
      *,
      tipoenlace(*)
    `,
    )
    .eq('idusuario', userId)
    .eq('activo', true);

  if (error) {
    console.error('Error en getEnlaces:', error);
    return null;
  }
  return data;
};

/**
 * Obtiene los datos del perfil "Profesional" (preferencias).
 */
export const getProfesional = async (
  userId: string,
): Promise<ProfesionalConPrefs | null> => {
  const { data, error } = await supabase
    .from('profesional')
    .select(
      `
      *,
      modalidad(*),
      tipojornada(*)
    `,
    )
    .eq('idusuario', userId)
    .single();

  if (error) {
    console.error('Error en getProfesional:', error);
    return null;
  }
  return data;
};

/**
 * Obtiene los estudios de un profesional.
 */
export const getEstudios = async (
  profesionalId: string,
): Promise<Tables<'estudio'>[] | null> => {
  const { data, error } = await supabase
    .from('estudio')
    .select('*')
    .eq('idprofesional', profesionalId);

  if (error) {
    console.error('Error en getEstudios:', error);
    return null;
  }
  return data;
};

/**
 * Obtiene la experiencia laboral (trabajos) de un usuario.
 */
export const getExperiencia = async (
  userId: string,
): Promise<TrabajoConEmpresa[] | null> => {
  const { data, error } = await supabase
    .from('trabajo')
    .select(
      `
      *,
      empresa(*)
    `,
    )
    .eq('idusuario', userId);

  if (error) {
    console.error('Error en getExperiencia:', error);
    return null;
  }
  return data;
};

/**
 * Obtiene las skills de un profesional.
 */
export const getSkills = async (
  profesionalId: string,
): Promise<SkillConDetalles[] | null> => {
  const { data, error } = await supabase
    .from('profesionalskill')
    .select(
      `
      *,
      skill(*),
      nivel(*)
    `,
    )
    .eq('idprofesional', profesionalId);

  if (error) {
    console.error('Error en getSkills:', error);
    return null;
  }
  return data;
};

/**
 * Obtiene los datos del perfil "Reclutador".
 */
export const getReclutador = async (
  userId: string,
): Promise<Tables<'reclutador'> | null> => {
  const { data, error } = await supabase
    .from('reclutador')
    .select('*')
    .eq('idusuario', userId)
    .single();

  if (error) {
    console.error('Error en getReclutador:', error);
    return null;
  }
  return data;
};

/**
 * Obtiene las ofertas de trabajo publicadas por un reclutador.
 */
export const getOfertasReclutador = async (
  userId: string,
): Promise<OfertaConDetalles[] | null> => {
  const { data: publicaciones, error: pubError } = await supabase
    .from('publicacion')
    .select('id')
    .eq('idusuario', userId)
    .eq('activo', true);

  if (pubError || !publicaciones || publicaciones.length === 0) {
    if (pubError) console.error('Error en getOfertasReclutador:', pubError);
    return [];
  }

  const publicacionIds = publicaciones.map((p) => p.id);

  const { data: ofertas, error: ofertaError } = await supabase
    .from('ofertatrabajo')
    .select(
      `
      *,
      modalidad(*),
      tipojornada(*),
      contratacion(*),
      estadooferta(*)
    `,
    )
    .in('idpublicacion', publicacionIds);

  if (ofertaError) {
    console.error('Error en getOfertasReclutador:', ofertaError);
    return null;
  }
  return ofertas;
};
