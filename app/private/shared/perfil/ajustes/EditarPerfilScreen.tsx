import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text as RNText,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { TextInput, Button, Text, Dialog, Portal } from 'react-native-paper';
import { Formik } from 'formik';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';

import { PerfilValues } from '../../../../../interfaces/EditarPerfil';
import { userEditarPerfil } from '../../../../../mockup/userEditarPerfil';
import { perfilValidacionSchema } from './validacion';
import {
  PAISES_LIST,
  HERRAMIENTAS_LIST,
  HABILIDADES_LIST,
  IDIOMAS_LIST,
  MODALIDADES_LIST,
  JORNADAS_LIST,
  CONTRATOS_LIST,
  REDES_LIST,
} from '../../constants/GenericList';


const getUserData = () => {
  const userData = userEditarPerfil.find(user => user.id === 222);
  if (!userData) return null;
  
  return {
    nombre: userData.nombre,
    apellido: userData.apellido,
    profesion: userData.profesion,
    localizacion: userData.localizacion.toLowerCase(),
    herramientas: userData.herramientas,
    habilidades: userData.habilidades,
    aboutMe: userData.aboutMe,
    estudiosFormales: userData.estudiosFormales,
    otrosEstudios: userData.otrosEstudios,
    idiomasSeleccionados: userData.idiomas,
    modalidadSeleccionada: userData.modalidad,
    jornadaSeleccionada: userData.jornada,
    contratoSeleccionado: userData.contrato,
    email: userData.email,
    redes: userData.redes,
  };
};

const SectionTitle = ({ children }: { children: string }) => (
  <Text style={styles.sectionTitle}>{children}</Text>
);

