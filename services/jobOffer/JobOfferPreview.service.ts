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
  // Obtener usuario actual logueado
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    console.warn('No se encontró usuario logueado');
    return {
      data: [],
      count: 0,
      next: false,
      prev: false,
      nextPage: null,
      prevPage: null,
    };
  }

  // Buscar el área del profesional
  const { data: profesional, error: profError } = await supabase
    .from('profesional')
    .select('idarea')
    .eq('idusuario', userData.user.id)
    .single();

  if (profError || !profesional?.idarea) {
    console.warn(
      'El profesional no tiene área asignada o hubo error:',
      profError,
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

  // Llamar al servicio genérico filtrando por área
  return getEntityPreview<DBJobPreview>(
    page,
    itemsPerPage,
    'ofertatrabajo',
    `* ,
      idempresa(nombre),
      iddireccion(ciudad),
      idtipojornada(nombre),
      idmodalidad(nombre),
      idpublicacion(fechacreacion, idusuario(nombre, apellido, fotoperfil, rol, iddireccion(ciudad)))
    `,
    {
      filters: { idarea: profesional.idarea },
    },
  );
};

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
