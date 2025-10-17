import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { FormikProps } from 'formik';
import FormField from '../FormField';
import FormDropdown from '../FormDropdown';
import { PAISES_LIST } from '../../../../constants/GenericList';
import { ReclutadorValues } from '../../../../../../../interfaces/EditarPerfil';

const SectionTitle = ({ children }: { children: string }) => (
  <Text style={styles.sectionTitle}>{children}</Text>
);

interface Props {
  formik: FormikProps<ReclutadorValues>;
  fieldPositions: React.MutableRefObject<{ [ key: string]: number }>;
}

const FormularioReclutador = ({ formik, fieldPositions }: Props) => {
  return (
    <>
      <SectionTitle>Datos personales</SectionTitle>

      <Text style={styles.titulo}>Nombre</Text>
      <FormField name="nombre" formik={formik} placeholder="Ingresá tu nombre"
        onLayout={(event) => {
          fieldPositions.current['nombre'] = event.nativeEvent.layout.y;
        }} />

      <Text style={styles.titulo}>Apellido</Text>
      <FormField name="apellido" formik={formik} placeholder="Ingresá tu apellido"
      onLayout={(event) => {
          fieldPositions.current['apellido'] = event.nativeEvent.layout.y;
        }} />

      <Text style={styles.titulo}>Profesión</Text>
      <FormDropdown
        name="profesion"
        formik={formik}
        items={[{ label: 'Talent Acquisition', value: 'talent-acquisition' }]}
        placeholder="Selecciona profesión"
        onLayout={(event) => {
          fieldPositions.current['prefesion'] = event.nativeEvent.layout.y;
        }}
      />

      <Text style={styles.titulo}>Institución para la que trabaja:</Text>
      <FormField
        name="institucion"
        formik={formik}
        placeholder="Nombre de la empresa"
        onLayout={(event) => {
          fieldPositions.current['institucion'] = event.nativeEvent.layout.y;
        }}
      />

      <Text style={styles.titulo}>Localización</Text>
      <FormDropdown
        name="localizacion"
        formik={formik}
        items={PAISES_LIST}
        placeholder="Selecciona ubicación"
      />

      <Text style={styles.titulo}>Palabras clave:</Text>
      <FormDropdown
        name="palabrasClave"
        formik={formik}
        items={[{ label: 'Empleabilidad', value: 'empleabilidad' }]}
        placeholder="Selecciona palabras clave"
        multiple={true}
      />
    </>
  );
};

const styles = StyleSheet.create({
  titulo: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 5,
    marginTop: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 20,
    marginBottom: 5,
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
});

export default FormularioReclutador;