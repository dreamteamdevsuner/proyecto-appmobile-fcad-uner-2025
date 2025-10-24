import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Text,
} from 'react-native';
import { Button, Dialog, Portal } from 'react-native-paper';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import { useAuth, Role } from '../../../../../appContext/authContext';

import FormularioCandidato from '../ajustes/componentesFormularios/formulariosUser/FormCandidato';
import FormularioReclutador from '../ajustes/componentesFormularios/formulariosUser/FormReclutador';

import {
  CandidatoValues,
  ReclutadorValues,
} from '../../../../../interfaces/EditarPerfil';
import {
  getRecruiterData,
  getCandidateData,
} from '../../../../../mockup/userEditarPerfil';
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

  const initialData = esReclutador ? getRecruiterData() : getCandidateData();
  const validationSchema = esReclutador
    ? reclutadorValidacionSchema
    : perfilValidacionSchema;

  const handleSubmit = async (
    values: CandidatoValues | ReclutadorValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void },
  ) => {
    try {
      console.log('Perfil actualizado:', values);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDialogMessage({
        message: 'Perfil actualizado correctamente',
        type: 'success',
      });
    } catch (error) {
      console.log('Error:', error);
      setDialogMessage({
        message: 'Error al actualizar el perfil',
        type: 'error',
      });
    } finally {
      setDialogVisible(true);
      setSubmitting(false);
    }
  };

  if (!initialData) {
    return (
      <View style={styles.container}>
        <Text>Error al cargar los datos del usuario</Text>
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
                    <FormularioReclutador formik={formik} fieldPositions={fieldPositions}/>
                    <Button
                      onPress={() => {
                        formik.validateForm().then(errors => {
                          if (Object.keys(errors).length > 0) {
                            const firstErrorField = Object.keys(errors)[0];
                            const yPosition = fieldPositions.current[firstErrorField];
                            if (yPosition !== undefined) {
                              scrollRef.current?.scrollTo({ y: yPosition, animated: true});
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
                    <FormularioCandidato formik={formik} fieldPositions={fieldPositions}/>
                    <Button
                      onPress={async () => {
                        formik.validateForm().then(errors => {
                          if (Object.keys(errors).length > 0) {
                            const firstErrorField = Object.keys(errors)[0];
                            const yPositions = fieldPositions.current[firstErrorField];
                            if (yPositions !== undefined) {
                              scrollRef.current?.scrollTo({ y: yPositions, animated: true });
                            }
                          } else {
                            formik.handleSubmit()
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
