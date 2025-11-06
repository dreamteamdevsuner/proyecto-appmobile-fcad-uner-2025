export interface CandidatePreview {
  id: string;
  nombre: string;
  apellido: string;
  iddireccion: null | { ciudad: string };
  email: string;
  idplan: number;
  activo: boolean;
  idtipousuario: number;
  fotoperfil: null | string;
  rol: null | string;
  expo_push_token: null | string;
  bio: null | string;
}
