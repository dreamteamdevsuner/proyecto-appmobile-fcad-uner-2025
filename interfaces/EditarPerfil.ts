export interface PerfilValues {
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
}