import { supabase } from "../supabase/supabaseClient";
import { CandidatoValues, ReclutadorValues } from "@interfaces/EditarPerfil";
import { DBEstudio, DBModalidad, DBTipoJornada, DBContratacion } from "@database/index";

export interface DropdownItem {
  label: string;
  value: string;
}

export const cargarListasParaFormularios = async () => {
  try {
    const [ skillsResult, 
      tiposEnlaceResult, 
      modalidadesResult, 
      tiposJornadaResult, 
      tiposContratacionResult]
    = await Promise.all([
      supabase.from('skill').select('id, nombre, idtiposkill'),
      supabase.from('tipoenlace').select('id, nombre').eq('activo', true),
      supabase.from('modalidad').select('id, nombre'),
      supabase.from('tipojornada').select('id, nombre'),
      supabase.from('contratacion').select('id, nombre')
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
      console.error('error al cargar skills: ', skillsResult.error);
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
      ? tiposJornadaResult.data.map((j: DBTipoJornada) => ({ label: j.nombre, value: String(j.id)}))
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

    return { habilidades, 
      herramientas, 
      idiomas, 
      listasTiposEnlace,
      modalidades,
      tiposJornada,
      tiposContratacion
     };
  } catch (error) {
    console.error('Error general cargando listas para formularios: ', error);
    return {
      habilidades: [], herramientas: [], idiomas: [], listasTiposEnlace: [],
      modalidades: [], tiposJornada: [], tiposContratacion: []
    };
  }
};
//Tipo rol del usuario
type TipoUsuario = 'profesional' | 'reclutador';

export const cargarDatosInicialesPerfil = async (
  userId: string,
  tipoUsuario: TipoUsuario,
) : Promise<CandidatoValues | ReclutadorValues> => {

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
    localizacion: usuario.direccion?.pais || usuario.direccion?.ciudad ||'',
    lat: usuario.direccion?.latitud ?? null, 
    lng: usuario.direccion?.longitud ?? null
  };

  //Carga datos específicos
  if (tipoUsuario === 'profesional') {
    //Datos profesionales
    const { data: prof } = await supabase
      .from('profesional') 
      .select('id, idmodalidad, idtipojornada')
      .eq('idusuario' , userId)
      .single();

    //Obtener skills del profesional
    const profesionalId = prof?.id;
    let habilidades: string[] = [], herramientas: string[] = [], idiomas: string[] = [];  
    let estudios: DBEstudio[] = [];

    if (profesionalId) {
      const { data: skillsBD } = await supabase
        .from('profesionalskill')
        .select('skill (id, idtiposkill)')
        .eq('idprofesional', profesionalId);

      if (skillsBD) {
        habilidades = skillsBD
          .filter(s => s.skill && s.skill[0] && s.skill[0].idtiposkill === 1)
          .map(s => String(s.skill![0].id));
        herramientas = skillsBD
          .filter(s => s.skill && s.skill[0] && s.skill[0].idtiposkill === 2)
          .map(s => String(s.skill![0].id));   
        idiomas = skillsBD
          .filter(s => s.skill && s.skill[0] && s.skill[0].idtiposkill === 3)
          .map(s => String(s.skill![0].id));       
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
        }));
      }
    }
    //Obtener enlaces redes
    const { data: enlacesBD } = await supabase
      .from('enlace')
      .select('url, tipoenlace (nombre)')
      .eq('idusuario' , userId)
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
      //Campos pendientes
      aboutMe: '',
      contratoSeleccionado: '',
    };
  } else {
    //Datos de reclutador
    const { data: reclu } = await supabase
      .from('reclutador')
      .select('nombreempresa')
      .eq('idusuario', userId)
      .single();
      
    return {
      ...datosBase,
      institucion: reclu?.nombreempresa || '',
      palabrasClave: [],   //pendiente- no esta en base de datos
    };
  }
};

