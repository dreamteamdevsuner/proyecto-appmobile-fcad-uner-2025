export interface JobOfferFullDescription {
  id: string;
  idpublicacion: Idpublicacion;
  idempresa: Idempresa;
  titulo: string;
  descripcion: string;
  iddireccion: JobOfferFullDescriptionIddireccion;
  promocionado: boolean;
  idmodalidad: Idmodalidad;
  idtipojornada: Idarea;
  idestadooferta: number;
  idcontratacion: number;
  iddepartamento: null;
  activo: boolean;
  idarea: Idarea;
  beneficios: string;
  skills: Skill[];
}

export interface Idarea {
  nombre: string;
}

export interface JobOfferFullDescriptionIddireccion {
  id: string;
  pais: null;
  piso: null;
  calle: null;
  activo: boolean;
  altura: null;
  ciudad: null;
  latitud: string;
  longitud: string;
  direccion: string;
}

export interface Idempresa {
  nombre: string;
  iddireccion: null;
}

export interface Idmodalidad {
  id: number;
  nombre: string;
}

export interface Idpublicacion {
  idusuario: Idusuario;
  fechacreacion: Date;
}

export interface Idusuario {
  nombre: string;
  apellido: string;
  fotoperfil: null;
  iddireccion: IdusuarioIddireccion;
  rol: string;
}

export interface IdusuarioIddireccion {
  pais: string;
  ciudad: string;
  direccion: null;
}

export interface Skill {
  idskill: Idarea;
}
