import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Checkbox, Chip } from 'react-native-paper';
import { FormikProps } from 'formik';
import FormField from '../FormField';
import FormDropdown from '../FormDropdown';
import ArrayEditor from '../ArrayEditor';
import { CandidatoValues } from '../../../../../../../interfaces/EditarPerfil';
import { DropdownItem } from '@services/perfilService';
import MapSearch from '@components/mapas/buscador-mapa';
import AvatarPicker from '@components/ui/AvatarPicker';
import { DatePickerModal } from 'react-native-paper-dates';

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
  listasAreas?: DropdownItem[];
}

const FormularioCandidato = ({
  formik,
  fieldPositions,
  listasSkills,
  listasTiposEnlace,
  listasModalidades,
  listasTiposJornada,
  listasAreas = [],
}: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [fechaActual, setFechaActual] = useState<{
    index: number;
    fieldName: string;
    arrayName: string;
  } | null>(null);

  const abrirCalendario = (
    index: number,
    fieldName: string,
    arrayName: string,
  ) => {
    setFechaActual({ index, fieldName, arrayName });
    setModalVisible(true);
  };

  const onDismiss = () => {
    setModalVisible(false);
    setFechaActual(null);
  };

  const onConfirm = ({ date }: { date: Date | undefined }) => {
    if (date && fechaActual) {
      const { index, fieldName, arrayName } = fechaActual;
      const formattedDate = date.toISOString().split('T')[0];
      formik.setFieldValue(`${arrayName}[${index}].${fieldName}`, formattedDate);
    }
    onDismiss();
  };

  const getFechaDisplay = (fecha: string | null | undefined) => {
    if (!fecha) return null;
    try {
      const [year, month, day] = fecha.split('-');
      return `${day}/${month}/${year}`;
    } catch (e) {
      return fecha;
    }
  };

  const getInitialDateForModal = () => {
    if (!fechaActual) return new Date();
    const { index, fieldName,  arrayName } = fechaActual;
    const arrayData = (formik.values as any)[arrayName];    
    const fecha = arrayData?.[index]?.[fieldName];
    return fecha ? new Date(fecha) : new Date();
  };

  return (
    <>
      <AvatarPicker
        currentImageUrl={formik.values.avatar_url}
        onImageSelected={(base64, uri) => {
          formik.setFieldValue('avatarBase64', base64);
          formik.setFieldValue('uri_temporal_seguridad', uri);
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

      <View style={{ height: 20 }} />
      <Text style={styles.titulo}>Sobre mí</Text>
      <FormField
        name="aboutMe"
        formik={formik}
        placeholder="Cuéntanos sobre ti"
        multiline
      />

      <View style={{ height: 20 }} />
      <SectionTitle>Perfil Profesional</SectionTitle>
      <Text style={styles.titulo}>Herramientas</Text>
      <FormDropdown
        name="herramientas"
        formik={formik}
        items={listasSkills.herramientas}
        placeholder="Selecciona herramientas"
        multiple
        isSkill
      />

      <Text style={styles.titulo}>Habilidades</Text>
      <FormDropdown
        name="habilidades"
        formik={formik}
        items={listasSkills.habilidades}
        placeholder="Selecciona habilidades"
        multiple
        isSkill
      />

      <Text style={styles.titulo}>Idiomas</Text>
      <FormDropdown
        name="idiomasSeleccionados"
        formik={formik}
        items={listasSkills.idiomas}
        placeholder="Selecciona idiomas"
        multiple
        isSkill
      />

      <SectionTitle>Formación</SectionTitle>
        <ArrayEditor
          name="estudios"
          title="Formación"
          itemTitleLabel="Título (Ej: Licenciatura en Diseño)"
          itemSubtitleLabel="Institución"
          fieldMap={{ titulo: 'titulo', subtitulo: 'nombreinstitucion' }}
          formik={formik}
          onOpenCalendar={abrirCalendario}
          getFechaDisplay={getFechaDisplay}
          styles={styles}
        />

      <View style={{ marginTop: 20 }} />
      <SectionTitle>Experiencia Laboral</SectionTitle>
        <ArrayEditor
          name="trabajos" 
          title="Experiencia Laboral"
          itemTitleLabel="Puesto / Posición"
          itemSubtitleLabel="Nombre de la Empresa"
          fieldMap={{ titulo: 'posicion', subtitulo: 'nombreempresa' }}
          formik={formik}
          onOpenCalendar={abrirCalendario}
          getFechaDisplay={getFechaDisplay}
          styles={styles}
        />

      <View style={{ height: 20 }} />
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

      <Text style={styles.titulo}>Ofertas que me interesan</Text>
      <FormDropdown
        name="areaSeleccionada"
        formik={formik}
        items={listasAreas}
        placeholder="Selecciona un área"
        onLayout={(event) => {
          fieldPositions.current['areaSeleccionada'] = event.nativeEvent.layout.y;
        }}
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
        checkAgainstList={formik.values.redes.map((red) => red.tipo)}
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
      <DatePickerModal
        locale="es"
        mode="single"
        visible={modalVisible}
        onConfirm={onConfirm}
        onDismiss={onDismiss}
        date={getInitialDateForModal()}
        saveLabel="Guardar"
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
    color: '#EAEAEA',
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
  datePickerButton: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    borderColor: '#3C3C3C',
    borderWidth: 1,
  },
  datePickerButtonText: {
    color: '#EAEAEA',
    fontSize: 14,
  },
  datePickerButtonTextDisabled: {
    color: '#777',
  },
});

export default FormularioCandidato;
