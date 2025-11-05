import { View, StyleSheet, Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import { Button, Text, Portal, Dialog } from 'react-native-paper';
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

const UpdatePasswordScreen = ({ navigation, route }: UpdatePasswordProps) => {
  const [loading, setLoading] = useState(false);
  const emailFromParams = route.params?.email ?? '';

  const [dialog, setDialog] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onOk: () => void;
  }>({
    visible: false,
    title: '',
    message: '',
    onOk: () => {},
  });

  const handleUpdatePassword = async (values: { 
    email: string;
    token: string;
    password: string;
  }) => {
    Keyboard.dismiss();
    setLoading(true);

    const { success, error } = await resetPasswordWithToken(
      values.email,
      values.token,
      values.password
    );
    setLoading(false);
    
    if (error) {
      setDialog({
        visible: true,
        title: 'Error',
        message: 'El código es incorrectos o ha expirado. Por favor, intenta de nuevo.',
        onOk: () => setDialog({ ...dialog, visible: false }), // Solo cerrar
      });
    }

    if (success) {
      setDialog({
        visible: true,
        title: '¡Éxito!',
        message: 'Tu contraseña ha sido actualizada. Ya puedes iniciar sesión.',
        onOk: () => {
          setDialog({ ...dialog, visible: false }); 
          navigation.navigate(PUBLIC_NAVIGATOR_ROUTES.AUTH);
        },
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flexOne}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <Portal>
        <Dialog
          visible={dialog.visible}
          onDismiss={() => setDialog({ ...dialog, visible: false })}
          style={{ borderRadius: 30, backgroundColor: '#1D1C21' }}
        >
          <Dialog.Title>{dialog.title}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{dialog.message}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={dialog.onOk}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Logo />
            <Text variant="titleLarge" style={styles.title}>Crea tu nueva contraseña</Text>
            <Text variant="bodyMedium" style={styles.subtitle}>Revisa tu correo electrónico, copia el código y regresa a crear tu nueva contraseña.</Text>

            <Formik
              initialValues={{
                email: emailFromParams,
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
                    editable={false}
                  />
                  <FormField
                    name="token"
                    formik={formikProps}
                    label="Código recibido"
                    placeholder="Pega el código que recibiste"
                    autoCapitalize="none"
                    keyboardType="number-pad" 
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
    paddingBottom: 40,
  },
  title: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#9d9d9d',
  },
  formContainer: {
    gap: 20,
  },
  button: {
    backgroundColor: '#BEB52C',
  },
});

export default UpdatePasswordScreen;