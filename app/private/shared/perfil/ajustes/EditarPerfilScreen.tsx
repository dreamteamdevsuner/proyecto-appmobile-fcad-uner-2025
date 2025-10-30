import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Text,
} from 'react-native';
import { Button, Dialog, Portal, ActivityIndicator } from 'react-native-paper';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import { useAuth, Role } from '../../../../../appContext/authContext';
import { supabase } from "../../../../../supabase/supabaseClient";

import FormularioCandidato from '../ajustes/componentesFormularios/formulariosUser/FormCandidato';
import FormularioReclutador from '../ajustes/componentesFormularios/formulariosUser/FormReclutador';

import {
  CandidatoValues,
  ReclutadorValues,
} from '../../../../../interfaces/EditarPerfil';
import {
  cargarListasParaFormularios,
  cargarDatosInicialesPerfil,
  guardarPerfilProfesional,
  guardarPerfilReclutador,
  DropdownItem,
} from '../../../../../services/perfilService';
import {
  perfilValidacionSchema,
  reclutadorValidacionSchema,
} from './validacion';

const EditarPerfilScreen = () => {
  const navigation = useNavigation();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMessage, setDialogMessage] = useState({ message: '', type: '' });
  const scrollRef = useRef<ScrollView>(null);
  const fieldPositions = useRef<{ [key: string]: number }>({});
  const { state } = useAuth();
  const esReclutador = state.user?.role === Role.recruiter;

  const [initialData, setInitialData] = useState<
    CandidatoValues | ReclutadorValues | null
  >(null);
  const [listasDropdown, setListasDropdown] = useState<{
    herramientas: DropdownItem[];
    habilidades: DropdownItem[];
    idiomas: DropdownItem[];
    listasTiposEnlace: DropdownItem[];
    modalidades: DropdownItem[];
    tiposJornada: DropdownItem[];
    tiposContratacion: DropdownItem[];
    niveles: DropdownItem[];
  }>({
    herramientas: [],
    habilidades: [],
    idiomas: [],
    listasTiposEnlace: [],
    modalidades: [],
    tiposJornada: [],
    tiposContratacion: [],
    niveles: [],
  });

  useEffect(() => {
    const cargarDatos = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        console.error('Error de autenticación:', authError);
        setDialogMessage({
          message: 'Error de autenticación. Intenta recargar.',
          type: 'error',
        });
        setDialogVisible(true);
        return;
      }
      const userId = user.id;
      const tipo = esReclutador ? 'reclutador' : 'profesional';

      try {
        const [listas, datosGuardados] = await Promise.all([
          cargarListasParaFormularios(),
          cargarDatosInicialesPerfil(userId, tipo),
        ]);

        setListasDropdown(listas);
        setInitialData(datosGuardados);
      } catch (error) {
        console.error('Error cargando datos:', error);
        setDialogMessage({
          message: 'Error al cargar tus datos',
          type: 'error',
        });
        setDialogVisible(true);
      }
    };
    cargarDatos();
  }, [esReclutador]);

  const validationSchema = esReclutador
    ? reclutadorValidacionSchema
    : perfilValidacionSchema;

  const handleSubmit = async (
    values: CandidatoValues | ReclutadorValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    const userId = String(state.user?.id);
    if (!userId || userId === 'undefined') {
      setDialogMessage({
        message: 'Error: Usuario no autenticado',
        type: 'error',
      });
      setDialogVisible(true);
      setSubmitting(false);
      return;
    }
    try {
      let resultado;
      if (esReclutador) {
        resultado = await guardarPerfilReclutador(
          values as ReclutadorValues,
          userId,
        );
      } else {
        resultado = await guardarPerfilProfesional(
          values as CandidatoValues,
          userId,
        );
      }

      if (resultado.success) {
        setDialogMessage({
          message: 'Perfil actualizado correctamente',
          type: 'success',
        });
      } else {
        throw new Error(resultado.error || 'Error desconocido');
      }
    } catch (error) {
      console.log('Error:', error);
      setDialogMessage({
        message: (error as Error).message || 'Error al actualizar el perfil',
        type: 'error',
      });
    } finally {
      setDialogVisible(true);
      setSubmitting(false);
    }
  };

  if (!initialData) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator animating={true} size="large" />
        <Text style={{ marginTop: 10, color: 'white' }}>
          Cargando perfil...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 40}
        enabled
      >
        <ScrollView contentContainerStyle={{ padding: 20 }} ref={scrollRef}>
          <View style={styles.formContainer}>
            {esReclutador ? (
              <Formik
                initialValues={initialData as ReclutadorValues}
                validationSchema={reclutadorValidacionSchema}
                onSubmit={handleSubmit as any}
                enableReinitialize
              >
                {(formik) => (
                  <>
                    <FormularioReclutador
                      formik={formik}
                      fieldPositions={fieldPositions}
                    />
                    <Button
                      onPress={() => {
                        formik.validateForm().then((errors) => {
                          if (Object.keys(errors).length > 0) {
                            const firstErrorField = Object.keys(errors)[0];
                            const yPosition =
                              fieldPositions.current[firstErrorField];
                            if (yPosition !== undefined) {
                              scrollRef.current?.scrollTo({
                                y: yPosition,
                                animated: true,
                              });
                            }
                          } else {
                            formik.handleSubmit();
                          }
                        });
                      }}
                      mode="contained"
                      style={styles.boton}
                      disabled={formik.isSubmitting}
                      loading={formik.isSubmitting}
                    >
                      {formik.isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                    </Button>
                  </>
                )}
              </Formik>
            ) : (
              <Formik
                initialValues={initialData as CandidatoValues}
                validationSchema={perfilValidacionSchema}
                onSubmit={handleSubmit as any}
                enableReinitialize
              >
                {(formik) => (
                  <>
                    <FormularioCandidato
                      formik={formik}
                      fieldPositions={fieldPositions}
                      listasSkills={{
                        herramientas: listasDropdown.herramientas,
                        habilidades: listasDropdown.habilidades,
                        idiomas: listasDropdown.idiomas,
                      }}
                      listasTiposEnlace={listasDropdown.listasTiposEnlace}
                      listasModalidades={listasDropdown.modalidades}
                      listasTiposJornada={listasDropdown.tiposJornada}
                      listasTiposContratacion={listasDropdown.tiposContratacion}
                      listasNiveles={listasDropdown.niveles}
                    />
                    <Button
                      onPress={async () => {
                        formik.validateForm().then((errors) => {
                          if (Object.keys(errors).length > 0) {
                            const firstErrorField = Object.keys(errors)[0];
                            const yPositions =
                              fieldPositions.current[firstErrorField];
                            if (yPositions !== undefined) {
                              scrollRef.current?.scrollTo({
                                y: yPositions,
                                animated: true,
                              });
                            }
                          } else {
                            formik.handleSubmit();
                          }
                        });
                      }}
                      mode="contained"
                      style={styles.boton}
                      disabled={formik.isSubmitting}
                      loading={formik.isSubmitting}
                    >
                      {formik.isSubmitting ? 'Guardando...' : 'Guardar cambios'}
                    </Button>
                  </>
                )}
              </Formik>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Icon
            icon={
              dialogMessage.type === 'success' ? 'check-circle' : 'alert-circle'
            }
            size={40}
            color={dialogMessage.type === 'success' ? '#789a78' : '#ff9b92'}
          />
          <Dialog.Title style={styles.dialogTitle}>
            {dialogMessage.message}
          </Dialog.Title>
          <Dialog.Actions>
            <Button
              mode="contained"
              onPress={() => {
                setDialogVisible(false);
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
    backgroundColor: '#121212',
  },
  formContainer: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 80,
    borderWidth: 1,
    borderColor: '#BEB52C',
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
    color: 'white',
  },
  boton: {
    marginTop: 20,
    backgroundColor: '#BEB52C',
    marginBottom: 20,
  },
});

export default EditarPerfilScreen;