//Guardar datos de perfil profesional
export const guardarPerfilProfesional = async (
  values: CandidatoValues,
  userId: string,
) => {
  try {
    await supabase.from('usuario').update({
        nombre: values.nombre,
        apellido: values.apellido,
        rol: values.profesion,
        email: values.email,
      }).eq('id', userId).throwOnError();

    const { data: userData } = await supabase.from('usuario').select('iddireccion').eq('id', userId).single();
    let direccionId = userData?.iddireccion;

    const direccionData = {
      pais: values.localizacion.split(', ')[1]?.trim() || values.localizacion,
      ciudad: values.localizacion.split(', ')[0]?.trim() || null,
      // latitud: values.lat,
      // longitud: values.lng,
    }
    if (direccionId) {
      await supabase.from('direccion').update(direccionData).eq('id', direccionId.throwOnError());;
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

    //Borrar e insertar skills
    const { data: profData } = await supabase.from('profesional').select('id').eq('idusuario', userId).single();
    if (!profData) throw new Error('No se encontro el perfil profesional.');
    const profesionalId = profData.id;

    await supabase.from('profesionalskill').delete().eq('idprofesional', profesionalId);
    const skillsId = [
      ...values.habilidades.map(Number),
      ...values.herramientas.map(Number),
      ...values.idiomasSeleccionados.map(Number),
    ];
    const skillsParaInsertar = skillsId.map(id => ({ idprofesional: profesionalId, idskill: id }));

    if (skillsParaInsertar.length > 0) {
      const { error: skillError } = await supabase.from('profesionalskill').insert(skillsParaInsertar).throwOnError();
    }

    //Manejar estudios (Borrar e insertar)
    await supabase.from('estudio').delete().eq('idprofesional', profesionalId);
    const estudiosPararInsertar = values.estudios.map(est => ({
      activo: est.activo || true,
      titulo: est.titulo,
      fechainicio: est.fechainicio || null,
      fechafin: est.fechafin || null,      
      nombreinstitucion: est.nombreinstitucion,
      idprofesional: profesionalId,
    }));
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

    console.warn("Campos 'aboutMe', no se guardan porque no existen en la base de datos.");
    return { success: true };
  } catch (error) {
    console.error('Error al guardar perfil profesional: ', error);
    return { success: false, error: (error as Error).message};
  }
};

//Guardar datos perfil reclutador
export const guardarPerfilReclutador = async (
  values: ReclutadorValues,
  userId: string,
) => {
  try {
    await supabase
      .from('usuario')
      .update({
        nombre: values.nombre,
        apellido: values.apellido,
        rol: values.profesion,
      })
      .eq('id', userId)
      .throwOnError();

    const { data: userData } = await supabase.from('usuario').select('iddireccion').eq('id', userId).single();
    let direccionId = userData?.iddireccion;
    const direccionData = {
      pais: values.localizacion.split(',')[1]?.trim() || values.localizacion, 
      ciudad: values.localizacion.split(',')[0]?.trim() || null, 
      // latitud: values.lat, 
      // longitud: values.lng,
    };
    if (direccionId) {
      await supabase.from('direccion').update({ pais: values.localizacion }).eq('id', direccionId).throwOnError();
    } else {
      const { data: newDir } = await supabase.from('direccion').insert(direccionData).select('id').single().throwOnError();
      direccionId = newDir!.id;
      await supabase.from('usuario').update({ iddireccion: direccionId }).eq('id', userId).throwOnError(); 
    }

    //Manejar reclutador(Upsert)
    await supabase
      .from('reclutador')
      .upsert({
        idusuario: userId,
        nombreempresa: values.institucion,
      }, { onConflict: 'idusuario' }).throwOnError();

    console.warn("El campo 'palabraClave' no se guarda porque no existe en la base de datos.");
    return { success: true };
  } catch (error) {
    console.error('Error al guardar perfil reclutador: ', error);
    return { success: false, error: (error as Error).message };
  }
};