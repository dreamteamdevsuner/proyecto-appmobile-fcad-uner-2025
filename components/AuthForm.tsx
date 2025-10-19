import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Icon,
  Portal,
  Snackbar,
  Text,
  TextInput,
} from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../appContext/authContext';
import Logo from '../components/Logo';
import { apiSignIn, LoginUser } from '../services/apiAuth';

interface AppSnackProps {
  visible: boolean;
  handleHideSnackBar: () => void;
}
const AppSnackBar = ({ visible, handleHideSnackBar }: AppSnackProps) => {
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        return handleHideSnackBar();
      }, 2000);
    }
    // CLEAN UP POR SI ACASO
    () => {
      handleHideSnackBar();
    };
  }, [visible]);
  return (
    <Portal>
      <Snackbar
        style={{
          justifyContent: 'center',
          alignContent: 'center',
          display: 'flex',
          backgroundColor: 'red',
        }}
        visible={visible}
        onDismiss={() => handleHideSnackBar()}
      >
        <Text style={{ color: 'white' }}>Login Error</Text>
      </Snackbar>
    </Portal>
  );
};

interface LoginForm {
  email: string;
  password: string;
}
const loginForm: LoginForm = {
  email: '',
  password: '',
};
const formValidationSchema = Yup.object({
  password: Yup.string().required('campo obligatorio'),
  email: Yup.string()
    .email('ingresar un email válido')
    .required('campo obligatorio'),
});
const AuthForm = () => {
  const { state, login } = useAuth();

  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleShowSnackbar = () => {
    setShowSnackbar(true);
  };
  const handleHideSnackbar = () => {
    setShowSnackbar(false);
  };
  useEffect(() => {
    handleShowSnackbar();
  }, []);

  const handleLogin = async (values: LoginUser) => {
    // console.log("handle login");
    console.log('values', values);
    //MOCKUP LOGIN SUCCESS
    // (async () => {
    //   const ok = await login(values.email, values.password);
    //   if (!ok) {
    //     handleShowSnackbar();
    //   }
    // })();
    const s = await apiSignIn(values);
    if (!s) {
      handleShowSnackbar();
    }
  };
  return (
    <>
      <AppSnackBar
        visible={showSnackbar}
        handleHideSnackBar={handleHideSnackbar}
      ></AppSnackBar>
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={30}>
        <Formik
          initialValues={loginForm}
          onSubmit={(values) => handleLogin(values)}
          validationSchema={formValidationSchema}
          validateOnChange={true}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,

            setFieldTouched,
            values,
            errors,
            isValid,
            dirty,
            touched,
            initialTouched,
          }) => (
            <View style={authStyles.container}>
              <TextInput
                onBlur={() => {
                  handleBlur('email');
                  Keyboard.dismiss();
                }}
                autoCapitalize="none"
                label={'Correo electrónico'}
                placeholder="Escribí tu correo electrónico"
                mode="outlined"
                onFocus={() => setFieldTouched('email', true)}
                onChangeText={handleChange('email')}
                value={values.email}
                keyboardType="email-address"
              />
              {touched.email && errors.email && (
                <View style={authStyles.errorView}>
                  <Icon source="alert-circle-outline" size={20} />
                  <Text style={authStyles.errorText}>{errors.email}</Text>
                </View>
              )}
              <TextInput
                onBlur={() => {
                  handleBlur('password');
                  console.log('hiding');
                  Keyboard.dismiss();
                }}
                secureTextEntry={true}
                label={'Contraseña'}
                placeholder="Escribí tu contraseña"
                mode="outlined"
                autoCapitalize="none"
                onChangeText={handleChange('password')}
                onFocus={() => setFieldTouched('password', true)}
                value={values.password}
              />
              {touched.password && errors.password && (
                <View style={authStyles.errorView}>
                  <Icon source="alert-circle-outline" size={20} />
                  <Text style={authStyles.errorText}>{errors.password}</Text>
                </View>
              )}

              <View style={authStyles.forgotPasswordContainer}>
                <TouchableWithoutFeedback style={authStyles.forgotPassword}>
                  <Text
                    variant="labelMedium"
                    style={{
                      borderBottomColor: 'black',
                      borderBottomWidth: 1,

                      top: -15,
                    }}
                  >
                    ¿Olvidaste tu contraseña ?
                  </Text>
                </TouchableWithoutFeedback>
              </View>

              <Button
                mode="contained"
                style={{
                  backgroundColor: '#BEB52C',
                  opacity: (dirty && !isValid) || !dirty ? 0.5 : 1,
                }}
                onPress={() => {
                  Keyboard.dismiss();
                  handleSubmit();
                }}
                disabled={(dirty && !isValid) || !dirty}
              >
                <Text style={{ color: '#1D1C21' }}>Iniciar sesión</Text>
              </Button>
            </View>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </>
  );
};
const authStyles = StyleSheet.create({
  container: { flexDirection: 'column', gap: 20 },
  forgotPasswordContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  forgotPassword: {},
  errorView: { opacity: 0.7, display: 'flex', flexDirection: 'row' },
  errorText: { textTransform: 'capitalize' },
});

export default AuthForm;
