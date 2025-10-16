import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { TextInput } from 'react-native-paper';
import { FormikProps } from 'formik';
import FormField from '../FormField';
import FormDropdown from '../FormDropdown';
import { CandidatoValues } from '../../../../../../../interfaces/EditarPerfil';
import {
  PAISES_LIST,
  HERRAMIENTAS_LIST,
  HABILIDADES_LIST,
  IDIOMAS_LIST,
  MODALIDADES_LIST,
  JORNADAS_LIST,
  CONTRATOS_LIST,
  REDES_LIST,
} from '../../../../constants/GenericList';

const SectionTitle = ({ children }: { children: string }) => (
  <Text style={styles.sectionTitle}>{children}</Text>
);

interface Props {
  formik: FormikProps<CandidatoValues>;
}

const FormularioCandidato = ({ formik }: Props) => {
  return (
    <>
      <SectionTitle>Datos Personales</SectionTitle>
      <Text style={styles.titulo}>Nombre</Text>
      <FormField
        name="nombre"
        formik={formik}
        placeholder="Ingresá tu nombre aquí"
      />

      <Text style={styles.titulo}>Apellido</Text>
      <FormField
        name="apellido"
        formik={formik}
        placeholder="Ingresá tu apellido aquí"
      />

      <Text style={styles.titulo}>Profesión</Text>
      <FormField
        name="profesion"
        formik={formik}
        placeholder="Ej: Diseñador UX/UI"
      />

      <Text style={styles.titulo}>Localización</Text>
      <FormDropdown
        name="localizacion"
        formik={formik}
        items={PAISES_LIST}
        placeholder="Selecciona ubicación"
      />

      <Text style={styles.titulo}>Sobre mí</Text>
      <FormField
        name="aboutMe"
        formik={formik}
        placeholder="Cuéntanos sobre ti"
        multiline
      />

      <SectionTitle>Perfil Profesional</SectionTitle>
      <Text style={styles.titulo}>Herramientas</Text>
      <FormDropdown
        name="herramientas"
        formik={formik}
        items={HERRAMIENTAS_LIST}
        placeholder="Selecciona herramientas"
        multiple
      />

      <Text style={styles.titulo}>Habilidades</Text>
      <FormDropdown
        name="habilidades"
        formik={formik}
        items={HABILIDADES_LIST}
        placeholder="Selecciona habilidades"
        multiple
      />

      <SectionTitle>Formación</SectionTitle>
      <Text style={styles.titulo}>Estudios formales</Text>
      <FormField
        name="estudiosFormales"
        formik={formik}
        placeholder="Descripción estudios formales"
        multiline
      />

      <Text style={styles.titulo}>Otros estudios</Text>
      <FormField
        name="otrosEstudios"
        formik={formik}
        placeholder="Descripción otros estudios"
        multiline
      />

      <Text style={styles.titulo}>Idiomas</Text>
      <FormDropdown
        name="idiomasSeleccionados"
        formik={formik}
        items={IDIOMAS_LIST}
        placeholder="Selecciona idiomas"
        multiple
      />

      <SectionTitle>Mis preferencias</SectionTitle>
      <Text style={styles.titulo}>Modalidad</Text>
      <FormDropdown
        name="modalidadSeleccionada"
        formik={formik}
        items={MODALIDADES_LIST}
        placeholder="Selecciona modalidad"
      />

      <Text style={styles.titulo}>Jornada</Text>
      <FormDropdown
        name="jornadaSeleccionada"
        formik={formik}
        items={JORNADAS_LIST}
        placeholder="Selecciona jornada"
      />

      <Text style={styles.titulo}>Contrato</Text>
      <FormDropdown
        name="contratoSeleccionado"
        formik={formik}
        items={CONTRATOS_LIST}
        placeholder="Selecciona contrato"
      />

      <SectionTitle>Contactos</SectionTitle>
      <Text style={styles.titulo}>Correo electrónico</Text>
      <FormField
        name="email"
        formik={formik}
        placeholder="Escribe tu correo aquí"
        keyboardType="email-address"
      />
      {formik.touched.email && formik.errors.email && (
        <Text style={styles.errorText}>{formik.errors.email as string}</Text>
      )}

      <Text style={styles.titulo}>Redes</Text>
      <FormDropdown
        name="redSeleccionada"
        formik={formik}
        items={REDES_LIST}
        placeholder="Selecciona una red social"
      />

      {formik.values.redes && formik.values.redes.length > 0 && (
        <View style={styles.redesContainer}>
          {formik.values.redes.map((red, idx) => (
            <View key={`${red.tipo}_${idx}`} style={styles.redItem}>
              <TextInput
                style={{ flex: 1 }}
                mode="outlined"
                label={red.tipo}
                value={red.url}
                onChangeText={(text) => {
                  const nuevasRedes = [...formik.values.redes];
                  nuevasRedes[idx] = { ...red, url: text };
                  formik.setFieldValue('redes', nuevasRedes);
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  const nuevasRedes = formik.values.redes.filter(
                    (_, i) => i !== idx,
                  );
                  formik.setFieldValue('redes', nuevasRedes);
                }}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>Quitar</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  titulo: { 
    fontSize: 16, 
    fontWeight: '400', 
    marginBottom: 5, 
    marginTop: 20 
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 20,
    marginBottom: 5,
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  errorText: {
    color: '#b45252',
    fontSize: 12,
    marginLeft: 15,
    marginTop: 2,
    marginBottom: 10,
  },
  redesContainer: { 
    margin: 10, gap: 10 
  },
  redItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  removeButton: {
    borderRadius: 20,
    backgroundColor: '#b58df1',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  removeButtonText: { 
    color: 'transparet', 
    fontSize: 12, 
    fontWeight: 'bold' },
});

export default FormularioCandidato;
