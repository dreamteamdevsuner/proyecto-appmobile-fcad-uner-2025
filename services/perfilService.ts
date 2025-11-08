import { supabase } from "../supabase/supabaseClient";
import { CandidatoValues, ReclutadorValues, SkillConNivel } from "@interfaces/EditarPerfil";
import { DBUsuario, DBEstudio, DBModalidad, DBTipoJornada, DBContratacion, DBNivel } from "@database/index";

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

export const cargarListasParaFormularios = async () => {
  try {
    const [skillsResult,
      tiposEnlaceResult,
      modalidadesResult,
      tiposJornadaResult,
      tiposContratacionResult,
      nivelesResult
    ] = await Promise.all([
      supabase.from('skill').select('id, nombre, idtiposkill'),
      supabase.from('tipoenlace').select('id, nombre').eq('activo', true),
      supabase.from('modalidad').select('id, nombre'),
      supabase.from('tipojornada').select('id, nombre'),
      supabase.from('contratacion').select('id, nombre'),
      supabase.from('nivel').select('id, nombre')
    ]);

    const habilidades: DropdownItem[] = [];
    const herramientas: DropdownItem[] = [];
    const idiomas: DropdownItem[] = [];
    if (skillsResult.data) {
      for (const skill of skillsResult.data) {
        const item = { label: skill.nombre, value: String(skill.id) };
        switch (skill.idtiposkill) {
          case 1: //Habilidades- Blandas(BD)
            habilidades.push(item);
            break;
          case 2:  //Herramientas- Técnicas(BD)
            herramientas.push(item);
            break;
          case 3: //Idiomas seleccionados- Idiomas(BD)
            idiomas.push(item);
            break;
        }
      }
    } else if (skillsResult.error) {
      console.error('Error al cargar skills: ', skillsResult.error);
    }

    //Carga tipos enlaces(Redes)
    const listasTiposEnlace: DropdownItem[] = tiposEnlaceResult.data
      ? tiposEnlaceResult.data.map(e => ({ label: e.nombre, value: String(e.id) }))
      : [];
    if (tiposEnlaceResult.error) {
      console.error('Error al cargar tipos de enlaces: ', tiposEnlaceResult.error);
    }

    const modalidades: DropdownItem[] = modalidadesResult.data
      ? modalidadesResult.data.map((m: DBModalidad) => ({ label: m.nombre, value: String(m.id) }))
      : [];
    if (modalidadesResult.error) {
      console.error('Error al cargar modalidades: ', modalidadesResult.error);
    }

    const tiposJornada: DropdownItem[] = tiposJornadaResult.data
      ? tiposJornadaResult.data.map((j: DBTipoJornada) => ({ label: j.nombre, value: String(j.id) }))
      : [];
    if (tiposJornadaResult.error) {
      console.error('Error al cargar tipos de jornadas: ', tiposJornadaResult.error);
    }

    const tiposContratacion: DropdownItem[] = tiposContratacionResult.data
      ? tiposContratacionResult.data.map((c: DBContratacion) => ({ label: c.nombre, value: String(c.id) }))
      : [];
    if (tiposContratacionResult.error) {
      console.error('Error al cargar tipos de contratación: ', tiposContratacionResult.error);
    }

    const niveles: DropdownItem[] = nivelesResult.data
      ? nivelesResult.data.map((n: DBNivel) => ({ label: n.nombre, value: String(n.id) }))
      : [];
    if (nivelesResult.error) {
      console.error('Error cargando niveles: ', nivelesResult.error);
    }

    return {
      habilidades,
      herramientas,
      idiomas,
      listasTiposEnlace,
      modalidades,
      tiposJornada,
      tiposContratacion,
      niveles
    };
  } catch (error) {
    console.error('Error general cargando listas para formularios: ', error);
    return {
      habilidades: [], herramientas: [], idiomas: [], listasTiposEnlace: [],
      modalidades: [], tiposJornada: [], tiposContratacion: [], niveles: []
    };
  }
};
//Tipo rol del usuario
type TipoUsuario = 'profesional' | 'reclutador';

