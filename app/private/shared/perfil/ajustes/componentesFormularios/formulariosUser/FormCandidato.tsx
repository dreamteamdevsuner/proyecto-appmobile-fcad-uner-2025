import React, { useState} from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, Checkbox, Chip } from 'react-native-paper';
import { FormikProps, FieldArray, FormikErrors, FormikTouched } from 'formik';
import FormField from '../FormField';
import FormDropdown from '../FormDropdown';
import { CandidatoValues } from '../../../../../../../interfaces/EditarPerfil';
import { DropdownItem } from '@services/perfilService';
import { SkillConNivel } from '../../../../../../../interfaces/EditarPerfil';
import MapSearch from '@components/mapas/buscador-mapa';
import NivelModal from '@components/ModalNivel';
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
  listasTiposContratacion: DropdownItem[];
  listasNiveles: DropdownItem[];
}

const FormularioCandidato = ({ formik, 
  fieldPositions, 
  listasSkills, 
  listasTiposEnlace,
  listasModalidades,
  listasTiposJornada,
  listasTiposContratacion,
  listasNiveles
 }: Props) => {

  const [nivelModalVisible, setNivelModalVisible] = useState(false);
  const [skillParaNivel, setSkillParaNivel] = useState<{
    fieldName: 'herramientas' | 'idiomasSeleccionados'; 
    idskill: string;
    label: string;
    nivelActual: string | null | undefined;
  } | null>(null);

  const handleSkillItemSelected = (selectedId: string, fieldName: string): boolean => {
      if (fieldName !== 'herramientas' && fieldName !== 'idiomasSeleccionados') {
        return true;
      }
      
      const fieldValues = formik.values[fieldName] as SkillConNivel[];
      const exists = fieldValues.some(s => s.idskill === selectedId);
      
      if (!exists) { 
          const skillList = fieldName === 'herramientas' ? listasSkills.herramientas : listasSkills.idiomas;
          const skillLabel = skillList.find(item => item.value === selectedId)?.label || selectedId;

          setSkillParaNivel({
            fieldName: fieldName, 
            idskill: selectedId,
            label: skillLabel,
            nivelActual: null 
          });
          setNivelModalVisible(true);
          return false;
      }
      
      const newValues = fieldValues.filter(v => v.idskill !== selectedId);
      formik.setFieldValue(fieldName, newValues);
      return false;
  };
  const handleSaveLevel = (selectedLevelId: string | null) => {
    if (!skillParaNivel) return;

    const { fieldName, idskill } = skillParaNivel;
    const currentValues = formik.values[fieldName] as SkillConNivel[];
    const newValue: SkillConNivel = { idskill: idskill, idnivel: selectedLevelId };
    
    formik.setFieldValue(fieldName, [...currentValues, newValue]);
    setSkillParaNivel(null); 
    setNivelModalVisible(false);
  };

  const removeSkill = (fieldName: 'herramientas' | 'idiomasSeleccionados', idskillToRemove: string) => {
    const currentValues = formik.values[fieldName] as SkillConNivel[];
    const newValues = currentValues.filter(v => v.idskill !== idskillToRemove);
    formik.setFieldValue(fieldName, newValues);
  };

  const getNivelLabel = (idnivel: string | null | undefined): string => {
      if (!idnivel) return '(Sin Nivel)'; 
      return listasNiveles.find(n => n.value === idnivel)?.label || '';
  };

  return (
    <>
      <AvatarPicker 
        currentImageUrl={formik.values.avatar_url}
        onImageSelected={base64 => {
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
        lat={formik.values.lat ? parseFloat(formik.values.lat) : undefined}
        lng={formik.values.lng ? parseFloat(formik.values.lng) : undefined}
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
        isSkill
        onItemSelected={handleSkillItemSelected}
      />
      <View style={styles.chipContainer}>
        {formik.values.herramientas.map(h => {
          const skillLabel = listasSkills.herramientas.find(item => item.value === h.idskill)?.label || h.idskill;
          const nivelLabel = getNivelLabel(h.idnivel);
          return (
            <Chip 
              key={h.idskill} 
              onClose={() => removeSkill('herramientas', h.idskill)}
              style={styles.chip}
            >
              <Text>{skillLabel} - {nivelLabel}</Text>
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
      <FieldArray name='estudios'>
        {(arrayHelpers) => (
          <View>
            {formik.values.estudios && formik.values.estudios.length > 0 ? (
              formik.values.estudios.map((estudio, index) => {
                return (
                  <View key={index} style={styles.estudioContainer}>
                  <Text style={styles.estudioTitulo}>Estudio #{index + 1}</Text>

                  {/*Título del estudio*/}
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

                {/* Checkbox Estudio en curso */}
                  <View style={styles.checkboxContainer}>
                    <Checkbox.Android
                      status={formik.values.estudios[index].activo ? 'checked' : 'unchecked'}
                      onPress={() => formik.setFieldValue(`estudios[${index}].activo`, !formik.values.estudios[index].activo)}
                    />
                    <Text style={{color: 'white'}}>Estudio en curso</Text>
                  </View>

                  {/* Botón Quitar */}
                  <Button
                    mode="outlined"
                    color="#b58df1"
                    onPress={() => arrayHelpers.remove(index)} 
                  >Quitar Estudio</Button>
                </View>
              )
          })                
            ) : (
              <Text style={{ marginVertical: 10, color: 'gray' }}>No has añadido ningún estudio.</Text>
            )}

            {/* Botón Añadir */}
            <Button
              mode="contained"
              style={{ marginTop: 10 }}
              onPress={() => arrayHelpers.push({ 
                titulo: '',
                nombreinstitucion: '',
                fechainicio: '',
                fechafin: '',
                activo: false,
              })}
            >Añadir Estudio</Button>
          </View>
        )}
      </FieldArray>

      <View style={{ height: 20 }} /> {/* Espaciador */}

      <Text style={styles.titulo}>Idiomas</Text>
      <FormDropdown
        name="idiomasSeleccionados"
        formik={formik}
        items={listasSkills.idiomas}
        placeholder="Selecciona idiomas"
        multiple
        isSkill
        onItemSelected={handleSkillItemSelected}
      />
      <View style={styles.chipContainer}>
        {formik.values.idiomasSeleccionados.map(i => {
           const skillLabel = listasSkills.idiomas.find(item => item.value === i.idskill)?.label || i.idskill;
           const nivelLabel = getNivelLabel(i.idnivel);
           return (
            <Chip 
              key={i.idskill} 
              onClose={() => removeSkill('idiomasSeleccionados', i.idskill)}
              style={styles.chip}
            >
              <Text>{skillLabel} - {nivelLabel}</Text>
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

      <Text style={styles.titulo}>Contrato</Text>
      <FormDropdown
        name="contratoSeleccionado"
        formik={formik}
        items={listasTiposContratacion}
        placeholder="Selecciona contrato"
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
                    label={listasTiposEnlace.find(item => item.value === red.tipo)?.label || red.tipo}
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
        {skillParaNivel && (
        <NivelModal
          visible={nivelModalVisible}
          onDismiss={() => {
            setNivelModalVisible(false);
            setSkillParaNivel(null);
          }}
          skillLabel={skillParaNivel.label}
          nivelesDisponibles={listasNiveles}
          nivelActual={skillParaNivel.nivelActual}
          onSaveLevel={handleSaveLevel}
        />
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