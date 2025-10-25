import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { Formik } from 'formik';
import DropDownPicker from 'react-native-dropdown-picker';
import { UserItem } from '../../../../../types';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ROUTES from '../../navigator/routes';
import * as Yup from 'yup';
import { useInputTheme } from '../../../shared/constants/theme/useInputTheme';
import MapSearch from '@components/mapas/buscador-mapa';

const recruiter: UserItem = {
  id: 1,
  name: 'Renata Scheneider',
  role: 'Talent Acquisition Specialist',
  lugar: 'Córdoba, Argentina',
  avatarUrl:
    'https://www.centralnoticia.cl/wp-content/uploads/2025/07/Bono-mujer-trabajadora-4.jpg',
};

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
  { label: 'Proceso de selección', value: 'proceso de seleccion' },
];

const softSkillsList = [
  { label: 'Trabajo en equipo', value: 'trabajo en equipo' },
  { label: 'Creatividad', value: 'creatividad' },
  { label: 'Organización', value: 'organización' },
];

const hardSkillsList = [
  { label: 'React native', value: 'react native' },
  { label: 'Python', value: 'python' },
  { label: 'Figma', value: 'figma' },
  { label: 'Miro', value: 'miro' },
  { label: 'Ilustrator', value: 'ilustrator' },
  { label: 'Whimsical', value: 'whimsical' },
  { label: 'Expo', value: 'expo' },
];

const idioma = [
  { label: 'Inglés', value: 'Inglés' },
  { label: 'Español', value: 'Español' },
  { label: 'Francés', value: 'Francés' },
  { label: 'Alemán', value: 'Alemán' },
];

const nivel = [
  { label: 'Principiante A1', value: 'A1' },
  { label: 'Elemental A2', value: 'A2' },
  { label: 'Intermedio B1', value: 'B1' },
  { label: 'Intermedio Superior B2', value: 'B2' },
  { label: 'Avanzado C1', value: 'C1' },
  { label: 'Experto C2', value: 'C2' },
  { label: 'Nativo', value: 'Nativo' },
];

const ofertaSchema = Yup.object().shape({
  titulo: Yup.string().required('El título es obligatorio'),
  institucion: Yup.string().required('La institución es obligatoria'),
  localizacion: Yup.string().required('La localización es obligatoria'),
  modalidad: Yup.string().required('La modalidad es obligatoria'),
  jornada: Yup.string().required('La jornada es obligatoria'),
  contrato: Yup.string().required('El contrato es obligatorio'),
  descripcion: Yup.string().required('Acerca del empleo es obligatorio'),
});
interface OfertaValues {
  titulo: string;
  institucion: string;
  localizacion: string;
  lat: number;
  lng: number;
  modalidad: string;
  jornada: string;
  contrato: string;
  descripcion: string;
  beneficios: string;
  salario: string;
  foto: string;
  idiomasNiveles: IdiomaNivel[];
  softSkills: string[];
  hardSkills: string[];
}

type IdiomaNivel = { idioma: string; nivel: string };

const initialValues: OfertaValues = {
  titulo: '',
  institucion: '',
  localizacion: '',
  lat: -34.6037,
  lng: -58.3816,
  modalidad: '',
  jornada: '',
  contrato: '',
  descripcion: '',
  beneficios: '',
  salario: '',
  foto: '',
  idiomasNiveles: [{ idioma: 'Inglés', nivel: 'Avanzado' }],
  softSkills: [],
  hardSkills: [],
};

