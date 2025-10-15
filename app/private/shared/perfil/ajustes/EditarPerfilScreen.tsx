import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { TextInput, Button, Text, Dialog, Portal } from 'react-native-paper';
import { Formik } from 'formik';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';

import FormField from './componentesFormularios/FormField';
import FormDropdown from './componentesFormularios/FormDropdown';

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
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState({ title: '', message: '', type: '' });
  const userData = getUserData();

  const handleSubmit = async(values: PerfilValues, { setSubmitting }: any) => {
    try {
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 40}
        enabled
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 20 }}
        >
          <Formik initialValues={userData} validationSchema={perfilValidacionSchema} 
                       onSubmit={handleSubmit} enableReinitialize>
            {(formik) => (
              <View style={styles.formContainer}>
                {/* DATOS PERSONALES */}
                <SectionTitle>Datos Personales</SectionTitle>
                <Text style={styles.titulo}>Nombre</Text>
                <FormField name='nombre' formik={formik} placeholder='Ingresá tu nombre aquí'/>

                <Text style={styles.titulo}>Apellido</Text>
                <FormField name='apellido' formik={formik} placeholder="Ingresá tu apellido aquí"  />

                <Text style={styles.titulo}>Profesión</Text>
                <FormField name='profesion' formik={formik} placeholder="Ej: Diseñador UX/UI" />

                <Text style={styles.titulo}>Localización</Text>
                <FormDropdown name='localizacion' formik={formik} items={PAISES_LIST} 
                  placeholder="Selecciona ubicación" />
                
                {/* SOBRE MÍ */}
                <Text style={styles.titulo}>Sobre mí</Text>
                <FormField name="aboutMe" formik={formik} placeholder="Cuéntanos sobre ti"  multiline />

                <SectionTitle>Perfil Profesional</SectionTitle>
                {/* HERRAMIENTAS */}
                <Text style={styles.titulo}>Herramientas</Text>
                <FormDropdown name='herramientas' formik={formik} items={HERRAMIENTAS_LIST}
                  placeholder="Selecciona herramientas" multiple />

                {/* HABILIDADES */}
                <Text style={styles.titulo}>Habilidades</Text>
                <FormDropdown name='habilidades' formik={formik} items={HABILIDADES_LIST}
                  placeholder="Selecciona habilidades" multiple />

                <SectionTitle>Formación</SectionTitle>
                {/* ESTUDIOS */}
                <Text style={styles.titulo}>Estudios formales</Text>
                <FormField name='estudiosFormales' formik={formik} placeholder="Descripción estudios formales" multiline />

                <Text style={styles.titulo}>Otros estudios</Text>
                <FormField name='otrosEstudios' formik={formik} placeholder="Descripción otros estudios" multiline />

                {/* IDIOMAS */}
                <Text style={styles.titulo}>Idiomas</Text>
                <FormDropdown name='idiomasSeleccionados' formik={formik} items={IDIOMAS_LIST} 
                  placeholder="Selecciona idiomas" multiple />

                <SectionTitle>Mis preferencias</SectionTitle>
                {/* PREFERENCIAS SEPARADAS */}
                <Text style={styles.titulo}>Modalidad</Text>
                <FormDropdown name='modalidadSeleccionada' formik={formik} items={MODALIDADES_LIST} 
                  placeholder="Selecciona modalidad" />

                <Text style={styles.titulo}>Jornada</Text>
                <FormDropdown name='jornadaSeleccionada' formik={formik} items={JORNADAS_LIST}
                  placeholder="Selecciona jornada" />

                <Text style={styles.titulo}>Contrato</Text>
                <FormDropdown name='contratoSeleccionado' formik={formik} items={CONTRATOS_LIST} 
                  placeholder="Selecciona contrato"/>

                <SectionTitle>Contactos</SectionTitle>       
                {/* CONTACTO */}
                <Text style={styles.titulo}>Correo electrónico</Text>
                <FormField name='email' formik={formik} placeholder="Escribe tu correo aquí" keyboardType="email-address" />
                {formik.touched.email && formik.errors.email && 
                  <Text style={styles.errorText}>{formik.errors.email}</Text>}

                {/* REDES */}
                <Text style={styles.titulo}>Redes</Text>
                <FormDropdown name='redSeleccionada'formik={formik} items={REDES_LIST}
                  placeholder="Selecciona una red social"            
                />

                {formik.values.redes?.length > 0 && (
                  <View style={styles.redesContainer}>
                    {formik.values.redes.map((red, idx) => (
                      <View key={`${red.tipo}_${idx}`} style={styles.redItem}>
                        <TextInput
                          style={{ flex: 1 }}
                          mode="outlined"
                          label={red.tipo}
                          value={red.url}
                          placeholder={`URL de ${red.tipo}`}
                          onChangeText={(text) => {
                            const nuevasRedes = [...formik.values.redes];
                            nuevasRedes[idx] = {...red, url: text};
                            formik.setFieldValue('redes', nuevasRedes);
                          }}
                        />
                        <TouchableOpacity
                          onPress={() => {
                            const nuevasRedes = formik.values.redes.filter((_, i) => i !== idx);
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
                <Button
                  onPress={() => formik.handleSubmit()}
                  mode="contained"
                  style={styles.boton}
                  disabled={formik.isSubmitting}
                  loading={formik.isSubmitting}
                >
                  {formik.isSubmitting ? 'Guardando...' : 'Guardar cambios'}
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
    gap: 10,
  },
  redItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
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