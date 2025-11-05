export interface DBJobPreview {
  id: string;
  idpublicacion: Idpublicacion;
  idempresa: Idempresa;
  titulo: string;
  descripcion: string;
  iddireccion: Iddireccion;
  promocionado: boolean;

  idtipojornada: IdTipoJornada;
  idestadooferta: number;
  idcontratacion: number;
  iddepartamento: null;
  idmodalidad: IdModalidad;
  activo: boolean;
}

export interface Iddireccion {
  ciudad: string;
}

export interface Idempresa {
  nombre: string;
}
export interface IdTipoJornada {
  nombre: string;
}
export interface IdModalidad {
  nombre: string;
}

export interface Idpublicacion {
  idusuario: Idusuario;
  fechacreacion: string;
}

export interface Idusuario {
  nombre: string;
  apellido: string;
  fotoperfil: string;
  rol: string;
  ciudad: string;
}
