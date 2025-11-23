import { DBJobPreview } from '@database/DBJobPreview';
import { supabase } from '../../supabase/supabaseClient';
import { OfertaTrabajoData } from '@models/OfertaTrabajoData';
import { PostgrestError, PostgrestSingleResponse } from '@supabase/supabase-js';
import {
  JobOfferFullDescription,
  Skill,
} from '../../types/JobOfferFullDescription';

export const getJobOffer = async (
  jobOfferId: string,
): Promise<JobOfferFullDescription> => {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) throw Error('No user');
  try {
    const { data: userData } = await supabase.auth.getUser();

    const { data: profesional } = await supabase
      .from('profesional')
      .select('id, idarea')
      .eq('idusuario', userData?.user?.id)
      .single();

    if (!profesional?.idarea) throw Error('Wrong professional area');

    // No usamos getEntityPreview para tener control total del filtro .not()
    const { data: ofertaTrabajo, error } = await supabase
      .from('ofertatrabajo')
      .select(
        `
        *,
        iddireccion(*),
        idmodalidad(*),
        idpublicacion(fechacreacion , idusuario(nombre , apellido , fotoperfil  , rol, iddireccion( pais , ciudad ,direccion  ))),
        idtipojornada (nombre)  ,
        idempresa(nombre , iddireccion( pais , ciudad ,direccion  )),
        idarea(nombre)
         
      `,
      )

      .eq('id', jobOfferId)
      .eq('activo', true)
      .single();
    console.log('err', error);
    if (error) {
      console.log('error', error);
      throw Error('Error getting job offer');
    }
    if (!ofertaTrabajo) {
      throw Error('No se encontro oferta ');
    }
    const { data: skills, error: skillsError } = await supabase
      .from('ofertatrabajoskill')
      .select('idskill(nombre)')
      .eq('idofertatrabajo', jobOfferId);

    if (skillsError) {
      throw Error('Error getting skills ');
    }
    const jobOfferFullDescription: JobOfferFullDescription = {
      ...ofertaTrabajo,
      skills,
    };

    return jobOfferFullDescription;
  } catch (err) {
    const parsedError = err as unknown as PostgrestError;

    throw Error(parsedError.message);
  }
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
