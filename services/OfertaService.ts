import { supabase } from '../supabase/supabaseClient';
import { DBOfertaTrabajo } from '@database/index';
import { OfertaTrabajoData } from '@models/OfertaTrabajoData';

export async function getOfertas(): Promise<DBOfertaTrabajo[]> {
  const { data, error } = await supabase
    .from('ofertatrabajo')
    .select('id,titulo')
    .eq('activo', true)
    //   .select(
    //     `
    //   id,titulo, descripcion,
    //   empresa (*,direccion (*)),
    //   modalidad (*),
    //   contratacion (*),
    //   departamento (*),
    //   direccion (*),
    //   tipojornada (*),
    //   estadooferta (*)
    // `,
    //   )
    .overrideTypes<DBOfertaTrabajo[], { merge: false }>();

  if (error) throw new Error(error.message);
  return data ?? [];
}
export async function crearOferta(data: OfertaTrabajoData) {
  try {
    const { data: publicacion, error: pubError } = await supabase
      .from('publicacion')
      .insert([{ idusuario: data.idusuario }])
      .select()
      .single();

    if (pubError) throw pubError;

    const { data: oferta, error: ofertaError } = await supabase
      .from('ofertatrabajo')
      .insert([
        {
          idpublicacion: publicacion.id,
          idempresa: null,
          titulo: data.titulo,
          descripcion: data.descripcion,
          idmodalidad: data.idmodalidad ?? null,
          idtipojornada: data.idtipojornada ?? null,
          idestadooferta: 1,
          idcontratacion: data.idcontratacion ?? null,
          iddepartamento: data.iddepartamento ?? null,
          iddireccion: data.iddireccion ?? null,
        },
      ])
      .select()
      .single();

    if (ofertaError) throw ofertaError;

    return oferta;
  } catch (err: any) {
    console.error('Error creando oferta:', err);
    throw err;
  }
}
