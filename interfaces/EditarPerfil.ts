import { DBEstudio, DBTrabajo } from "@database/index";

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
  trabajos: DBTrabajo[];
  idiomasSeleccionados: string[];
  modalidadSeleccionada: string;
  jornadaSeleccionada: string;
  areaSeleccionada?: string;
  email: string;
  redes: { tipo: string; url: string }[];
  redSeleccionada?: string;
  avatar_url?: string | null;     // mostrar imagen actual
  avatarBase64?: string | null;   //Enviar nueva
}

export interface ReclutadorValues {
  nombre: string;
  apellido: string;
  profesion: string;
  institucion: string;
  localizacion: string;
  palabrasClave: string[];
  avatar_url?: string | null;
  avatarBase64?: string | null;
}