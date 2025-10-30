export enum Role {
  PROFESIONAL = 'profesional',
  RECLUTADOR = 'reclutador',
}
export interface ITipousuario {
  id: number;
  nombre: Role;
}
