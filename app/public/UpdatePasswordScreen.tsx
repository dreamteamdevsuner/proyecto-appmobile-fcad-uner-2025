import { View, StyleSheet, Keyboard, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import { Button, Text } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import FormField from '@app/private/shared/perfil/ajustes/componentesFormularios/FormField';
import { resetPasswordWithToken } from '../../services/apiAuth';
import PUBLIC_NAVIGATOR_ROUTES from './PUBLIC_NAVIGATOR_ROUTES';
import Logo from '../../components/Logo';

type UpdatePasswordProps = NativeStackScreenProps<
  Record<string, any>,
  PUBLIC_NAVIGATOR_ROUTES.UPDATE_PASSWORD
>;

const UpdatePasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Email inválido')
    .required('Este campo es obligatorio'),
  token: Yup.string()
    .required('Ingresa el código del email')
    .min(6, 'El código es inválido'), 
  password: Yup.string()
    .min(6, 'Debe tener al menos 6 caracteres')
    .required('Este campo es obligatorio'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña'),
});

const UpdatePasswordScreen = ({ navigation }: UpdatePasswordProps) => {
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (values: { 
    email: string;
    token: string;
    password: string;
  }) => {
    Keyboard.dismiss();
    setLoading(true);

    // Llamamos a la nueva función del servicio apiAuth
    const { success, error } = await resetPasswordWithToken(
      values.email,
      values.token,
      values.password
    );
    setLoading(false);
    
    if (error) {
      Alert.alert(
        'Error',
        'No se pudo actualizar tu contraseña. Por favor, intenta de nuevo.'
      );
    } 
    
    if (success) {
      Alert.alert('¡Éxito!',
        'Tu contraseña ha sido actualizada. Ya puedes iniciar sesión.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate(PUBLIC_NAVIGATOR_ROUTES.AUTH)
          },
        ]
      );
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flexOne}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Logo />
            <Text variant="titleLarge" style={styles.title}>Crea tu nueva contraseña</Text>
            <Text variant="bodyMedium" style={styles.subtitle}>Ingresa una nueva contraseña segura.</Text>

            <Formik
              initialValues={{
                email: '',
                token: '',
                password: '',
                confirmPassword: '',
              }}
              validationSchema={UpdatePasswordSchema}
              onSubmit={handleUpdatePassword}
              validateOnMount
            >
              {(formikProps) => (
                <View style={styles.formContainer}>
                  <FormField
                    name="email"
                    formik={formikProps}
                    label="Tu Email"
                    placeholder="El email con el que te registraste"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  <FormField
                    name="token"
                    formik={formikProps}
                    label="Código del Email"
                    placeholder="Pega el código que recibiste"
                    autoCapitalize="none"
                    keyboardType="number-pad" // O 'default' si tu token tiene letras
                  />
                  <FormField
                    name="password"
                    formik={formikProps}
                    label="Nueva contraseña"
                    placeholder="Escribe tu nueva contraseña"
                    secureTextEntry
                  />
                  <FormField
                    name="confirmPassword"
                    formik={formikProps}
                    label="Confirmar contraseña"
                    placeholder="Vuelve a escribir la contraseña"
                    secureTextEntry
                  />

                  <Button
                    mode="contained"
                    onPress={() => formikProps.handleSubmit()}
                    loading={loading}
                    disabled={loading || !formikProps.isValid}
                    style={[
                      styles.button,
                      { opacity: loading || !formikProps.isValid ? 0.5 : 1 },
                    ]}
                  >
                    <Text style={{ color: '#1D1C21' }}>Actualizar contraseña
                    </Text>
                  </Button>
                </View>
              )}          
            </Formik>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flexOne: {
    flex: 1, 
  },
  scrollContainer: {
    flexGrow: 1, 
    justifyContent: 'flex-start',
  },
  container: {
    flex: 1,
    paddingHorizontal: 60,
    paddingTop: 40,
    justifyContent: 'flex-start',
  },
  title: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  formContainer: {
    gap: 20,
  },
  button: {
    backgroundColor: '#BEB52C',
  },
});

export default UpdatePasswordScreen;