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
