import { supabase } from '../supabase/supabaseClient';
import { DBUsuario } from '@database/index';

export async function getUsuariosMatchOferta(
  ofertaId: string,
): Promise<DBUsuario[]> {
  const { data, error } = await supabase
    .from('ofertatrabajomatch')
    .select(
      `
      profesional:profesional (
        usuario:usuario (id, nombre, apellido, email, fotoperfil, idplan, activo, rol)
      )
    `,
    )
    .eq('idofertatrabajo', ofertaId)
    .eq('activo', true);

  if (error) throw new Error(error.message);
  if (!data) return [];

  const usuarios: DBUsuario[] = [];

  for (const match of data) {
    const profs = Array.isArray(match.profesional)
      ? match.profesional
      : match.profesional
        ? [match.profesional]
        : [];
    for (const prof of profs) {
      const usrs = Array.isArray(prof.usuario)
        ? prof.usuario
        : prof.usuario
          ? [prof.usuario]
          : [];
      usuarios.push(...usrs);
    }
  }

  console.log(`Usuarios fetched ofertaId ${ofertaId}:`, usuarios);
  return usuarios;
}
