import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  DimensionValue,
} from 'react-native';
import { TextInput, Button, Dialog, Portal, Text } from 'react-native-paper';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';

import { supabase } from '../../../../../supabase/supabaseClient';
import { useAuth } from '@appContext/authContext';

const validationSchema = Yup.object().shape({
  actual: Yup.string().required('La contraseña actual es obligatoria'),
  nueva: Yup.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .matches(/[a-z]/, 'Debe contener al menos una minúscula')
    .matches(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .matches(/[0-9]/, 'Debe contener al menos un número')
    .matches(/[^A-Za-z0-9]/, 'Debe contener al menos un carácter especial'),
  repetir: Yup.string()
    .oneOf([Yup.ref('nueva')], 'Las contraseñas no coinciden')
    .required('Repite la nueva contraseña'),
});

interface FormValues {
  actual: string;
  nueva: string;
  repetir: string;
}

const getPasswordStrength = (password: string) => {
  let score = 0;
  if (!password) {
    return 0;
  }

  if (password.length >= 8) {
    score = 1;

    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
      score = 2;
    }

    if (
      /[0-9]/.test(password) &&
      /[^A-Za-z0-9]/.test(password) &&
      score === 2
    ) {
      score = 3;
    }
  }
  return score;
};

const PasswordStrengthBar = ({ score }: { score: number }) => {
  let label = '';
  let color = 'transparent';
  let widthPercent: DimensionValue = '0%';

  switch (score) {
    case 1:
      label = 'Debil';
      color = '#ff9b92';
      widthPercent = '33%';
      break;
    case 2:
      label = 'Media';
      color = '#f8c38e';
      widthPercent = '66%';
      break;
    case 3:
      label = 'Fuerte';
      color = '#82d182';
      widthPercent = '100%';
      break;
    default:
      return null;
  }

  return (
    <View style={{ marginHorizontal: 30, marginBottom: 10 }}>
      <Text style={{ fontSize: 12, color: color, fontWeight: 'bold' }}>
        Fortaleza: {label}
      </Text>
      <View style={styles.barContainer}>
        <View
          style={{
            height: 6,
            width: widthPercent,
            backgroundColor: color,
            borderRadius: 3,
          }}
        />
      </View>
    </View>
  );
};

export default function CambiarContrasenaScreen() {
  const [dialogVisible, setDialogVisible] = useState(false);
  const navigation = useNavigation();

  const [isActualVisible, setIsActualVisible] = useState(false);
  const [isNuevaVisible, setIsNuevaVisible] = useState(false);
  const [isRepetirVisible, setIsRepetirVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const { state } = useAuth();

  const handlePasswordUpdate = async (
    values: FormValues,
    { resetForm, setFieldError }: FormikHelpers<FormValues>,
  ) => {
    setIsLoading(true);

    const email = state.user?.email;
    if (!email) {
      Alert.alert(
        'Error',
        'No se pudo obtener la información del usuario. Por favor, inicia sesión de nuevo.',
      );
      setIsLoading(false);
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email,
      password: values.actual,
    });

    if (signInError) {
      console.error(
        'Error al verificar contraseña actual: ',
        signInError.message,
      );
      setFieldError('actual', 'La contraseña actual es incorrecta');
      setIsLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: values.nueva,
    });

    setIsLoading(false);

    if (updateError) {
      console.error('Error al actualizar contraseña: ', updateError.message);
      Alert.alert(
        'Error',
        'No se pudo actualizar la contraseña. Intenta de nuevo. Debe tener al mínimo 6 caracteres.',
      );
    } else {
      resetForm();
      setDialogVisible(true);
      console.log('Contraseña actualizada con éxito.');
    }
  };

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
          <Text style={styles.sectionTitle}>Creá una nueva contraseña</Text>
          <Formik
            initialValues={{ actual: '', nueva: '', repetir: '' }}
            validationSchema={validationSchema}
            onSubmit={handlePasswordUpdate}
          >
            {({ handleChange, handleSubmit, values, errors, touched }) => {
              const strengthScore = getPasswordStrength(values.nueva);
              return (
                <View style={styles.formWrapper}>
                  <View>
                    <TextInput
                      label="Contraseña actual"
                      value={values.actual}
                      onChangeText={handleChange('actual')}
                      secureTextEntry={!isActualVisible}
                      style={styles.input}
                      error={touched.actual && !!errors.actual}
                      mode="outlined"
                      right={
                        <TextInput.Icon
                          icon={
                            isActualVisible ? 'eye-off-outline' : 'eye-outline'
                          }
                          onPress={() => setIsActualVisible(!isActualVisible)}
                        />
                      }
                    />
                    {touched.actual && errors.actual && (
                      <Text style={styles.errorText}>{errors.actual}</Text>
                    )}

                    <TextInput
                      label="Nueva contraseña"
                      value={values.nueva}
                      onChangeText={handleChange('nueva')}
                      secureTextEntry={!isNuevaVisible}
                      style={styles.input}
                      error={touched.nueva && !!errors.nueva}
                      mode="outlined"
                      right={
                        <TextInput.Icon
                          icon={
                            isNuevaVisible ? 'eye-off-outline' : 'eye-outline'
                          }
                          onPress={() => setIsNuevaVisible(!isNuevaVisible)}
                        />
                      }
                    />
                    {(touched.nueva || values.nueva.length > 0) && (
                      <PasswordStrengthBar score={strengthScore} />
                    )}
                    {touched.nueva && errors.nueva && (
                      <Text style={styles.errorText}>{errors.nueva}</Text>
                    )}
                    <TextInput
                      label="Repetir nueva contraseña"
                      value={values.repetir}
                      onChangeText={handleChange('repetir')}
                      secureTextEntry={!isRepetirVisible}
                      style={styles.input}
                      error={touched.repetir && !!errors.repetir}
                      mode="outlined"
                      right={
                        <TextInput.Icon
                          icon={
                            isRepetirVisible ? 'eye-off-outline' : 'eye-outline'
                          }
                          onPress={() => setIsRepetirVisible(!isRepetirVisible)}
                        />
                      }
                    />
                    {touched.repetir && errors.repetir && (
                      <Text style={styles.errorText}>{errors.repetir}</Text>
                    )}
                  </View>
                  <Button
                    mode="contained"
                    style={styles.button}
                    onPress={() => handleSubmit()}
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    Guardar contraseña
                  </Button>
                </View>
              );
            }}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={() => setDialogVisible(false)}
          style={{ borderRadius: 20 }}
        >
          <Dialog.Title>Contaseña actualizada</Dialog.Title>
          <Dialog.Content>
            <Text>
              La contraseña de tu cuenta ha sido actualizada correctamente.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              mode="contained"
              onPress={() => {
                setDialogVisible(false);
                navigation.goBack();
              }}
            >
              OK
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  formWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    marginVertical: 20,
    textAlign: 'center',
  },
  input: {
    marginHorizontal: 30,
    marginBottom: 5,
  },
  errorText: {
    fontSize: 12,
    color: '#ff9b92',
    marginHorizontal: 40,
    marginBottom: 10,
  },
  button: {
    marginHorizontal: 20,
    marginVertical: 80,
    backgroundColor: '#BEB52C',
  },
  dialog: {
    borderRadius: 20,
    backgroundColor: '#1D1C21',
  },
  dialogTitle: {
    color: '#EAEAEA',
  },
  dialogContentText: {
    color: '#EAEAEA',
  },
  barContainer: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginTop: 4,
  },
});
