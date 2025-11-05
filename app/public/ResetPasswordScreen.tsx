import { View, StyleSheet, Keyboard, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback } from 'react-native';
import React, { useState } from 'react';
import { Button, Text, Portal, Dialog } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import FormField from '@app/private/shared/perfil/ajustes/componentesFormularios/FormField';
import PUBLIC_NAVIGATOR_ROUTES from './PUBLIC_NAVIGATOR_ROUTES';
import Logo from '../../components/Logo';
import { sendPasswordResetEmail } from '@services/apiAuth';

type ResetPasswordProps = NativeStackScreenProps<
  Record<string, any>,
  PUBLIC_NAVIGATOR_ROUTES.RESET_PASSWORD
>;

const ResetSchema = Yup.object().shape({
  email: Yup.string()
    .email('Correo electrónico inválido')
    .required('Este campo es obligatorio'),
});

const ResetPasswordScreen = ({ navigation }: ResetPasswordProps) => {
  const [loading, setLoading] = useState(false);

  const [dialog, setDialog] = useState<{
    visible: boolean;
    title: string;
    message: string;
    onOk: () => void; // Función a ejecutar al presionar OK
  }>({
    visible: false,
    title: '',
    message: '',
    onOk: () => {},
  });

  const handlePasswordReset = async (values: { email: string }) => {
    Keyboard.dismiss();
    setLoading(true);

    const { success, error } = await sendPasswordResetEmail(values.email);

    setLoading(false);
    if (error) {
      setDialog({
        visible: true,
        title: 'Error',
        message: 'No se pudo enviar el correo electrónico. Verifica que sea correcto.',
        onOk: () => setDialog({ ...dialog, visible: false }), 
      });
    } else if (success) {
      setDialog({
        visible: true,
        title: '¡Revisa tu correo electrónico!',
        message: 'Te hemos enviado un token para recuperar tu contraseña.',
        onOk: () => {
          setDialog({ ...dialog, visible: false });
          navigation.navigate(PUBLIC_NAVIGATOR_ROUTES.UPDATE_PASSWORD, {
            email: values.email,
          });
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
            <Text variant="bodyMedium" style={styles.subtitle}>
              Ingresa tu correo electrónico y te enviaremos un token para recuperar tu contraseña.
            </Text>

            <Formik 
              initialValues={{ email: '' }}
              validationSchema={ResetSchema}
              onSubmit={handlePasswordReset}
              validateOnMount
            >
              {(formikProps) => (
                <View style={styles.formContainer}>
                  <FormField 
                    name="email"
                    formik={formikProps}
                    label="Correo electrónico"
                    placeholder="tuemail@ejemplo.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
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
                    <Text style={{ color: '#1D1C21' }}>Enviar link</Text>
                  </Button>
                </View>
              )}
            </Formik>
            <Button
              mode="text"
              onPress={() => navigation.goBack()}
              disabled={loading}
              style={styles.backButton}
              icon="chevron-left"
            >Volver a Inicio de Sesión
            </Button>
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
    paddingBottom: 40,
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
    color: '#9d9d9d',
  },
  formContainer: {
    gap: 20,
  },
  button: {
    backgroundColor: '#BEB52C',
  },
  backButton: {
    marginTop: 20,
  },
});

export default ResetPasswordScreen;