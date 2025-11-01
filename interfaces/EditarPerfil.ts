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