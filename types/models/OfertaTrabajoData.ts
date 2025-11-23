export interface OfertaTrabajoData {
  id?: string | null;
  idempresa?: string | null;
  titulo: string;
  descripcion?: string | null;
  direccion?: string | null;
  latitud?: string | null;
  longitud?: string | null;
  iddireccion?: string | null;
  idmodalidad?: number | null;
  idtipojornada?: number | null;
  idcontratacion?: number | null;
  iddepartamento?: number | null;
  idusuario: string;
  idsoftskills: string[] | null;
  idhardskills: string[] | null;
  idarea: string | null;
  beneficios?: string | null;
}
