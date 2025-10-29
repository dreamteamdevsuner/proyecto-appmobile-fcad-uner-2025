import { DBEstudio } from "@database/DBEstudio";

export interface CandidatoValues {
  nombre: string;
  apellido: string;
  profesion: string;
  localizacion: string;
  lat: string | null;
  lng: string | null;
  herramientas: string[];
  habilidades: string[];
  aboutMe: string;
  estudios: DBEstudio[];
  idiomasSeleccionados: string[];
  modalidadSeleccionada: string;
  jornadaSeleccionada: string;
  contratoSeleccionado: string;
  email: string;
  redes: { tipo: string; url: string }[];
  redSeleccionada?: string;
}

export interface ReclutadorValues {
  nombre: string;
  apellido: string;
  profesion: string;
  institucion: string;
  localizacion: string;
  palabrasClave: string[];
}