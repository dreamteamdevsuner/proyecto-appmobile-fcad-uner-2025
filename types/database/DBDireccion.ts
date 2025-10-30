export interface DBDireccion {
  id: string;
  pais: string;
  ciudad: string;
  calle?: string | null;
  altura?: string | null;
  piso?: string | null;
  latitud?: string | null;
  longitud?: string | null;
  activo: boolean;
}