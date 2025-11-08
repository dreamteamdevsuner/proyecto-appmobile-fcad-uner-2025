import { supabase } from "../supabase/supabaseClient";
import { CandidatoValues, ReclutadorValues } from "@interfaces/EditarPerfil";
import { DBUsuario, DBEstudio, DBModalidad, DBTipoJornada } from "@database/index";

export interface DropdownItem {
  label: string;
  value: string;
}

export const uploadAvatar = async (base64Data: string, userId: string) : Promise<string> => {
  try {
    const filePath = `${userId}/avatar.png`;

    const rawBinary = atob(base64Data);

    const arrayBuffer = new Uint8Array(rawBinary.length);
    for (let i = 0; i < rawBinary.length; i++) {
      arrayBuffer[i] = rawBinary.charCodeAt(i);
    }

    const { data, error } = await supabase.storage
      .from('fotoPerfil')
      .upload(
        filePath,
        arrayBuffer,
        {
          contentType: 'image/png',
          upsert: true,
        }
      );

    if (error) {
      console.error('Error al subir la imagen: ', error);
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from('fotoPerfil')
      .getPublicUrl(data.path);

    if (!urlData.publicUrl) {
      throw new Error('No se pudo obtener la URL pública de la imagen.');
    }

    console.log('Imagen subida, URL pública: ', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (err) {
    console.error('Error en el servicio de subida de avatar: ', err);
    throw new Error('No se pudo subir la imagen del avatar.');
  }
};

const _procesarSkills = (skillsResult: { data: any[] | null; error: any }) => {
  const habilidades: DropdownItem[] = [];
  const herramientas: DropdownItem[] = [];
  const idiomas:DropdownItem[] = [];

  if (skillsResult.error) {
    console.error('Error al cargar skills: ', skillsResult.error);
    return { habilidades, herramientas, idiomas };    
  }

  if (skillsResult.data) {
    for (const skill of skillsResult.data) {
      const item = { label: skill.nombre, value: String(skill.id) };
      switch (skill.idtiposkill) {
        case 1:      // Habilidades- Blandas(BD)
          habilidades.push(item);
          break;
        case 2:     // Herramientas- Técnicas(BD)
          herramientas.push(item);
          break;
        case 3:     // Idiomas seleccionados- Idiomas(BD)
          idiomas.push(item);
          break;
      }
    }
  }
  return { habilidades, herramientas, idiomas };
};

const _mapearListaDropdown = (
  result: { data: any[] | null; error: any },
  nombreLista: string,
  mapFn: (item: any) => DropdownItem
) : DropdownItem[] => {
  if (result.error) {
    console.error(`Error al cargar ${nombreLista}: `, result.error);
    return [];
  }
  return result.data ? result.data.map(mapFn) : [];
};

export const cargarListasParaFormularios = async () => {
  try {
    const [skillsResult,
      tiposEnlaceResult,
      modalidadResult,
      tiposJornadaResult
    ] = await Promise.all([
      supabase.from('skill').select('id, nombre, idtiposkill'),
      supabase.from('tipoenlace').select('id, nombre').eq('activo', true),
      supabase.from('modalidad').select('id, nombre'),
      supabase.from('tipojornada').select('id, nombre'),
    ]);

    const { habilidades, herramientas, idiomas } = _procesarSkills(skillsResult);

    //Carga tipos enlaces(Redes)
    const listasTiposEnlace: DropdownItem[] = _mapearListaDropdown(tiposEnlaceResult, 'tipos de enlaces', (e: { id: number, nombre: string }) => ({ label: e.nombre, value: String(e.id) }));
    const modalidades = _mapearListaDropdown(modalidadResult, 'modalidad', (m: DBModalidad) => ({ label: m.nombre, value: String(m.id) }));
    const tiposJornada = _mapearListaDropdown(tiposJornadaResult, 'tipos de jornada', (j: DBTipoJornada) => ({ label: j.nombre, value: String(j.id) }));

    return {
      habilidades,
      herramientas,
      idiomas,
      listasTiposEnlace,
      modalidades,
      tiposJornada,
    };
  } catch (error) {
    console.error('Error general cargando listas para formularios: ', error);
    return {
      habilidades: [], herramientas: [], idiomas: [], listasTiposEnlace: [],
      modalidades: [], tiposJornada: [], 
    };
  }
};

//Tipo usuario
type TipoUsuario = 'profesional' | 'reclutador';

const _cargarUsuarioDireccion = async (userId: string) => {
  const { data: usuario, error: userError } = await supabase
    .from('usuario')
    .select('*, direccion(pais, ciudad, latitud, longitud)')
    .eq('id', userId)
    .single();

  if (userError || !usuario) {
    throw new Error(userError?.message || 'No se encontro el usuario');
  }

  const localizacionCargada = [usuario.direccion?.ciudad, usuario.direccion?.pais]
    .filter(Boolean)
    .join(', ') || '';

  //Datos comunes
  const datosBase = {
    nombre: usuario.nombre || '',
    apellido: usuario.apellido || '',
    profesion: usuario.rol || '',   //profesion -> rol(BD)
    email: usuario.email || '',
    localizacion: localizacionCargada,
    lat: usuario.direccion?.latitud ?? null,
    lng: usuario.direccion?.longitud ?? null,
    avatar_url: usuario.fotoperfil || null,
    avatarBase64: null,
  };
  return { usuario, datosBase };
};

const _cargarDatosEspecificosProfesional = async (userId: string) => {
  const { data: prof } = await supabase
    .from('profesional')
    .select('id, idmodalidad, idtipojornada')
    .eq('idusuario', userId)
    .maybeSingle();

  let habilidades: string[] = [];
  let herramientas: string[] = [];
  let idiomas: string[] = [];
  let estudios: DBEstudio[] = [];

  const profesionalId = prof?.id;

  if (profesionalId) {
    const { data: skillsBD } = await supabase 
      .from('profesionalskill')
      .select('skill (id, idtiposkill)')
      .eq('idprofesional', profesionalId);

    if (skillsBD) {
      habilidades = skillsBD.filter(s => s.skill?.[0]?.idtiposkill ===1).map(s => String(s.skill![0].id));
      herramientas = skillsBD.filter(s => s.skill?.[0]?.idtiposkill === 2).map(s => String(s.skill![0].id));
      idiomas = skillsBD.filter(s => s.skill?.[0]?.idtiposkill === 3).map(s => String(s.skill![0].id));
    }

    const { data: estudiosBD } = await supabase
      .from('estudio')
      .select('id, activo, titulo, fechainicio, fechafin, nombreinstitucion, idprofesional')
      .eq('idprofesional', profesionalId);

    if (estudiosBD) {
      estudios = estudiosBD.map(e => ({
        ...e,
        fechainicio: String(e.fechainicio || ''),
        fechafin: String(e.fechafin || ''),
        nombreinstitucion: e.nombreinstitucion || '',
      }));
    }
  }

  return {
    modalidadSeleccionada: String(prof?.idmodalidad || ''),
    jornadaSeleccionada: String(prof?.idtipojornada || ''),
    habilidades,
    herramientas,
    idiomasSeleccionados: idiomas,
    estudios,
  };
};

const _cargarEnlaces = async (userId: string) => {
  const { data: enlacesBD } = await supabase
    .from('enlace')
    .select('url, idtipoenlace')
    .eq('idusuario', userId)
    .eq('activo', true);

  return enlacesBD
    ? enlacesBD.map(e => ({
        tipo: String(e.idtipoenlace),
        url: e.url,
      }))
    : [];
};

const _cargarDatosEspecificosReclutador = async (userId: string) => {
  const { data: reclu } = await supabase
    .from('reclutador')
    .select('nombreempresa')
    .eq('idusuario', userId)
    .maybeSingle();

  return {
    institucion: reclu?.nombreempresa || '',
    palabrasClave: [],
  };
};

export const cargarDatosInicialesPerfil = async (
  userId: string,
  tipoUsuario: TipoUsuario
) : Promise<CandidatoValues | ReclutadorValues> => {

  const { usuario, datosBase } = await _cargarUsuarioDireccion(userId);

  if (tipoUsuario === 'profesional') {
    const datosProfesional = await _cargarDatosEspecificosProfesional(userId);
    const redes = await _cargarEnlaces(userId);

    return {
      ...datosBase,
      ...datosProfesional,
      redes,
      redSeleccionada: '',
      aboutMe: usuario.bio || '',
      lat: usuario.direccion?.latitud ?? null,
      lng: usuario.direccion?.longitud ?? null,
    };
  } else {
    const datosReclutador = await _cargarDatosEspecificosReclutador(userId);

    return {
      ...datosBase,
      ...datosReclutador,
      lat: usuario.direccion?.latitud ?? null,
      lng: usuario.direccion?.longitud ?? null,
    };
  }
};


const _gestionarDireccionUpsert = async (
  userId: string,
  values: CandidatoValues | ReclutadorValues
) => {
  const { data: userData } = await supabase.from('usuario').select('iddireccion').eq('id', userId).single();
  let direccionId = userData?.iddireccion;

  const direccionData = {
    pais: values.localizacion.split(', ')[1]?.trim() || values.localizacion,
    ciudad: values.localizacion.split(', ')[0]?.trim() || '',
  };

  if (direccionId) {
    await supabase.from('direccion').update(direccionData).eq('id', direccionId).throwOnError();
  } else {
    const { data: newDir } = await supabase.from('direccion').insert(direccionData).select('id').single().throwOnError();
    direccionId = newDir!.id;
    await supabase.from('usuario').update({ iddireccion: direccionId }).eq('id', userId).throwOnError();
  }
};

const _actualizarUsuarioProfesional = async (
  userId: string,
  values: CandidatoValues,
  nuevaFotoUrl: string | null
) => {
  const datosUsuario: Partial<DBUsuario> = {
    nombre: values.nombre,
    apellido: values.apellido,
    rol: values.profesion,
    email: values.email,
    bio: values.aboutMe,
  };

  if (nuevaFotoUrl) {
    datosUsuario.fotoperfil = nuevaFotoUrl;
  }

  await supabase.from('usuario')
    .update(datosUsuario)
    .eq('id', userId)
    .throwOnError();
};

const _gestionarProfesionalUpsert = async (userId: string, values: CandidatoValues): Promise<string> => {
  const { data } = await supabase.from('profesional').upsert({
    idusuario: userId,
    idmodalidad: values.modalidadSeleccionada ? Number(values.modalidadSeleccionada) : null,
    idtipojornada: values.jornadaSeleccionada ? Number(values.jornadaSeleccionada) : null,
  }, { onConflict: 'idusuario' })
  .select('id')
  .single()
  .throwOnError();

  if(!data) throw new Error('No se pudo hacer upsert del perfil profesional.');
  return data.id;
};

const _gestionarSkillProfesional = async (profesionalId: string, values: CandidatoValues) => {
  await supabase.from('profesionalskill').delete().eq('idprofesional', profesionalId).throwOnError();

  const todasLasSkills = [
    ...values.habilidades,
    ...values.herramientas,
    ...values.idiomasSeleccionados,
  ];

  const skillsParaInsertar = [...new Set(todasLasSkills)]
    .filter(id => id)
    .map(skillId => ({
      idprofesional: profesionalId,
      idskill: String(skillId),
    }));

  if (skillsParaInsertar.length > 0) {
    await supabase.from('profesionalskill').insert(skillsParaInsertar).throwOnError();
  }
};

const _gestionarEstudiosProfesional = async (profesionalId: string, values: CandidatoValues) => {
  await supabase.from('estudio').delete().eq('idprofesional', profesionalId).throwOnError();

  const formatoFecha = (fechaString: string | null | undefined): string | null => {
    if (!fechaString || !/^\d{4}$/.test(fechaString.trim())) {
      return null;
    }
    return `${fechaString.trim()}-01-01`; 
  };

  const estudiosPararInsertar = values.estudios.map(est => ({
    titulo: est.titulo,
    fechainicio: formatoFecha(est.fechainicio),
    fechafin: formatoFecha(est.fechafin),
    nombreinstitucion: est.nombreinstitucion,
    idprofesional: profesionalId,
    activo: est.activo || true,
  }));

  if (estudiosPararInsertar.length > 0) {
    await supabase.from('estudio').insert(estudiosPararInsertar).throwOnError();
  }
};

const _gestionarEnlacesUsuario = async (userId: string, values: CandidatoValues) => {
  await supabase.from('enlace').delete().eq('idusuario', userId).throwOnError();

  const enlacesParaInsertar = values.redes.map(red => ({
    idusuario: userId,
    url: red.url,
    idtipoenlace: Number(red.tipo),
    activo: true,
  })).filter(e => e.idtipoenlace && !isNaN(e.idtipoenlace));

  if (enlacesParaInsertar.length > 0) {
    await supabase.from('enlace').insert(enlacesParaInsertar).throwOnError();
  }
};

//Guardar datos de perfil profesional
export const guardarPerfilProfesional = async (
  values: CandidatoValues,
  userId: string,
) => {
  try {
    let nuevaFotoUrl: string | null = null;
    if (values.avatarBase64) {
      console.log('Detectada nueva imagen base64, subiendo...');
      nuevaFotoUrl = await uploadAvatar(values.avatarBase64, userId);
    }

    await _actualizarUsuarioProfesional(userId, values, nuevaFotoUrl);

    await _gestionarDireccionUpsert(userId, values);

    const profesionalId = await _gestionarProfesionalUpsert(userId, values);

    await _gestionarSkillProfesional(profesionalId, values);

    await _gestionarEstudiosProfesional(profesionalId, values);

    await _gestionarEnlacesUsuario(userId, values);

    return { success: true };
  } catch (error) {
    console.error('Error al guardar perfil profesional: ', error);
    return { success: false, error: (error as Error).message };
  }
};

//Helper para tabla usuario reclutador
const _actualizarUsuarioReclutador = async (
    userId: string, 
    values: ReclutadorValues, 
    nuevaFotoUrl: string | null
) => {
  const datosUsuario: Partial<DBUsuario> = {
    nombre: values.nombre,
    apellido: values.apellido,
    rol: values.profesion,
  }; 

  if (nuevaFotoUrl) {
    datosUsuario.fotoperfil = nuevaFotoUrl;
  }

  await supabase.from('usuario')
    .update(datosUsuario)
    .eq('id', userId)
    .throwOnError();
};

const _gestionarReclutadorUpsert = async (userId: string, values: ReclutadorValues) => {
  await supabase.from('reclutador').upsert({
    idusuario: userId,
    nombreempresa: values.institucion,
  }, { onConflict: 'idusuario' }).throwOnError();
};


export const guardarPerfilReclutador = async (
  values: ReclutadorValues,
  userId: string
) => {
  try {
    let nuevaFotoUrl: string | null = null;
    if (values.avatarBase64) {
      console.log('Detectada nueva imagen base64 para reclutador, subiendo...');
      nuevaFotoUrl = await uploadAvatar(values.avatarBase64, userId);
    }

    await _actualizarUsuarioReclutador(userId, values, nuevaFotoUrl);

    await _gestionarDireccionUpsert(userId, values);

    await _gestionarReclutadorUpsert(userId, values);

    return { success: true };
  } catch (error) {
    console.error('Error al guardar perfil reclutador: ', error);
    return { success: false, error: (error as Error).message };
  }
};