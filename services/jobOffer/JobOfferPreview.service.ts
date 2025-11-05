import { DBJobPreview } from '@database/DBJobPreview';
import { supabase } from '../../supabase/supabaseClient';

export const getJobOffersPreview = async (
  page = 1,
  itemsPerPage = 5,
): Promise<Array<DBJobPreview>> => {
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;
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
  console.log(JSON.stringify(data, null, 3));
  return data;
};
