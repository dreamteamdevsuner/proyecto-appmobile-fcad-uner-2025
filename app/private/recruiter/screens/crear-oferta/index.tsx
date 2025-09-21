import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { Formik } from 'formik';
import DropDownPicker from 'react-native-dropdown-picker';
import { UserItem } from '../../../../../types';

interface OfertaValues {
  titulo: string;
  institucion: string;
  localizacion: string;
  modalidad: string;
  jornada: string;
  contrato: string;
  descripcion: string;
  beneficios: string;
  salario: string;
  foto: string;
}

const initialValues: OfertaValues = {
  titulo: '',
  institucion: '',
  localizacion: '',
  modalidad: '',
  jornada: '',
  contrato: '',
  descripcion: '',
  beneficios: '',
  salario: '',
  foto: '',
};

const CrearOferta = () => {
  const [localizacionOpen, setLocalizacionOpen] = useState(false);
  const [modalidadOpen, setModalidadOpen] = useState(false);
  const [jornadaOpen, setJornadaOpen] = useState(false);
  const [contratoOpen, setContratoOpen] = useState(false);
  const [softSkillsOpen, setSoftSkillsOpen] = useState(false);
  const [hardSkillsOpen, setHardSkillsOpen] = useState(false);
  const [localSoftSkills, setLocalSoftSkills] = useState<string[]>([]);
  const [localHardSkills, setLocalHardSkills] = useState<string[]>([]);

  const recruiter: UserItem = {
    id: 1,
    name: 'Renata Scheneider',
    role: 'Talent Acquisition Specialist',
    lugar: 'Córdoba, Argentina',
    avatarUrl:
      'https://www.centralnoticia.cl/wp-content/uploads/2025/07/Bono-mujer-trabajadora-4.jpg',
  };
  const localizacionList = [
    { label: 'Argentina', value: 'argentina' },
    { label: 'Chile', value: 'chile' },
    { label: 'Uruguay', value: 'uruguay' },
    { label: 'Estados Unidos', value: 'eeuu' },
  ];
  const modalidadList = [
    { label: 'Remoto', value: 'remoto' },
    { label: 'Presencial', value: 'presencial' },
    { label: 'Híbrido', value: 'hibrido' },
  ];
  const jornadaList = [
    { label: 'Media jornada', value: 'media' },
    { label: 'Jornada completa', value: 'completa' },
    { label: 'Proyecto', value: 'proyecto' },
  ];

  const contratoList = [
    { label: 'Inmediata', value: 'inmediata' },
    { label: 'Proceso de selección', value: 'proceso_seleccion' },
  ];

  const softSkillsList = [
    { label: 'Trabajo en equipo', value: 'trabajo_equipo' },
    { label: 'Proceso de selección', value: 'proceso_seleccion' },
  ];

  const hardSkillsList = [
    { label: 'React native', value: 'react_native' },
    { label: 'Python', value: 'python' },
    { label: 'Figma', value: 'figma' },
    { label: 'Miro', value: 'miro' },
    { label: 'Expo', value: 'expo' },
  ];
  const handleSubmit = (values: OfertaValues) => {
    // Aquí puedes manejar el envío de la oferta (API, etc.)
    console.log(values);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            setFieldValue,
          }) => (
            <View>
              <Text style={styles.titulo}>Título</Text>
              <TextInput
                mode="outlined"
                onChangeText={handleChange('titulo')}
                onBlur={handleBlur('titulo')}
                value={values.titulo}
                placeholder="Puesto"
                style={styles.input}
                theme={{ roundness: 30 }}
              />
              <Text style={styles.titulo}>Institución</Text>
              <TextInput
                mode="outlined"
                onChangeText={handleChange('institucion')}
                onBlur={handleBlur('institucion')}
                value={values.institucion}
                placeholder="Empresa"
                style={styles.input}
                theme={{ roundness: 30 }}
              />
              <Text style={styles.titulo}>Localización</Text>
              <DropDownPicker
                open={localizacionOpen}
                setOpen={setLocalizacionOpen}
                value={values.localizacion}
                setValue={(callback) =>
                  setFieldValue('localizacion', callback(values.localizacion))
                }
                items={localizacionList}
                placeholder="Selecciona ubicación"
                style={styles.dropdown}
                zIndex={6000}
                listMode="SCROLLVIEW"
              />
              <Text style={styles.titulo}>Modalidad</Text>
              <DropDownPicker
                open={modalidadOpen}
                setOpen={setModalidadOpen}
                value={values.modalidad}
                setValue={(callback) =>
                  setFieldValue('modalidad', callback(values.modalidad))
                }
                items={modalidadList}
                placeholder="Selecciona modalidad"
                style={styles.dropdown}
                zIndex={5000}
                listMode="SCROLLVIEW"
              />

              <Text style={styles.titulo}>Jornada</Text>
              <DropDownPicker
                open={jornadaOpen}
                setOpen={setJornadaOpen}
                value={values.jornada}
                setValue={(callback) =>
                  setFieldValue('jornada', callback(values.jornada))
                }
                items={jornadaList}
                placeholder="Selecciona jornada"
                style={styles.dropdown}
                zIndex={4000}
                listMode="SCROLLVIEW"
              />
              <Text style={styles.titulo}>Contrato</Text>
              <DropDownPicker
                open={contratoOpen}
                setOpen={setContratoOpen}
                value={values.contrato}
                setValue={(callback) =>
                  setFieldValue('contrato', callback(values.contrato))
                }
                items={contratoList}
                placeholder="Selecciona contrato"
                style={styles.dropdown}
                zIndex={3000}
                listMode="SCROLLVIEW"
              />

              <Text style={styles.titulo}>Soft Skills</Text>
              <DropDownPicker
                open={softSkillsOpen}
                setOpen={setSoftSkillsOpen}
                value={localSoftSkills}
                setValue={(newValue) => {
                  setLocalSoftSkills(newValue);
                }}
                items={softSkillsList}
                placeholder="Selecciona soft skill"
                style={styles.dropdown}
                zIndex={2000}
                listMode="MODAL"
                multiple={true}
                min={0}
                max={softSkillsList.length}
                mode="BADGE"
              />

              <Text style={styles.titulo}>Hard Skills</Text>
              <DropDownPicker
                open={hardSkillsOpen}
                setOpen={setHardSkillsOpen}
                value={localHardSkills}
                setValue={(newValue) => {
                  setLocalHardSkills(newValue);
                }}
                items={hardSkillsList}
                placeholder="Selecciona hard skill"
                style={styles.dropdown}
                zIndex={1000}
                listMode="MODAL"
                multiple={true}
                min={0}
                max={hardSkillsList.length}
                mode="BADGE"
              />

              <Text style={styles.titulo}>Acerca del empleo</Text>
              <TextInput
                mode="outlined"
                style={styles.input}
                onChangeText={handleChange('descripcion')}
                onBlur={handleBlur('descripcion')}
                value={values.descripcion}
                placeholder="Descripción"
                multiline
                contentStyle={{
                  paddingHorizontal: 20,
                  paddingTop: 15,
                  paddingBottom: 15,
                }}
                theme={{ roundness: 30 }}
              />

              <Text style={styles.titulo}>Beneficios</Text>
              <TextInput
                mode="outlined"
                style={styles.input}
                onChangeText={handleChange('beneficios')}
                onBlur={handleBlur('beneficios')}
                value={values.beneficios}
                placeholder="Descripción"
                multiline
                textAlignVertical="top"
                contentStyle={{
                  paddingHorizontal: 20,
                  paddingTop: 15,
                  paddingBottom: 15,
                }}
                theme={{ roundness: 30 }}
              />

              <Text style={styles.titulo}>Foto</Text>
              <TextInput
                mode="outlined"
                onChangeText={handleChange('foto')}
                onBlur={handleBlur('foto')}
                value={values.foto}
                placeholder="URL de la foto"
                style={styles.input}
                theme={{ roundness: 30 }}
              />
              <Button
                onPress={handleSubmit as any}
                mode="contained"
                style={styles.boton}
              >
                Publicar
              </Button>
            </View>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
  },
  boton: {
    marginTop: 20,
    backgroundColor: '#000000ff',
  },
  dropdown: {
    borderRadius: 30,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
  },
});

export default CrearOferta;
