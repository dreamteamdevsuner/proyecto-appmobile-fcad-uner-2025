import { DBEstudio } from "@database/DBEstudio";

export interface SkillConNivel {
  idskill: string;
  idnivel: string | null;
}

export interface CandidatoValues {
  nombre: string;
  apellido: string;
  profesion: string;
  localizacion: string;
  lat: string | null;
  lng: string | null;
  herramientas: SkillConNivel[];
  habilidades: string[];
  aboutMe: string;
  estudios: DBEstudio[];
  idiomasSeleccionados: SkillConNivel[];
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