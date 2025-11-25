import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { Formik } from 'formik';
import DropDownPicker from 'react-native-dropdown-picker';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ROUTES from '../../navigator/routes';
import * as Yup from 'yup';
import MapSearch from '@components/mapas/buscador-mapa';
import { crearOferta, editarOferta } from '@services/OfertaService';
import { useContext } from 'react';
import { DataContext } from '@providers/DataContext';
import { useAuth } from '@appContext/authContext';
import { OfertaValues, Empresa } from '@models/index';
import { getEmpresas } from '@services/EmpresaService';

const ofertaSchema = Yup.object().shape({
  titulo: Yup.string().required('El título es obligatorio'),
  idinstitucion: Yup.string().required('La institución es obligatoria'),
  localizacion: Yup.string().required('La localización es obligatoria'),
  modalidad: Yup.string().required('La modalidad es obligatoria'),
  jornada: Yup.string().required('La jornada es obligatoria'),
  contrato: Yup.string().required('El contrato es obligatorio'),
  descripcion: Yup.string().required('Acerca del empleo es obligatorio'),
});

const initialValues: OfertaValues = {
  titulo: '',
  institucion: '',
  idinstitucion: null,
  localizacion: '',
  lat: -34.9964963,
  lng: -64.9672817,
  area: null,
  modalidad: null,
  jornada: null,
  contrato: null,
  descripcion: '',
  beneficios: '',
  salario: '',
  foto: '',
  idiomasNiveles: [{ idioma: 'Inglés', nivel: 'Avanzado' }],
  softSkills: [],
  hardSkills: [],
};