const EditarPerfilScreen = () => {
  const navigation = useNavigation();

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState({ title: '', message: '', type: '' });
  const userData = getUserData();

  const handleSubmit = async(values: PerfilValues, { setSubmitting }: any) => {
    try {
      console.log('Datos a guardar: ', values);
      // console.log('Perfil actualizado:', values);
      await new Promise(resolve => setTimeout(resolve, 1000));
    setDialogMessage({
      title: '',
      message: 'Perfil actualizado correctamente',
      type: 'success'
    });
  } catch (error) {
    console.log('Error:', error);
    setDialogMessage({
      title: '',
      message: 'Error al actualizar el perfil',
      type: 'error'
    });
    } finally {
      setDialogVisible(true);
      setSubmitting(false);
    }
  };

  if (!userData) {
    return <Text>Error al cargar los datos del usuario</Text>;
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 40}
        enabled
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <Formik initialValues={userData} validationSchema={perfilValidacionSchema} 
                       onSubmit={handleSubmit} enableReinitialize>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              setFieldValue,
              errors,
              touched,
              isSubmitting
            }) => (
              <View style={styles.formContainer}>
                {/* DATOS PERSONALES */}
                <SectionTitle>Datos Personales</SectionTitle>
                <Text style={styles.titulo}>Nombre</Text>
                <TextInput
                  mode="outlined"
                  onChangeText={handleChange('nombre')}
                  onBlur={handleBlur('nombre')}
                  value={values.nombre}
                  placeholder="Ingresá tu nombre"
                  style={styles.input}
                  theme={{ roundness: 30 }}
                />

                <Text style={styles.titulo}>Apellido</Text>
                <TextInput
                  mode="outlined"
                  onChangeText={handleChange('apellido')}
                  onBlur={handleBlur('apellido')}
                  value={values.apellido}
                  placeholder="Ingresá tu apellido"
                  style={styles.input}
                  theme={{ roundness: 30 }}
                />

                <Text style={styles.titulo}>Profesión</Text>
                <TextInput
                  mode="outlined"
                  onChangeText={handleChange('profesion')}
                  onBlur={handleBlur('profesion')}
                  value={values.profesion}
                  placeholder="Ej: Diseñador UX/UI"
                  style={styles.input}
                  theme={{ roundness: 30 }}
                />

                <Text style={styles.titulo}>Localización</Text>
                <DropDownPicker
                  open={openDropdown === 'localizacion'}
                  setOpen={() =>
                    setOpenDropdown(
                      openDropdown === 'localizacion' ? null : 'localizacion',
                    )
                  }
                  value={values.localizacion}
                  setValue={(callback) =>
                    setFieldValue('localizacion', callback(values.localizacion))
                  }
                  items={PAISES_LIST}
                  placeholder="Selecciona ubicación"
                  style={styles.dropdown}
                  zIndex={6000}
                  listMode="SCROLLVIEW"
                />
                
                {/* SOBRE MÍ */}
                <Text style={styles.titulo}>Sobre mí</Text>
                <TextInput
                  mode="outlined"
                  style={styles.input}
                  onChangeText={handleChange('aboutMe')}
                  onBlur={handleBlur('aboutMe')}
                  value={values.aboutMe}
                  placeholder="Cuéntanos sobre ti"
                  multiline
                  textAlignVertical='top'
                  contentStyle={{ paddingHorizontal: 20, paddingVertical: 15, paddingBottom: 15 }}
                  theme={{ roundness: 30 }}
                />

                <SectionTitle>Perfil Profesional</SectionTitle>
                {/* HERRAMIENTAS */}
                <Text style={styles.titulo}>Herramientas</Text>
                <DropDownPicker
                  open={openDropdown === 'herramientas'}
                  setOpen={() =>
                    setOpenDropdown(
                      openDropdown === 'herramientas' ? null : 'herramientas',
                    )
                  }
                  value={values.herramientas}
                  setValue={(callback) =>
                    setFieldValue('herramientas', callback(values.herramientas))
                  }
                  items={HERRAMIENTAS_LIST}
                  placeholder="Selecciona herramientas"
                  style={styles.dropdown}
                  multiple={true}
                  min={1}
                  max={HERRAMIENTAS_LIST.length}
                  mode="BADGE"
                  listMode="SCROLLVIEW"
                  zIndex={5000}
                />

                {/* HABILIDADES */}
                <Text style={styles.titulo}>Habilidades</Text>
                <DropDownPicker
                  open={openDropdown === 'habilidades'}
                  setOpen={() =>
                    setOpenDropdown(
                      openDropdown === 'habilidades' ? null : 'habilidades',
                    )
                  }
                  value={values.habilidades}
                  setValue={(callback) =>
                    setFieldValue('habilidades', callback(values.habilidades))
                  }
                  items={HABILIDADES_LIST}
                  placeholder="Selecciona habilidades"
                  style={styles.dropdown}
                  multiple={true}
                  min={1}
                  max={HABILIDADES_LIST.length}
                  mode="BADGE"
                  listMode="SCROLLVIEW"
                  zIndex={4000}
                />

                <SectionTitle>Formación</SectionTitle>
                {/* ESTUDIOS */}
                <Text style={styles.titulo}>Estudios formales</Text>
                <TextInput
                  mode="outlined"
                  style={styles.input}
                  onChangeText={handleChange('estudiosFormales')}
                  onBlur={handleBlur('estudiosFormales')}
                  value={values.estudiosFormales}
                  placeholder="Descripción"
                  multiline
                  theme={{ roundness: 30 }}
                />

                <Text style={styles.titulo}>Otros estudios</Text>
                <TextInput
                  mode="outlined"
                  style={styles.input}
                  onChangeText={handleChange('otrosEstudios')}
                  onBlur={handleBlur('otrosEstudios')}
                  value={values.otrosEstudios}
                  placeholder="Descripción"
                  multiline
                  theme={{ roundness: 30 }}
                />

                {/* IDIOMAS */}
                <Text style={styles.titulo}>Idiomas</Text>
                <DropDownPicker
                  open={openDropdown === 'idiomas'}
                  setOpen={() =>
                    setOpenDropdown(
                      openDropdown === 'idiomas' ? null : 'idiomas',
                    )
                  }
                  value={values.idiomasSeleccionados}
                  setValue={(callback) =>
                    setFieldValue(
                      'idiomasSeleccionados',
                      callback(values.idiomasSeleccionados),
                    )
                  }
                  items={IDIOMAS_LIST}
                  placeholder="Selecciona tu nivel de idiomas"
                  style={styles.dropdown}
                  multiple={true}
                  min={1}
                  max={IDIOMAS_LIST.length}
                  mode="BADGE"
                  listMode="SCROLLVIEW"
                  zIndex={3000}
                />

                <SectionTitle>Mis preferencias</SectionTitle>
                {/* PREFERENCIAS SEPARADAS */}
                <Text style={styles.titulo}>Modalidad</Text>
                <DropDownPicker
                  open={openDropdown === 'modalidad'}
                  setOpen={() =>
                    setOpenDropdown(
                      openDropdown === 'modalidad' ? null : 'modalidad',
                    )
                  }
                  value={values.modalidadSeleccionada}
                  setValue={(callback) =>
                    setFieldValue(
                      'modalidadSeleccionada',
                      callback(values.modalidadSeleccionada),
                    )
                  }
                  items={MODALIDADES_LIST}
                  placeholder="Selecciona modalidad"
                  style={styles.dropdown}
                  zIndex={2000}
                  listMode="SCROLLVIEW"
                />

                <Text style={styles.titulo}>Jornada</Text>
                <DropDownPicker
                  open={openDropdown === 'jornada'}
                  setOpen={() =>
                    setOpenDropdown(
                      openDropdown === 'jornada' ? null : 'jornada',
                    )
                  }
                  value={values.jornadaSeleccionada}
                  setValue={(callback) =>
                    setFieldValue(
                      'jornadaSeleccionada',
                      callback(values.jornadaSeleccionada),
                    )
                  }
                  items={JORNADAS_LIST}
                  placeholder="Selecciona jornada"
                  style={styles.dropdown}
                  zIndex={1900}
                  listMode="SCROLLVIEW"
                />

                <Text style={styles.titulo}>Contrato</Text>
                <DropDownPicker
                  open={openDropdown === 'contrato'}
                  setOpen={() =>
                    setOpenDropdown(
                      openDropdown === 'contrato' ? null : 'contrato',
                    )
                  }
                  value={values.contratoSeleccionado}
                  setValue={(callback) =>
                    setFieldValue(
                      'contratoSeleccionado',
                      callback(values.contratoSeleccionado),
                    )
                  }
                  items={CONTRATOS_LIST}
                  placeholder="Selecciona contrato"
                  style={styles.dropdown}
                  zIndex={1800}
                  listMode="SCROLLVIEW"
                />

                <SectionTitle>Contactos</SectionTitle>       
                {/* CONTACTO */}
                <Text style={styles.titulo}>Correo electrónico</Text>
                <TextInput
                  mode="outlined"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  placeholder="Escribe tu correo aquí"
                  style={[styles.input, touched.email && errors.email && styles.inputError]}
                  theme={{ roundness: 30 }}
                  keyboardType="email-address"
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                {/* REDES */}
                <Text style={styles.titulo}>Redes</Text>
                <DropDownPicker
                  open={openDropdown === 'redes'}
                  setOpen={() =>
                    setOpenDropdown(openDropdown === 'redes' ? null : 'redes')
                  }
                  value={null}
                  setValue={() => {}}
                  items={REDES_LIST}
                  placeholder="Selecciona una red para agregar"
                  style={styles.dropdown}
                  listMode="SCROLLVIEW"
                  zIndex={1700}
                  onSelectItem={(item) => {
                    if (item) {
                      const nuevasRedes = [...values.redes];
                      if(!nuevasRedes.find((r) => r.tipo === item.value)) {
                      setFieldValue('redes', [
                        ...nuevasRedes,
                        { tipo: item.value, url: '' },
                      ]);
                    }
                  }
                }}
                />

                {values.redes.length > 0 && (
                  <View style={styles.redesContainer}>
                    {values.redes.map((red, idx) => (
                      <View key={`${red.tipo}_${idx}`} style={styles.redItem}>
                        <TextInput
                          mode="outlined"
                          label={red.tipo}
                          value={red.url}
                          placeholder={`Añade la URL de ${red.tipo} aquí...`}
                          onChangeText={(text) => {
                            const nuevasRedes = [...values.redes];
                            nuevasRedes[idx] = {...red, url: text};
                            setFieldValue('redes', nuevasRedes);
                          }}
                          theme={{ roundness: 30 }}
                        />
                        <TouchableOpacity
                          onPress={() => {
                            const nuevasRedes = values.redes.filter((_, i) => i !== idx);
                            setFieldValue('redes', nuevasRedes);
                          }}                        
                          style={styles.removeButton}
                        >
                          <Text style={styles.removeButtonText}>Quitar</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
                <Button
                  onPressIn={() => handleSubmit()}
                  mode="contained"
                  style={styles.boton}
                  disabled={isSubmitting}
                  loading={isSubmitting}
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
      <Portal>
        <Dialog 
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Icon 
            icon={dialogMessage.type === 'success' ? 'check-circle' : 'alert-circle'} 
            size={40} 
            color={dialogMessage.type === 'success' ? '#3ea83e' : '#B22222'}
          />
          <Dialog.Title style={styles.dialogTitle}>
            {dialogMessage.message}
          </Dialog.Title>
          <Dialog.Actions>
            <Button 
              mode="text"
              onPress={() => { setDialogVisible(false);
                if (dialogMessage.type === 'success') {
                  navigation.goBack();
                }
              }}
              textColor={dialogMessage.type === 'success' ? '#228B22' : '#B22222'}
            >
              Aceptar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  formContainer: {
    margin: 10,
    padding: 10,
    borderRadius: 20,
    paddingVertical: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#4b4a4aff',
},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    marginBottom: 10,
  },
  inputError: {
    borderColor: '#B22222',
    borderWidth: 0.5,
  },
  errorText: {
    color: '#B22222',
    fontSize: 12,
    marginLeft: 15,
    marginTop: -5,
    marginBottom: 10,
  },
  dropdown: {
    borderRadius: 30,
  },
  boton: {
    marginTop: 20,
    backgroundColor: '#000',
    marginBottom: 20,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
  },
  redesContainer: {
    margin: 10,
  },
  redItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 15,  
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
   removeButton: {
    borderRadius: 20,
    backgroundColor: '#b58df1',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    padding: 8,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dialog: {
  backgroundColor: 'white',
  borderRadius: 30,
  alignItems: 'center',
  padding: 20,
  },
  dialogTitle: {
    textAlign: 'center',
    fontSize: 16,
  },
});



export default EditarPerfilScreen;
