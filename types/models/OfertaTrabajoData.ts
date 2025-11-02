export interface OfertaTrabajoData {
  idempresa?: string | null;
  titulo: string;
  descripcion?: string | null;
  iddireccion?: string | null;
  idmodalidad?: number | null;
  idtipojornada?: number | null;
  idcontratacion?: number | null;
  iddepartamento?: number | null;
  idusuario: string;
  idsoftskills: string[] | null;
  idhardskills: string[] | null;
}
