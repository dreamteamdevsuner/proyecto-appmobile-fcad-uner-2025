export interface DBEstudio {
  id: string;
  activo: boolean;
  titulo: string;
  fechainicio?: string | null;
  fechafin?: string | null;
  nombreinstitucion?: string | null;
  idprofesional: string;
}