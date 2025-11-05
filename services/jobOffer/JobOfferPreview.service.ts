import { DBJobPreview } from '@database/DBJobPreview';
import { supabase } from '../../supabase/supabaseClient';
export interface Pagination<T> {
  next: boolean;
  prev: boolean;
  nextPage: number | null;
  prevPage: number | null;
  data: Array<T>;
}

export const getJobOffersPreview = async (
  page = 1,
  itemsPerPage = 5,
): Promise<Pagination<DBJobPreview>> => {
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage;
  const { data, error } = await supabase
    .from('ofertatrabajo')
    .select(
      '* , idempresa(nombre) , iddireccion(ciudad)   , idtipojornada(nombre) , idmodalidad(nombre) , idpublicacion(fechacreacion , idusuario(nombre , apellido ,fotoperfil , rol ,  iddireccion( ciudad)))',
    )
    .order('id', { ascending: true })
    .range(from, to);
  if (error) {
    console.error(error);
    console.error('Error getting job offers ');
    throw Error('Error getting job offers ');
  }
  const isNext = data.pop();
  console.log(JSON.stringify(data, null, 3));
  console.log('DATAAA', data);
  return {
    next: Boolean(isNext),
    prev: page != 1,
    nextPage: Boolean(isNext) ? page + 1 : null,
    prevPage: page !== 1 ? page - 1 : null,
    data,
  };
};
