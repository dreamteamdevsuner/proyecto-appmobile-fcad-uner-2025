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
  )
});