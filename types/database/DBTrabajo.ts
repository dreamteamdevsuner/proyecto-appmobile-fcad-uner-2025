export interface DBTrabajo {
  id: string;
  idempresa?: string | null;
  idusuario: string;
  nombreempresa?: string | null;
  fechafin?: string | null;
  fechainicio?: string | null;
  posicion: string;
  activo: boolean;
  validado?: boolean;
}