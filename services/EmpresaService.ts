import { Empresa } from '@models/index';
import { supabase } from '../supabase/supabaseClient';

export async function getEmpresas(): Promise<Empresa[]> {
  const { data: empresas, error } = await supabase
    .from('empresa')
    .select(
      `
      id, nombre
      `,
    )
    .eq('activo', true);

  if (error) throw new Error(error.message);
  if (!empresas) return [];
  return empresas;
}
