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
import { useInputTheme, useDropdownTheme } from '../../constants/theme/index';

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
  const inputTheme = useInputTheme();
  const dropdownTheme = useDropdownTheme() as any;

  const [openDropdown, setOpenDropdown] = useState<string |null>(null);

  const handleOpen = (key: string) => {
    setOpenDropdown(prev => (prev === key ? null : key));
  };

  const navigation = useNavigation();

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState({ title: '', message: '', type: '' });
  const userData = getUserData();

  const handleSubmit = async(values: PerfilValues, { setSubmitting }: any) => {
    try {
      // console.log('Datos a guardar: ', values);
      console.log('Perfil actualizado:', values);
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
          contentContainerStyle={{ padding: 20 }}
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
                  value={values.nombre}
                  onChangeText={handleChange('nombre')}
                  onBlur={handleBlur('nombre')}
                  theme={inputTheme.theme as any}
                  outlineStyle={inputTheme.outlineStyle}
                  contentStyle={inputTheme.contentStyle}
                />

                <Text style={styles.titulo}>Apellido</Text>
                <TextInput
                  mode="outlined"
                  onChangeText={handleChange('apellido')}
                  onBlur={handleBlur('apellido')}
                  value={values.apellido}
                  placeholder="Ingresá tu apellido"
                  theme={inputTheme.theme}
                  outlineStyle={inputTheme.outlineStyle}
                  contentStyle={inputTheme.contentStyle}
                />

                <Text style={styles.titulo}>Profesión</Text>
                <TextInput
                  mode="outlined"
                  onChangeText={handleChange('profesion')}
                  onBlur={handleBlur('profesion')}
                  value={values.profesion}
                  placeholder="Ej: Diseñador UX/UI"
                  theme={inputTheme.theme}
                  outlineStyle={inputTheme.outlineStyle}
                  contentStyle={inputTheme.contentStyle}
                />

                <Text style={styles.titulo}>Localización</Text>
                <DropDownPicker 
                  {...dropdownTheme}
                  open={openDropdown === 'localizacion'}
                  setOpen={() => handleOpen('localizacion')}
                  value={values.localizacion}
                  setValue={(callback) =>
                    setFieldValue('localizacion', callback(values.localizacion))
                  }
                  items={PAISES_LIST}
                  placeholder="Selecciona ubicación"                  
                  zIndex={6000}
                  listMode="SCROLLVIEW"
                  
                />
                
                {/* SOBRE MÍ */}
                <Text style={styles.titulo}>Sobre mí</Text>
                <TextInput
                  mode="outlined"
                  onChangeText={handleChange('aboutMe')}
                  onBlur={handleBlur('aboutMe')}
                  value={values.aboutMe}
                  placeholder="Cuéntanos sobre ti"
                  multiline
                  theme={inputTheme.theme}
                  outlineStyle={inputTheme.outlineStyle}
                  contentStyle={inputTheme.contentStyle}
                />

                <SectionTitle>Perfil Profesional</SectionTitle>
                {/* HERRAMIENTAS */}
                <Text style={styles.titulo}>Herramientas</Text>
                <DropDownPicker
                  {...dropdownTheme}
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
                  multiple={true}
                  min={1}
                  max={HERRAMIENTAS_LIST.length}
                  mode="BADGE"
                  listMode="SCROLLVIEW"
                  zIndex={5000}
                  {...dropdownTheme}
                />

                {/* HABILIDADES */}
                <Text style={styles.titulo}>Habilidades</Text>
                <DropDownPicker
                  open={openDropdown === 'habilidades'}
                  setOpen={() => handleOpen('habilidades')
                  }
                  value={values.habilidades}
                  setValue={(callback) =>
                    setFieldValue('habilidades', callback(values.habilidades))
                  }
                  items={HABILIDADES_LIST}
                  placeholder="Selecciona habilidades"
                  multiple={true}
                  min={1}
                  max={HABILIDADES_LIST.length}
                  mode="BADGE"
                  listMode="SCROLLVIEW"
                  zIndex={4000}
                  {...dropdownTheme}
                />

                <SectionTitle>Formación</SectionTitle>
                {/* ESTUDIOS */}
                <Text style={styles.titulo}>Estudios formales</Text>
                <TextInput
                  mode="outlined"
                  onChangeText={handleChange('estudiosFormales')}
                  onBlur={handleBlur('estudiosFormales')}
                  value={values.estudiosFormales}
                  placeholder="Descripción"
                  multiline
                  theme={inputTheme.theme}
                  outlineStyle={inputTheme.outlineStyle}
                  contentStyle={inputTheme.contentStyle}
                />

                <Text style={styles.titulo}>Otros estudios</Text>
                <TextInput
                  mode="outlined"
                  onChangeText={handleChange('otrosEstudios')}
                  onBlur={handleBlur('otrosEstudios')}
                  value={values.otrosEstudios}
                  placeholder="Descripción"
                  multiline
                  theme={inputTheme.theme}
                  outlineStyle={inputTheme.outlineStyle}
                  contentStyle={inputTheme.contentStyle}
                />

                {/* IDIOMAS */}
                <Text style={styles.titulo}>Idiomas</Text>
                <DropDownPicker
                  open={openDropdown === 'idiomas'}
                  setOpen={() => handleOpen('idiomas')
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
                  multiple={true}
                  min={1}
                  max={IDIOMAS_LIST.length}
                  mode="BADGE"
                  listMode="SCROLLVIEW"
                  zIndex={3000}
                  {...dropdownTheme}
                />

                <SectionTitle>Mis preferencias</SectionTitle>
                {/* PREFERENCIAS SEPARADAS */}
                <Text style={styles.titulo}>Modalidad</Text>
                <DropDownPicker
                  open={openDropdown === 'modalidad'}
                  setOpen={() => handleOpen('modalidad')
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
                  zIndex={2000}
                  listMode="SCROLLVIEW"
                  {...dropdownTheme}
                />

                <Text style={styles.titulo}>Jornada</Text>
                <DropDownPicker
                  open={openDropdown === 'jornada'}
                  setOpen={() => handleOpen('jornada')
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
                  zIndex={1900}
                  listMode="SCROLLVIEW"
                  {...dropdownTheme}
                />

                <Text style={styles.titulo}>Contrato</Text>
                <DropDownPicker
                  {...dropdownTheme}
                  open={openDropdown === 'contrato'}
                  setOpen={() => handleBlur('contrato')
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
                  theme={inputTheme.theme}
                  outlineStyle={inputTheme.outlineStyle}
                  contentStyle={inputTheme.contentStyle}
                  keyboardType="email-address"
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                {/* REDES */}
                <Text style={styles.titulo}>Redes</Text>
                <DropDownPicker
                  {...dropdownTheme}
                  open={openDropdown === 'redes'}
                  setOpen={() =>
                    setOpenDropdown(openDropdown === 'redes' ? null : 'redes')
                  }
                  value={null}
                  setValue={() => {}}
                  items={REDES_LIST}
                  placeholder="Selecciona una red para agregar"
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
            color={dialogMessage.type === 'success' ? '#489e48' : '#B22222'}
          />
          <Dialog.Title style={styles.dialogTitle}>
            {dialogMessage.message}
          </Dialog.Title>
          <Dialog.Actions>
            <Button 
              mode="contained"
              onPress={() => { setDialogVisible(false);
                if (dialogMessage.type === 'success') {
                  navigation.goBack();
                }
              }}
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
  inputError: {
    borderColor: '#b45252',
  },
  errorText: {
    color: '#b45252',
    fontSize: 12,
    marginLeft: 15,
    marginTop: 2,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 5,
    marginTop: 20,
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
    marginTop: 20,  
    marginBottom: 5,
    borderBottomWidth: 1,
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
    color: 'transparent',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dialog: {
  backgroundColor: '#1D1C21',
  borderRadius: 30,
  alignItems: 'center',
  padding: 20,
  },
  dialogTitle: {
    textAlign: 'center',
    fontSize: 16,
  },
  boton: {
    marginTop: 20,
    backgroundColor: '#BEB52C',
    marginBottom: 20,
  },
});



export default EditarPerfilScreen;