const CrearOferta = ({ navigation }: any) => {
  const inputTheme = useInputTheme();

  const [localizacionOpen, setLocalizacionOpen] = useState(false);
  const [modalidadOpen, setModalidadOpen] = useState(false);
  const [jornadaOpen, setJornadaOpen] = useState(false);
  const [contratoOpen, setContratoOpen] = useState(false);
  const [softSkillsOpen, setSoftSkillsOpen] = useState(false);
  const [hardSkillsOpen, setHardSkillsOpen] = useState(false);
  const [idiomasOpen, setIdiomasOpen] = useState<boolean[]>([false]);
  const [nivelesOpen, setNivelesOpen] = useState<boolean[]>([false]);

  // const [idiomasNivelesPickers, setIdiomasNivelesPickers] = useState<
  //   IdiomaNivel[]
  // >([{ idioma: '', nivel: '' }]);

  const [formValues, setFormValues] = useState<OfertaValues>({
    ...initialValues,
  });

  const handleSubmit = (values: OfertaValues) => {
    console.log('Oferta enviada:', values);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ marginRight: 20 }}
            onPress={() => {
              navigation.navigate(ROUTES.RECRUITER_CREAR_OFERTA_PREVIEW, {
                data: {
                  ...formValues,
                  recruiter,
                },
              });
            }}
          >
            <Ionicons name="eye" size={24} color="#F1F1F1" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{ marginRight: 12 }}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={24} color="#F1F1F1" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, formValues]);

  const IdiomaNivelPicker = ({
    item,
    index,
  }: {
    item: IdiomaNivel;
    index: number;
  }) => {
    const handleOpenIdiomas: React.Dispatch<React.SetStateAction<boolean>> = (
      value,
    ) => {
      const isOpen =
        typeof value === 'function' ? value(idiomasOpen[index]) : value;
      setIdiomasOpen((prev) => prev.map((v, i) => (i === index ? isOpen : v)));
    };
    const handleOpenNiveles: React.Dispatch<React.SetStateAction<boolean>> = (
      value,
    ) => {
      const isOpen =
        typeof value === 'function' ? value(nivelesOpen[index]) : value;
      setNivelesOpen((prev) => prev.map((v, i) => (i === index ? isOpen : v)));
    };

    // return (
    //   <View>
    //     <DropDownPicker
    //       key={`idioma_${index}`}
    //       open={idiomasOpen[index]}
    //       setOpen={handleOpenIdiomas}
    //       value={formValues.idiomasNiveles[index].idioma}
    //       setValue={(callback) => {
    //         setFormValues((prev) => ({
    //           ...prev,
    //           idiomasNiveles: callback(prev.idiomasNiveles),
    //         }));
    //       }}
    //       items={idioma}
    //       placeholder="Selecciona idioma"
    //       style={styles.dropdown}
    //       zIndex={index === 0 ? 1000 : 0}
    //     />
    //     <DropDownPicker
    //       key={`nivel_${index}`}
    //       open={nivelesOpen[index]}
    //       setOpen={handleOpenNiveles}
    //       value={formValues.idiomasNiveles[index].nivel}
    //       setValue={(callback) => {
    //         setFormValues((prev) => ({
    //           ...prev,
    //           idiomasNiveles: callback(prev.idiomasNiveles),
    //         }));
    //       }}
    //       items={nivel}
    //       placeholder="Selecciona nivel"
    //       style={styles.dropdown}
    //       zIndex={index === 0 ? 900 : 0}
    //     />
    //   </View>
    // );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={ofertaSchema}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
          }) => {
            useEffect(() => {
              setFormValues((prev) => ({
                ...prev,
                ...values,
                softSkills: prev.softSkills,
                hardSkills: prev.hardSkills,
                localizacion: prev.localizacion,
                lat: prev.lat,
                lng: prev.lng,
              }));
            }, [values]);

            return (
              <View style={styles.formContainer}>
                <Text style={styles.titulo}>Título</Text>
                <TextInput
                  mode="outlined"
                  onChangeText={handleChange('titulo')}
                  onBlur={handleBlur('titulo')}
                  value={values.titulo}
                  placeholder="Puesto"
                />
                {errors.titulo && touched.titulo && (
                  <Text style={{ color: 'red', marginBottom: 5 }}>
                    {errors.titulo}
                  </Text>
                )}
                <Text style={styles.titulo}>Institución</Text>
                <TextInput
                  mode="outlined"
                  onChangeText={handleChange('institucion')}
                  onBlur={handleBlur('institucion')}
                  value={values.institucion}
                  placeholder="Empresa"
                />
                {errors.institucion && touched.institucion && (
                  <Text style={{ color: 'red', marginBottom: 5 }}>
                    {errors.institucion}
                  </Text>
                )}
                <Text style={styles.titulo}>Localización</Text>
                {/*
                    <DropDownPicker
                      open={localizacionOpen}
                      setOpen={setLocalizacionOpen}
                      value={values.localizacion}
                      setValue={(callback) => {
                        const newValue = callback(values.localizacion);

                        setFieldValue('localizacion', newValue);

                        const pais = localizacionList.find(
                          (item) => item.value === newValue,
                        );

                        if (pais) {
                          setFieldValue('lat', pais.latitud);
                          setFieldValue('lng', pais.longitud);
                          setPaisSeleccionado(pais);
                          setMarkerCoords({
                            latitude: pais.latitud,
                            longitude: pais.longitud,
                          });
                        }
                      }}
                      items={localizacionList}
                      placeholder="Selecciona ubicación"
                      zIndex={6000}
                      listMode="SCROLLVIEW"
                    />
                    {errors.localizacion && touched.localizacion && (
                      <Text style={{ color: 'red', marginBottom: 5 }}>
                        {errors.localizacion}
                      </Text>
                    )} */}
                <MapSearch
                  value={formValues.localizacion}
                  lat={formValues.lat}
                  lng={formValues.lng}
                  onChange={(text) =>
                    setFormValues((prev) => ({
                      ...prev,
                      localizacion: text,
                    }))
                  }
                  onCoordsChange={(lat, lng) =>
                    setFormValues((prev) => ({ ...prev, lat, lng }))
                  }
                />

                <Text style={styles.titulo}>Modalidad</Text>
                <DropDownPicker
                  open={modalidadOpen}
                  setOpen={setModalidadOpen}
                  theme="DARK"
                  value={values.modalidad}
                  setValue={(callback) =>
                    setFieldValue('modalidad', callback(values.modalidad))
                  }
                  items={modalidadList}
                  placeholder="Selecciona modalidad"
                  zIndex={5000}
                  listMode="SCROLLVIEW"
                />
                {errors.modalidad && touched.modalidad && (
                  <Text style={{ color: 'red', marginBottom: 5 }}>
                    {errors.modalidad}
                  </Text>
                )}
                <Text style={styles.titulo}>Jornada</Text>
                <DropDownPicker
                  open={jornadaOpen}
                  setOpen={setJornadaOpen}
                  theme="DARK"
                  value={values.jornada}
                  setValue={(callback) =>
                    setFieldValue('jornada', callback(values.jornada))
                  }
                  items={jornadaList}
                  placeholder="Selecciona jornada"
                  zIndex={4000}
                  listMode="SCROLLVIEW"
                />
                {errors.jornada && touched.jornada && (
                  <Text style={{ color: 'red', marginBottom: 5 }}>
                    {errors.jornada}
                  </Text>
                )}
                <Text style={styles.titulo}>Contratación</Text>
                <DropDownPicker
                  open={contratoOpen}
                  setOpen={setContratoOpen}
                  theme="DARK"
                  value={values.contrato}
                  setValue={(callback) =>
                    setFieldValue('contrato', callback(values.contrato))
                  }
                  items={contratoList}
                  placeholder="Selecciona contrato"
                  zIndex={3000}
                  listMode="SCROLLVIEW"
                />
                {errors.contrato && touched.contrato && (
                  <Text style={{ color: 'red', marginBottom: 5 }}>
                    {errors.contrato}
                  </Text>
                )}
                <Text style={styles.titulo}>Acerca del empleo</Text>
                <TextInput
                  mode="outlined"
                  onChangeText={handleChange('descripcion')}
                  onBlur={handleBlur('descripcion')}
                  value={values.descripcion}
                  placeholder="Descripción"
                  multiline
                  style={styles.multilineTextInput}
                />
                {errors.descripcion && touched.descripcion && (
                  <Text style={{ color: 'red', marginBottom: 5 }}>
                    {errors.descripcion}
                  </Text>
                )}
                <Text style={styles.titulo}>Soft Skills</Text>
                <DropDownPicker
                  open={softSkillsOpen}
                  setOpen={setSoftSkillsOpen}
                  theme="DARK"
                  value={formValues.softSkills}
                  setValue={(callback) => {
                    setFormValues((prev) => ({
                      ...prev,
                      softSkills: callback(prev.softSkills),
                    }));
                  }}
                  items={softSkillsList}
                  placeholder="Selecciona soft skill"
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
                  theme="DARK"
                  value={formValues.hardSkills}
                  setValue={(callback) => {
                    setFormValues((prev) => ({
                      ...prev,
                      hardSkills: callback(prev.hardSkills),
                    }));
                  }}
                  items={hardSkillsList}
                  placeholder="Selecciona hard skill"
                  zIndex={1000}
                  listMode="MODAL"
                  multiple={true}
                  min={0}
                  max={hardSkillsList.length}
                  mode="BADGE"
                />
                {/* <Text style={styles.titulo}>Idiomas</Text>

                    {formValues.idiomasNiveles?.map((item, index) => {
                      return (
                        <>
                          <IdiomaNivelPicker
                            item={item}
                            index={index}
                          ></IdiomaNivelPicker>
                        </>
                      );
                    })}*/}
                <Text style={styles.titulo}>Beneficios</Text>
                <TextInput
                  mode="outlined"
                  onChangeText={handleChange('beneficios')}
                  onBlur={handleBlur('beneficios')}
                  value={values.beneficios}
                  placeholder="Descripción"
                  multiline
                  style={styles.multilineTextInput}
                />
                <Button
                  onPress={handleSubmit as any}
                  mode="contained"
                  style={styles.boton}
                  icon={() => (
                    <MaterialCommunityIcons
                      name="upload"
                      size={20}
                      color={'black'}
                    />
                  )}
                >
                  Publicar
                </Button>
              </View>
            );
          }}
        </Formik>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  map: {
    flex: 1,
    height: 200,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#3C3C3C',
    borderRadius: 30,
    marginBottom: 12,
    paddingTop: 10,
    paddingHorizontal: 15,
    backgroundColor: '#121212',
    color: '#EAEAEA',
  },
  boton: {
    marginTop: 20,
    backgroundColor: '#BEB52C',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 5,
    marginTop: 20,
  },
  formContainer: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#BEB52C',
  },
  multilineTextInput: {
    paddingVertical: 8,
  },
});

export default CrearOferta;
