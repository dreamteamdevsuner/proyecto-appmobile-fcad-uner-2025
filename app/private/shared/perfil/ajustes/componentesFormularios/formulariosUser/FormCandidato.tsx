import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Checkbox, Chip } from 'react-native-paper';
import { FormikProps, FieldArray, FormikErrors, FormikTouched } from 'formik';
import FormField from '../FormField';
import FormDropdown from '../FormDropdown';
import { CandidatoValues } from '../../../../../../../interfaces/EditarPerfil';
import { DropdownItem } from '@services/perfilService';
import MapSearch from '@components/mapas/buscador-mapa';
import AvatarPicker from '@components/ui/AvatarPicker';

const SectionTitle = ({ children }: { children: string }) => (
  <Text style={styles.sectionTitle}>{children}</Text>
);

interface Props {
  formik: FormikProps<CandidatoValues>;
  fieldPositions: React.MutableRefObject<{ [key: string]: number }>;
  listasSkills: {
    habilidades: DropdownItem[];
    herramientas: DropdownItem[];
    idiomas: DropdownItem[];
  };
  listasTiposEnlace: DropdownItem[];
  listasModalidades: DropdownItem[];
  listasTiposJornada: DropdownItem[];
}

const FormularioCandidato = ({
  formik,
  fieldPositions,
  listasSkills,
  listasTiposEnlace,
  listasModalidades,
  listasTiposJornada,
}: Props) => {
 
  const removeSkill = (
    fieldName: 'herramientas' | 'idiomasSeleccionados',
    idskillToRemove: string,
  ) => {
    const currentValues = formik.values[fieldName] as string[];
    const newValues = currentValues.filter(
      (v) => v !== idskillToRemove,
    );
    formik.setFieldValue(fieldName, newValues);
  };

  return (
    <>
      <AvatarPicker
        currentImageUrl={formik.values.avatar_url}
        onImageSelected={(base64) => {
          formik.setFieldValue('avatarBase64', base64);
        }}
      />
      <SectionTitle>Datos Personales</SectionTitle>
      <Text style={styles.titulo}>Nombre</Text>
      <FormField
        name="nombre"
        formik={formik}
        placeholder="Ingresá tu nombre aquí"
        onLayout={(event) => {
          fieldPositions.current['nombre'] = event.nativeEvent.layout.y;
        }}
      />
      <Text style={styles.titulo}>Apellido</Text>
      <FormField
        name="apellido"
        formik={formik}
        placeholder="Ingresá tu apellido aquí"
        onLayout={(event) => {
          fieldPositions.current['apellido'] = event.nativeEvent.layout.y;
        }}
      />
      <Text style={styles.titulo}>Profesión</Text>
      <FormField
        name="profesion"
        formik={formik}
        placeholder="Ej: Diseñador UX/UI"
        onLayout={(event) => {
          fieldPositions.current['profesion'] = event.nativeEvent.layout.y;
        }}
      />
      <Text style={styles.titulo}>Localización</Text>
      <MapSearch
        value={formik.values.localizacion}
        errors={
          formik.errors.localizacion && formik.touched.localizacion
            ? formik.errors.localizacion
            : undefined
        }
        onChange={(text) => {
          formik.setFieldValue('localizacion', text);
        }}
        onCoordsChange={(newLat, newLng) => {
          // Actualizar lat y lng en Formik
          formik.setFieldValue('lat', newLat);
          formik.setFieldValue('lng', newLng);
        }}
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
        items={listasSkills.herramientas}
        placeholder="Selecciona herramientas"
        multiple
      />
      <View style={styles.chipContainer}>
        {formik.values.herramientas.map((skillId: string) => {
          const skillLabel =
            listasSkills.herramientas.find((item) => item.value === skillId)
              ?.label || skillId;
          return (
            <Chip
              key={skillId}
              onClose={() => removeSkill('herramientas', skillId)}
              style={styles.chip}
            >
              <Text>{skillLabel}</Text>
            </Chip>
          );
        })}
      </View>
      <Text style={styles.titulo}>Habilidades</Text>
      <FormDropdown
        name="habilidades"
        formik={formik}
        items={listasSkills.habilidades}
        placeholder="Selecciona habilidades"
        multiple
      />
      <SectionTitle>Formación</SectionTitle>
      <FieldArray name="estudios">
        {(arrayHelpers) => (
          <View>
            {formik.values.estudios && formik.values.estudios.length > 0 ? (
              formik.values.estudios.map((estudio, index) => {
                return (
                  <View key={index} style={styles.estudioContainer}>
                    <Text style={styles.estudioTitulo}>
                      Estudio #{index + 1}
                    </Text>
                    <FormField
                      name={`estudios[${index}].titulo`}
                      formik={formik}
                      placeholder="Título (Ej: Licenciatura en Diseño)"
                      style={{ marginBottom: 10 }}
                    />
                    <FormField
                      name={`estudios[${index}].nombreinstitucion`}
                      formik={formik}
                      placeholder="Institución (Ej: UBA)"
                      style={{ marginBottom: 10 }}
                    />

                    <FormField
                      name={`estudios[${index}].fechainicio`}
                      formik={formik}
                      placeholder="Fecha inicio"
                      style={{ marginBottom: 10 }}
                    />

                    <FormField
                      name={`estudios[${index}].fechafin`}
                      formik={formik}
                      placeholder="Fecha Fin"
                      style={{ marginBottom: 10 }}
                    />
                    <View style={styles.checkboxContainer}>
                      <Checkbox.Android
                        status={
                          formik.values.estudios[index].activo
                            ? 'checked'
                            : 'unchecked'
                        }
                        onPress={() =>
                          formik.setFieldValue(
                            `estudios[${index}].activo`,
                            !formik.values.estudios[index].activo,
                          )
                        }
                      />
                      <Text style={{ color: 'white' }}>Estudio en curso</Text>
                    </View>
                    <Button
                      mode="outlined"
                      color="#b58df1"
                      onPress={() => arrayHelpers.remove(index)}
                    >
                      Quitar Estudio
                    </Button>
                  </View>
                );
              })
            ) : (
              <Text style={{ marginVertical: 10, color: 'gray' }}>
                No has añadido ningún estudio.
              </Text>
            )}

            <Button
              mode="contained"
              style={{ marginTop: 10 }}
              onPress={() =>
                arrayHelpers.push({
                  titulo: '',
                  nombreinstitucion: '',
                  fechainicio: '',
                  fechafin: '',
                  activo: false,
                })
              }
            >
              Añadir Estudio
            </Button>
          </View>
        )}
      </FieldArray>
      <View style={{ height: 20 }} />
      <Text style={styles.titulo}>Idiomas</Text>
      <FormDropdown
        name="idiomasSeleccionados"
        formik={formik}
        items={listasSkills.idiomas}
        placeholder="Selecciona idiomas"
        multiple
      />
      <View style={styles.chipContainer}>
        {formik.values.idiomasSeleccionados.map((skillId: string) => {
          const skillLabel =
            listasSkills.idiomas.find((item) => item.value === skillId)
              ?.label || skillId;
          return (
            <Chip
              key={skillId}
              onClose={() => removeSkill('idiomasSeleccionados', skillId)}
              style={styles.chip}
            >
              <Text>{skillLabel}</Text>
            </Chip>
          );
        })}
      </View>
      <SectionTitle>Mis preferencias</SectionTitle>
      <Text style={styles.titulo}>Modalidad</Text>
      <FormDropdown
        name="modalidadSeleccionada"
        formik={formik}
        items={listasModalidades}
        placeholder="Selecciona modalidad"
      />
      <Text style={styles.titulo}>Jornada</Text>
      <FormDropdown
        name="jornadaSeleccionada"
        formik={formik}
        items={listasTiposJornada}
        placeholder="Selecciona jornada"
      />

      <SectionTitle>Contactos</SectionTitle>
      <Text style={styles.titulo}>Correo electrónico</Text>
      <FormField
        name="email"
        formik={formik}
        placeholder="Escribe tu correo aquí"
        keyboardType="email-address"
        onLayout={(event) => {
          fieldPositions.current['email'] = event.nativeEvent.layout.y;
        }}
      />
      <Text style={styles.titulo}>Redes</Text>
      <FormDropdown
        name="redSeleccionada"
        formik={formik}
        items={listasTiposEnlace}
        placeholder="Selecciona una red social"
        onLayout={(event) => {
          fieldPositions.current['redSeleccionada'] =
            event.nativeEvent.layout.y;
        }}
      />
      {formik.values.redes && formik.values.redes.length > 0 && (
        <View style={styles.redesContainer}>
          {formik.values.redes.map((red, idx) => {
            let errorMessage: string | null = null;
            let isFieldTouched = false;

            if (
              Array.isArray(formik.errors.redes) &&
              formik.errors.redes[idx] &&
              typeof formik.errors.redes[idx] === 'object' &&
              'url' in formik.errors.redes[idx]
            ) {
              errorMessage =
                (formik.errors.redes[idx] as { url?: string }).url || null;
            }

            if (
              Array.isArray(formik.touched.redes) &&
              formik.touched.redes[idx] &&
              (formik.touched.redes[idx] as { url?: boolean }).url
            ) {
              isFieldTouched = true;
            }

            const showError = isFieldTouched && errorMessage;

            return (
              <View key={`${red.tipo}_${idx}`}>
                <View style={styles.redItem}>
                  <TextInput
                    style={{ flex: 1 }}
                    mode="outlined"
                    label={
                      listasTiposEnlace.find((item) => item.value === red.tipo)
                        ?.label || red.tipo
                    }
                    value={red.url}
                    onChangeText={formik.handleChange(`redes[${idx}].url`)}
                    onBlur={formik.handleBlur(`redes[${idx}].url`)}
                    error={!!showError}
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
                {showError && (
                  <Text style={styles.errorText}>{errorMessage}</Text>
                )}
              </View>
            );
          })}
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
    marginTop: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginTop: 20,
    marginBottom: 5,
    borderBottomWidth: 1,
    paddingBottom: 5,
    // borderBottomColor: '#BEB52C',
    // color: '#FFF',
  },
  redesContainer: {
    margin: 10,
    gap: 10,
  },
  redItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  errorText: {
    fontSize: 12,
    color: '#FF8A80',
    marginTop: 4,
    marginLeft: 12,
  },
  removeButton: {
    borderRadius: 20,
    backgroundColor: '#b58df1',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  removeButtonText: {
    color: 'transparent',
    fontSize: 12,
    fontWeight: 'bold',
  },
  estudioContainer: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  estudioTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
    marginBottom: 10,
  },
  chip: {
    backgroundColor: '#2C2C2C',
  },
});

export default FormularioCandidato;