const CrearOferta = ({ navigation, editing = false, data = null }: any) => {
  const {
    modalidad: modalidadList,
    tipoJornada: jornadaList,
    contratacion: contratoList,
    softSkills,
    hardSkills,
    areas: areasList,
  } = useContext(DataContext);
  const softSkillsList = softSkills.map((x) => {
    return { label: x.nombre, value: x.id };
  });
  const hardSkillsList = hardSkills.map((x) => {
    return { label: x.nombre, value: x.id };
  });
  const [empresasList, setEmpresasList] = useState<Empresa[]>([]);

  const [empresasOpen, setEmpresasOpen] = useState(false);
  const [areaOpen, setAreaOpen] = useState(false);
  const [modalidadOpen, setModalidadOpen] = useState(false);
  const [jornadaOpen, setJornadaOpen] = useState(false);
  const [contratoOpen, setContratoOpen] = useState(false);
  const [softSkillsOpen, setSoftSkillsOpen] = useState(false);
  const [hardSkillsOpen, setHardSkillsOpen] = useState(false);

  const [hardSkillsValue, setHardSkillsValue] = useState<string[]>([]);
  const [softSkillsValue, setSoftSkillsValue] = useState<string[]>([]);

  const {
    state: { user },
  } = useAuth();
  const formikRef = useRef<any>(null);

  const fetchEmpresas = async () => {
    const res = await getEmpresas();
    setEmpresasList(res);
  };

  const handleSubmit = async (values: OfertaValues) => {
    console.log('VALUES', values);
    try {
      if (user) {
        if (editing) {
          const ofertaEditada = await editarOferta({
            id: data.id,
            titulo: values.titulo,
            descripcion: values.descripcion,
            idusuario: user.id,
            idempresa: values.idinstitucion,
            idmodalidad: values.modalidad,
            idtipojornada: values.jornada,
            idcontratacion: values.contrato,
            idsoftskills: values.softSkills,
            idhardskills: values.hardSkills,
            latitud: values.lat.toString(),
            longitud: values.lng.toString(),
            direccion: values.localizacion,
            iddireccion: data.iddireccion,
            idarea: values.area,
            beneficios: values.beneficios,
          });
          if (ofertaEditada) {
            alert('Oferta editada con éxito 🎉');
            navigation.goBack();
          }
        } else {
          const nuevaOferta = await crearOferta({
            titulo: values.titulo,
            descripcion: values.descripcion,
            idusuario: user.id,
            idempresa: values.idinstitucion,
            idmodalidad: values.modalidad,
            idtipojornada: values.jornada,
            idcontratacion: values.contrato,
            idsoftskills: values.softSkills,
            idhardskills: values.hardSkills,
            latitud: values.lat.toString(),
            longitud: values.lng.toString(),
            direccion: values.localizacion,
            idarea: values.area,
            beneficios: values.beneficios,
          });

          if (nuevaOferta) {
            alert('Oferta publicada con éxito 🎉');
            navigation.goBack();
          }
        }
      }
    } catch (error: any) {
      console.error(error);
      alert('Error al crear la oferta');
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  useEffect(() => {
    if (data) {
      setSoftSkillsValue(data.softSkills || []);
      setHardSkillsValue(data.hardSkills || []);
    }
  }, [data]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ marginRight: 20 }}
            onPress={() => {
              navigation.navigate(ROUTES.RECRUITER_CREAR_OFERTA_PREVIEW, {
                data: {
                  ...formikRef.current?.values,
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
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <Formik
          innerRef={formikRef}
          initialValues={data ? data : initialValues}
          enableReinitialize={true}
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
            return (
              <View style={styles.formContainer}>
                <Text style={styles.titulo}>Título</Text>
                <TextInput
                  mode="outlined"
                  onChangeText={handleChange('titulo')}
                  onBlur={handleBlur('titulo')}
                  value={values.titulo}
                  placeholder="Puesto"
                  style={styles.input}
                />
                {errors.titulo && touched.titulo && (
                  <Text style={{ color: 'red', marginBottom: 5 }}>
                    {errors.titulo}
                  </Text>
                )}
                <Text style={styles.titulo}>Institución</Text>

                <DropDownPicker
                  open={empresasOpen}
                  setOpen={setEmpresasOpen}
                  theme="DARK"
                  value={values.idinstitucion || null}
                  setValue={(callback) =>
                    setFieldValue(
                      'idinstitucion',
                      callback(values.idinstitucion),
                    )
                  }
                  items={[
                    { label: 'Ninguna', value: undefined },
                    ...empresasList.map((x) => ({
                      label: x.nombre,
                      value: x.id,
                    })),
                  ]}
                  placeholder="Selecciona institución"
                  zIndex={6000}
                  listMode="MODAL"
                />
                {/* 
                <TextInput
                  mode="outlined"
                  onChangeText={handleChange('institucion')}
                  onBlur={handleBlur('institucion')}
                  value={values.institucion}
                  placeholder="Empresa"
                  style={styles.input}
                /> */}
                {errors.idinstitucion && touched.idinstitucion && (
                  <Text style={{ color: 'red', marginBottom: 5 }}>
                    {errors.idinstitucion}
                  </Text>
                )}

                <Text style={styles.titulo}>Localización</Text>
                <MapSearch
                  value={values.localizacion}
                  errors={
                    errors.localizacion && touched.localizacion
                      ? errors.localizacion
                      : undefined
                  }
                  lat={values.lat}
                  lng={values.lng}
                  onChange={(text) => setFieldValue('localizacion', text)}
                  onCoordsChange={(lat, lng) => {
                    setFieldValue('lat', lat);
                    setFieldValue('lng', lng);
                  }}
                />

                <Text style={styles.titulo}>Área</Text>

                <DropDownPicker
                  open={areaOpen}
                  setOpen={setAreaOpen}
                  theme="DARK"
                  value={values.area}
                  setValue={(callback) =>
                    setFieldValue('area', callback(values.area))
                  }
                  items={areasList.map((a) => ({
                    label: a.nombre,
                    value: a.id,
                  }))}
                  placeholder="Selecciona área"
                  zIndex={6000}
                  listMode="MODAL"
                />
                {errors.area && touched.area && (
                  <Text style={{ color: 'red', marginBottom: 5 }}>
                    {errors.area}
                  </Text>
                )}

                <Text style={styles.titulo}>Modalidad</Text>

                <DropDownPicker
                  open={modalidadOpen}
                  setOpen={setModalidadOpen}
                  theme="DARK"
                  value={values.modalidad}
                  setValue={(callback) =>
                    setFieldValue('modalidad', callback(values.modalidad))
                  }
                  items={modalidadList.map((m) => ({
                    label: m.nombre,
                    value: m.id,
                  }))}
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
                  items={jornadaList.map((m) => ({
                    label: m.nombre,
                    value: m.id,
                  }))}
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
                  items={contratoList.map((m) => ({
                    label: m.nombre,
                    value: m.id,
                  }))}
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
                  value={softSkillsValue}
                  setValue={(callback) => {
                    setSoftSkillsValue((prev) => {
                      const result = callback(prev);
                      setFieldValue('softSkills', result);
                      return result;
                    });
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
                  value={hardSkillsValue}
                  setValue={(callback) => {
                    setHardSkillsValue((prev) => {
                      const result = callback(prev);
                      setFieldValue('hardSkills', result);
                      return result;
                    });
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
                  onPress={() => {
                    handleSubmit();
                  }}
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
                  {editing ? 'Guardar' : 'Publicar'}
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
    marginBottom: 6,
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
