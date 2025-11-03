export interface DBUsuario {
  id: string;
  nombre: string;
  apellido: string;
  rol: string;
  iddireccion?: string | null;
  email: string;
  idplan: number;
  activo: boolean;
  idtipousuario?: number | null;
  fotoperfil?: string | null;
  bio: string | null;
}
