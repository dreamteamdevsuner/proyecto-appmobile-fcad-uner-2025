export interface CandidatoValues {
  nombre: string;
  apellido: string;
  profesion: string;
  localizacion: string;
  herramientas: string[];
  habilidades: string[];
  aboutMe: string;
  estudiosFormales: string;
  otrosEstudios: string;
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