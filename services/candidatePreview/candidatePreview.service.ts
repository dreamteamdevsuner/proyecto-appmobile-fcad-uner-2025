import { CandidatePreview } from '@database/DBCandidatePreview';
import { supabase } from '../../supabase/supabaseClient';
import { Pagination } from '@services/shared/entityPreviewService';

interface CandidateWithOffer extends CandidatePreview {
  ofertaId: string;
  ofertaTitulo: string;
}

// 📌 Objeto único reutilizable para todos los returns vacíos
const EMPTY_PAGINATION: Pagination<any> = {
  data: [],
  count: 0,
  next: false,
  prev: false,
  nextPage: null,
  prevPage: null,
};

const returnEmpty = () => EMPTY_PAGINATION;
const isEmpty = (arr?: any[]) => !arr || arr.length === 0;

export const getCandidatePreview = async (
  page = 1,
  itemsPerPage = 5,
  idUsuarioReclutador?: string,
): Promise<Pagination<CandidateWithOffer>> => {
  try {
    if (!idUsuarioReclutador) {
      console.warn('No se recibió idUsuarioReclutador');
      return returnEmpty();
    }

    // 📌 1. Obtener ofertas activas del reclutador
    const { data: ofertas, error: ofertasError } = await supabase
      .from('ofertatrabajo')
      .select('id, titulo, activo, idestadooferta, publicacion(id, idusuario)')
      .eq('activo', true)
      .eq('idestadooferta', 1)
      .eq('publicacion.idusuario', idUsuarioReclutador);

    if (ofertasError || isEmpty(ofertas)) return returnEmpty();

    const ofertaIds = ofertas.map((o) => o.id);

    // 📌 2. Obtener likes pendientes
    const { data: matches, error: matchError } = await supabase
      .from('ofertatrabajomatch')
      .select('idprofesional, idofertatrabajo')
      .in('idofertatrabajo', ofertaIds)
      .eq('activo', true)
      .eq('idestadomatch', 1);

    if (matchError || isEmpty(matches)) return returnEmpty();

    // 📌 3. Datos de profesionales
    const idsProfesionales = matches.map((m) => m.idprofesional);

    const { data: profesionalesDB, error: usuariosError } = await supabase
      .from('profesional')
      .select('idusuario, id')
      .in('id', idsProfesionales);

    if (usuariosError || isEmpty(profesionalesDB)) return returnEmpty();

    // Mapear profesional → usuario
    const profesionalIdToUsuarioId = Object.fromEntries(
      profesionalesDB.map((p) => [p.id, p.idusuario]),
    );

    const idsUsuarios = [...new Set(profesionalesDB.map((p) => p.idusuario))];

    // 📌 4. Info de usuario
    const { data: usuarios, error: usuariosInfoError } = await supabase
      .from('usuario')
      .select('id, nombre, apellido, fotoperfil, bio, iddireccion(ciudad)')
      .in('id', idsUsuarios);

    if (usuariosInfoError || isEmpty(usuarios)) return returnEmpty();

    // 📌 5. Construir resultado (una fila por like)
    const result: CandidateWithOffer[] = matches
      .map((match) => {
        const usuarioId = profesionalIdToUsuarioId[match.idprofesional];
        const usuario = usuarios.find((u) => u.id === usuarioId);
        const oferta = ofertas.find((o) => o.id === match.idofertatrabajo);

        if (!usuario || !oferta) return null;

        return {
          ...usuario,
          profesionalId: match.idprofesional,
          ofertaId: oferta.id,
          ofertaTitulo: oferta.titulo ?? 'Oferta',
        };
      })
      .filter(Boolean) as CandidateWithOffer[];

    if (isEmpty(result)) return returnEmpty();

    // 📌 6. Paginación
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
    return returnEmpty();
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
