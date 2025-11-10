import { OfertaConDetalles } from '@services/profile/ProfileService';

export type PerfilView = {
  id: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  bio?: string | null;
  fotoPerfil?: string;
  rol?: string;
  direccion?: { ciudad?: string } | null;
  tipoUsuario?: { nombre?: string } | null;
  enlaces?: {
    activo: boolean;
    id: string;
    idtipoenlace: number;
    idusuario: string;
    url: string;
    tipoenlace: { activo: boolean; id: string; nombre: string };
  }[];
  estudios?: {
    activo: boolean;
    fechafin: string | null;
    fechainicio: string | null;
    id: string;
    idprofesional: string;
    nombreinstitucion: string | null;
    titulo: string;
  }[];
  experiencia?: any[];
  skills?: {
    habilidades?: { nombre?: string }[];
    herramientas?: { nombre?: string }[];
    idiomas?: { nombre?: string }[];
    otras?: { nombre?: string }[];
  } | null;
  ofertasPublicadas?: OfertaConDetalles[];
};
