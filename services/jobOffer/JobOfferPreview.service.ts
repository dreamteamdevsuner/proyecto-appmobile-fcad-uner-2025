import { DBJobPreview } from '@database/DBJobPreview';
import { supabase } from '../../supabase/supabaseClient';
import { Pagination } from '@services/shared/entityPreviewService';

export const getJobOffersPreview = async (
  page = 1,
  itemsPerPage = 5,
): Promise<Pagination<DBJobPreview>> => {
  try {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return emptyPagination();

    const { data: profesional } = await supabase
      .from('profesional')
      .select('id, idarea')
      .eq('idusuario', userData.user.id)
      .single();

    if (!profesional?.idarea) return emptyPagination();

    const { data: matches } = await supabase
      .from('ofertatrabajomatch')
      .select('idofertatrabajo')
      .eq('idprofesional', profesional.id);

    const excludedIds = matches?.map((m) => m.idofertatrabajo) || [];

    // No usamos getEntityPreview para tener control total del filtro .not()
    let query = supabase
      .from('ofertatrabajo')
      .select(
        `
        *,
        idempresa(nombre),
        iddireccion(ciudad),
        idtipojornada(nombre),
        idmodalidad(nombre),
        idpublicacion(
          fechacreacion, 
          idusuario(nombre, apellido, fotoperfil, rol, iddireccion(ciudad))
        )
      `,
        { count: 'exact' },
      )
      .eq('idarea', profesional.idarea)
      .eq('activo', true);

    if (excludedIds.length > 0) {
      query = query.not('id', 'in', `(${excludedIds.join(',')})`);
    }

    // Paginación y Orden
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;

    // Importante: Ordenamos por ID (desc) o fecha si existiera en la tabla base
    // para que la paginación no pierda filas nuevas.
    const { data, error, count } = await query
      .order('id', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching job offers');
      return emptyPagination();
    }

    const totalCount = count ?? 0;
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    return {
      data: (data as unknown as DBJobPreview[]) || [],
      count: totalCount,
      next: page < totalPages,
      prev: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };
  } catch (err) {
    console.error('Exception en getJobOffersPreview.');
    return emptyPagination();
  }
};

const emptyPagination = () => ({
  data: [],
  count: 0,
  next: false,
  prev: false,
  nextPage: null,
  prevPage: null,
});

/* Código anterior
import { DBJobPreview } from '@database/DBJobPreview';
import { supabase } from '../../supabase/supabaseClient';
import {
  getEntityPreview,
  Pagination,
} from '@services/shared/entityPreviewService';

export const getJobOffersPreview = async (
  page = 1,
  itemsPerPage = 5,
): Promise<Pagination<DBJobPreview>> => {
  return getEntityPreview<DBJobPreview>(
    page,
    itemsPerPage,
    'ofertatrabajo',
    '* , idempresa(nombre) , iddireccion(ciudad)   , idtipojornada(nombre) , idmodalidad(nombre) , idpublicacion(fechacreacion , idusuario(nombre , apellido ,fotoperfil , rol ,  iddireccion( ciudad)))',
  );
};
*/