export const cargarDatosInicialesPerfil = async (
  userId: string,
  tipoUsuario: TipoUsuario,
): Promise<CandidatoValues | ReclutadorValues> => {

  //Obtener usuario y dirección
  const { data: usuario, error: userError } = await supabase
    .from('usuario')
    .select('*, direccion(pais, ciudad, latitud, longitud)')
    .eq('id', userId)
    .single();

  if (userError || !usuario) {
    throw new Error(userError?.message || 'No se encontro el usuario');
  }

  //Objeto con datos comunes
  const datosBase = {
    nombre: usuario.nombre || '',
    apellido: usuario.apellido || '',
    profesion: usuario.rol || '',   //Mapeo: profesion -> rol(BD)
    email: usuario.email || '',
    localizacion: usuario.direccion?.pais || usuario.direccion?.ciudad || '',
    lat: usuario.direccion?.latitud ?? null,
    lng: usuario.direccion?.longitud ?? null,
    avatar_url: usuario.fotoperfil || null,
    avatarBase64: null,
  };

  //Carga datos específicos
  if (tipoUsuario === 'profesional') {
    const { data: prof } = await supabase
      .from('profesional')
      .select('id, idmodalidad, idtipojornada')
      .eq('idusuario', userId)
      .maybeSingle();

    //Obtener skills del profesional
    const profesionalId = prof?.id;
    let habilidades: string[] = [], herramientas: SkillConNivel[] = [], idiomas: SkillConNivel[] = [];
    let estudios: DBEstudio[] = [];

    if (profesionalId) {
      const { data: skillsBD } = await supabase
        .from('profesionalskill')
        .select('idnivel, skill (id, idtiposkill)')
        .eq('idprofesional', profesionalId);

      if (skillsBD) {
        const mapearSkill = (s: any): SkillConNivel => ({
          idskill: String(s.skill![0].id),
          idnivel: s.idnivel ? String(s.idnivel) : null
        });
        habilidades = skillsBD.filter(s => s.skill?.[0]?.idtiposkill === 1).map(s => String(s.skill![0].id));
        herramientas = skillsBD.filter(s => s.skill?.[0]?.idtiposkill === 2).map(mapearSkill);
        idiomas = skillsBD.filter(s => s.skill?.[0]?.idtiposkill === 3).map(mapearSkill);
      }
      //Carga estudios
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
    //Obtener enlaces redes
    const { data: enlacesBD } = await supabase
      .from('enlace')
      .select('url, tipoenlace (nombre)')
      .eq('idusuario', userId)
      .eq('activo', true);

    const redes = enlacesBD ? enlacesBD
      .filter(e => e.tipoenlace?.[0])
      .map(e => ({
        tipo: e.tipoenlace![0].nombre,
        url: e.url,
      })) : [];

    return {
      ...datosBase,
      modalidadSeleccionada: String(prof?.idmodalidad || ''),
      jornadaSeleccionada: String(prof?.idtipojornada || ''),
      habilidades,
      herramientas,
      idiomasSeleccionados: idiomas,
      estudios: estudios,
      redes,
      redSeleccionada: '',
      aboutMe: usuario.bio || '',
      contratoSeleccionado: '',
      lat: usuario.direccion?.latitud ?? null,
      lng: usuario.direccion?.longitud ?? null,
    };
  } else {
    //Datos de reclutador
    const { data: reclu } = await supabase
      .from('reclutador')
      .select('nombreempresa')
      .eq('idusuario', userId)
      .maybeSingle();

    return {
      ...datosBase,
      institucion: reclu?.nombreempresa || '',
      palabrasClave: [],   //pendiente- no esta en base de datos
      lat: usuario.direccion?.latitud ?? null,
      lng: usuario.direccion?.longitud ?? null,
    };
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

    const { data: userData } = await supabase.from('usuario').select('iddireccion').eq('id', userId).single();
    let direccionId = userData?.iddireccion;

    const direccionData = {
      pais: values.localizacion.split(', ')[1]?.trim() || values.localizacion,
      ciudad: values.localizacion.split(', ')[0]?.trim() || '',
      // latitud: values.lat,
      // longitud: values.lng,
    }
    if (direccionId) {
      await supabase.from('direccion').update(direccionData).eq('id', direccionId).throwOnError();
    } else {
      const { data: newDir } = await supabase.from('direccion').insert(direccionData).select('id').single().throwOnError();
      direccionId = newDir!.id;
      await supabase.from('usuario').update({ iddireccion: direccionId }).eq('id', userId).throwOnError();
    }

    //Manejar profesional(Upsert)
    await supabase.from('profesional').upsert({
      idusuario: userId,
      idmodalidad: values.modalidadSeleccionada ? Number(values.modalidadSeleccionada) : null,
      idtipojornada: values.jornadaSeleccionada ? Number(values.jornadaSeleccionada) : null,
    }, { onConflict: 'idusuario' }).throwOnError();

    // Borrar e insertar skills
    const { data: profData } = await supabase.from('profesional').select('id').eq('idusuario', userId).single();
    if (!profData) throw new Error('No se encontro el perfil profesional.');
    const profesionalId = profData.id;

    // Eliminar skills previas (lanzar error en caso de fallo)
    await supabase.from('profesionalskill').delete().eq('idprofesional', profesionalId).throwOnError();

    // Normalizar las listas: todas como objetos { idskill: string, idnivel: string | number | null }
    const todasLasSkills = [
      ...values.habilidades.map(id => ({ idskill: String(id), idnivel: null })),
      ...values.herramientas.map(h => ({ idskill: String(h.idskill), idnivel: h.idnivel ?? null })),
      ...values.idiomasSeleccionados.map(i => ({ idskill: String(i.idskill), idnivel: i.idnivel ?? null })),
    ];

    // Preparar payload respetando los tipos de la BD: idskill es string (uuid), idnivel es number | null
    const skillsParaInsertar = todasLasSkills.map(s => ({
      idprofesional: profesionalId,
      idskill: s.idskill,
      idnivel: s.idnivel ? Number(s.idnivel) : null,
    }));

    if (skillsParaInsertar.length > 0) {
      await supabase.from('profesionalskill').insert(skillsParaInsertar).throwOnError();
    }

    //Manejar estudios (Borrar e insertar)
    await supabase.from('estudio').delete().eq('idprofesional', profesionalId);
    const estudiosPararInsertar = values.estudios.map(est => {
      const formatoFecha = (fechaString: string | null | undefined): string | null => {
        if (!fechaString || !/^\d{4}$/.test(fechaString.trim())) {
          return null;
        }
        return `${fechaString.trim()}-01-01`;
      };
      return {
        activo: est.activo || true,
        titulo: est.titulo,
        fechainicio: formatoFecha(est.fechainicio),
        fechafin: formatoFecha(est.fechafin),
        nombreinstitucion: est.nombreinstitucion,
        idprofesional: profesionalId,
      };
    });
    if (estudiosPararInsertar.length > 0) {
      await supabase.from('estudio').insert(estudiosPararInsertar).throwOnError();
    }

    //Borrar e insertar enlaces
    await supabase.from('enlace').delete().eq('idusuario', userId);
    const { data: tiposEnlace } = await supabase.from('tipoenlace').select('id, nombre').throwOnError();
    if (!tiposEnlace) throw new Error("No se pudieron cargar los tipos de enlace");
    const mapaTipos = new Map<string, number>(tiposEnlace.map(t => [t.nombre, t.id]));
    const enlacesParaInsertar = values.redes.map(red => ({
      idusuario: userId,
      url: red.url,
      idtipoenlace: mapaTipos.get(red.tipo),
      activo: true,
    })).filter(e => e.idtipoenlace);
    if (enlacesParaInsertar.length > 0) {
      await supabase.from('enlace').insert(enlacesParaInsertar).throwOnError();
    }

    return { success: true };
  } catch (error) {
    console.error('Error al guardar perfil profesional: ', error);
    return { success: false, error: (error as Error).message };
  }
};

//Guardar datos perfil reclutador
export const guardarPerfilReclutador = async (
  values: ReclutadorValues,
  userId: string,
) => {
  try {
    let nuevaFotoUrl: string | null = null;

    if (values.avatarBase64) {
      console.log('Detectada nueva imagen base64 para reclutador, subiendo...');
      nuevaFotoUrl = await uploadAvatar(values.avatarBase64, userId);
    }

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

    const { data: userData } = await supabase.from('usuario').select('iddireccion').eq('id', userId).single();
    let direccionId = userData?.iddireccion;
    const direccionData = {
      pais: values.localizacion.split(',')[1]?.trim() || values.localizacion,
      ciudad: values.localizacion.split(',')[0]?.trim() || '',
      // latitud: values.lat, 
      // longitud: values.lng,
    };
    if (direccionId) {
      await supabase.from('direccion').update(direccionData).eq('id', direccionId).throwOnError();
    } else {
      const { data: newDir } = await supabase.from('direccion').insert(direccionData).select('id').single().throwOnError();
      direccionId = newDir!.id;
      await supabase.from('usuario').update({ iddireccion: direccionId }).eq('id', userId).throwOnError();
    }

    //Manejar reclutador(Upsert)
    await supabase.from('reclutador').upsert({
      idusuario: userId,
      nombreempresa: values.institucion,
    }, { onConflict: 'idusuario' }).throwOnError();

    // console.warn("El campo 'palabraClave' no se guarda porque no existe en la base de datos.");
    return { success: true };
  } catch (error) {
    console.error('Error al guardar perfil reclutador: ', error);
    return { success: false, error: (error as Error).message };
  }
};