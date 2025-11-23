interface IdiomaNivel {
  idioma: string;
  nivel: string;
}

export interface OfertaValues {
  id?: string | null;
  titulo: string;
  institucion: string | null;
  idinstitucion?: string | null;
  iddireccion?: string | null;
  localizacion: string;
  lat: number;
  lng: number;
  area: string | null;
  modalidad: number | null;
  jornada: number | null;
  contrato: number | null;
  descripcion: string;
  beneficios: string;
  salario?: string;
  foto?: string;
  idiomasNiveles: IdiomaNivel[];
  softSkills: string[];
  hardSkills: string[];
}
