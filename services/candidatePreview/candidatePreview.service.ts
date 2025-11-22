import { CandidatePreview } from '@database/DBCandidatePreview';
import { supabase } from '../../supabase/supabaseClient';
import { Pagination } from '@services/shared/entityPreviewService';

interface CandidateWithOffer extends CandidatePreview {
  ofertaId: string;
  ofertaTitulo: string;
}

export const getCandidatePreview = async (
  page = 1,
  itemsPerPage = 5,
  idUsuarioReclutador?: string,
): Promise<Pagination<CandidateWithOffer>> => {
  try {
    if (!idUsuarioReclutador) {
      console.warn('No se recibió idUsuarioReclutador');
      return {
        data: [],
        count: 0,
        next: false,
        prev: false,
        nextPage: null,
        prevPage: null,
      };
    }

    // Obtener ofertas activas del reclutador
    // ⚠️ CAMBIO REALIZADO: Agregamos "!inner" a la relación 'publicacion'
    // Esto obliga a que la oferta SÍ O SÍ pertenezca al usuario filtrado abajo.
    const { data: ofertas, error: ofertasError } = await supabase
      .from('ofertatrabajo')
      .select(
        'id, titulo, activo, idestadooferta, publicacion!inner(id, idusuario)',
      ) // <--- AQUÍ ESTABA EL DETALLE
      .eq('activo', true)
      .eq('idestadooferta', 1)
      .eq('publicacion.idusuario', idUsuarioReclutador);

    if (ofertasError) {
      console.error('Error obteniendo ofertas:', ofertasError);
      return {
        data: [],
        count: 0,
        next: false,
        prev: false,
        nextPage: null,
        prevPage: null,
      };
    }

    if (!ofertas || ofertas.length === 0) {
      return {
        data: [],
        count: 0,
        next: false,
        prev: false,
        nextPage: null,
        prevPage: null,
      };
    }

    const ofertaIds = ofertas.map((o) => o.id);

    // Obtener likes pendientes (idestadomatch = 1)
    const { data: matches, error: matchError } = await supabase
      .from('ofertatrabajomatch')
      .select('idprofesional, idofertatrabajo')
      .in('idofertatrabajo', ofertaIds)
      .eq('activo', true)
      .eq('idestadomatch', 1);

    if (matchError) {
      console.error('Error obteniendo matches:', matchError);
      return {
        data: [],
        count: 0,
        next: false,
        prev: false,
        nextPage: null,
        prevPage: null,
      };
    }

    if (!matches || matches.length === 0) {
      return {
        data: [],
        count: 0,
        next: false,
        prev: false,
        nextPage: null,
        prevPage: null,
      };
    }

    // Traer info de profesionales
    const idsProfesionales = matches.map((m) => m.idprofesional);
    const { data: profesionalesDB, error: usuariosError } = await supabase
      .from('profesional')
      .select('idusuario, id')
      .in('id', idsProfesionales);

    if (usuariosError || !profesionalesDB || profesionalesDB.length === 0) {
      console.error(
        'Error obteniendo profesionales en tabla profesional:',
        usuariosError,
      );
      return {
        data: [],
        count: 0,
        next: false,
        prev: false,
        nextPage: null,
        prevPage: null,
      };
    }

    // Mapear idprofesional => idusuario
    const profesionalIdToUsuarioId = Object.fromEntries(
      profesionalesDB.map((p) => [p.id, p.idusuario]),
    );

    const idsUsuarios = [...new Set(profesionalesDB.map((p) => p.idusuario))];

    // 4️⃣ Traer info de usuario (profesionales)
    const { data: usuarios, error: usuariosInfoError } = await supabase
      .from('usuario')
      .select('id, nombre, apellido, fotoperfil, bio, iddireccion(ciudad)')
      .in('id', idsUsuarios);

    if (usuariosInfoError || !usuarios) {
      console.error('Error obteniendo info de usuarios:', usuariosInfoError);
      return {
        data: [],
        count: 0,
        next: false,
        prev: false,
        nextPage: null,
        prevPage: null,
      };
    }

    // Construir array profesional+oferta (una fila por like)
    const result: CandidateWithOffer[] = matches
      .map((m) => {
        // console.log('➡️ Procesando match:', m);

        const usuarioId = profesionalIdToUsuarioId[m.idprofesional];
        // console.log('   🔵 usuarioId obtenido:', usuarioId);

        const usuario = usuarios.find((u) => u.id === usuarioId);
        // console.log('   🟢 usuario encontrado:', usuario);

        const oferta = ofertas.find((o) => o.id === m.idofertatrabajo);
        // console.log('   🟣 oferta encontrada:', oferta);

        if (!usuario || !oferta) {
          // console.log(
          //   '   ⚠️ usuario u oferta no encontrada → devolviendo null',
          // );
          return null;
        }

        const fila = {
          ...usuario,
          profesionalId: m.idprofesional,
          ofertaId: oferta.id,
          ofertaTitulo: oferta.titulo || 'Oferta',
        };

        // console.log('   ✅ fila generada:', fila);
        return fila;
      })
      .filter(Boolean) as CandidateWithOffer[];

    // console.log(
    //   '🟩 RESULT FINAL:',
    //   result.map((r) => (r ? `${r.nombre} ${r.apellido}` : null)),
    // );

    // Paginación simple
    const totalCount = result.length;
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedData = result.slice(start, end);

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    return {
      data: paginatedData,
      count: totalCount,
      next: page < totalPages,
      prev: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };
  } catch (err) {
    console.error('Error interno en getCandidatePreview:', err);
    return {
      data: [],
      count: 0,
      next: false,
      prev: false,
      nextPage: null,
      prevPage: null,
    };
  }
};

/* Código anterior
import { CandidatePreview } from '@database/DBCandidatePreview';
import { getEntityPreview } from '@services/shared/entityPreviewService';

export const getCandidatePreview = async (page = 1, itemsPerPage = 5) => {
  return getEntityPreview<CandidatePreview>(
    page,
    itemsPerPage,
    'usuario',
    '* ,  iddireccion(ciudad) ',
    { col: 'idtipousuario', value: '1' },
  );
};
*/
