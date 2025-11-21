import * as Yup from 'yup';

export const perfilValidacionSchema= Yup.object().shape({
  nombre: Yup.string().required('El nombre es requerido'),
  apellido: Yup.string().required('El apellido es requerido'),
  email: Yup.string()
    .email('Correo electrónico invalido')
    .required('El correo electrónico es requerido'),
  redes: Yup.array().of(
    Yup.object().shape({
      tipo: Yup.string().required(),
      url: Yup.string().url('URL inválida').required('La URL es requerida')
    })
  ),
  areaSeleccionada: Yup.string().required('El área de interes es requerida'),
  uri_temporal_seguridad: Yup.string().notRequired().nullable(),
});

export const reclutadorValidacionSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es requerido'),
  apellido: Yup.string().required('El apellido es requerido'),
  profesion: Yup.string().required('La profesión es requerida'),
  institucion: Yup.string().required('La institución es requerida'),
  localizacion: Yup.string().required('La localización es requerida'),
  uri_temporal_seguridad: Yup.string().notRequired().nullable(),
});