export interface DBOfertaTrabajo {
  id: string;
  idpublicacion: string;
  idempresa?: string | null;
  titulo: string;
  descripcion?: string | null;
  iddireccion?: string | null;
  promocionado: boolean;
  idmodalidad?: number | null;
  idtipojornada?: number | null;
  idestadooferta: number;
  idcontratacion?: number | null;
  iddepartamento?: number | null;
}
