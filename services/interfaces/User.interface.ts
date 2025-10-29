// export interface IUser {
//   id: string;
//   nombre: string;
//   apellido: string;
//   iddireccion: null;
//   email: string;
//   idplan: number;
//   activo: boolean;
//   idtipousuario: number;
//   fotoperfil: null | string;
//   rol: string;

import { ITipousuario } from './TipoUsuario.interface';

// }
export interface IUser {
  activo: boolean;
  apellido: string;
  email: string;
  fotoperfil: null | string;
  id: string;
  iddireccion: null;
  idplan: number;
  idtipousuario: number;
  nombre: string;
  rol: string;
  tipousuario: ITipousuario;
}
