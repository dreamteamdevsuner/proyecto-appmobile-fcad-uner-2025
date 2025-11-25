import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button, Portal, Snackbar, Text, TextInput } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../appContext/authContext';

import { FormInputWithHelper } from './ui/FormInputs';
import { LoginForm } from '../interfaces/LoginForm';
import { UserDTO } from '../services/interfaces/UserDTO';
import useSnackbar from '../hooks/useSnackbar';
import candidateService from '../services/users/Candidate';
// import useAuth from '../hooks/useAuth';

import { signIn } from '@services/apiAuth';
import PUBLIC_NAVIGATOR_ROUTES from '@app/public/PUBLIC_NAVIGATOR_ROUTES';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

interface AuthFormProps {
  navigation: any;
}

interface AppSnackProps {
  visible: boolean;
  handleHideSnackBar: () => void;
  message: string;
}
export const AppSnackBar = ({
  visible,
  handleHideSnackBar,
  message,
}: AppSnackProps) => {
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
          backgroundColor: 'black',
        }}
        visible={visible}
        onDismiss={() => handleHideSnackBar()}
      >
        <Text style={{ color: 'white' }}> {message}</Text>
      </Snackbar>
    </Portal>
  );
};

const loginForm: UserDTO = {
  email: '',
  password: '',
};
const formValidationSchema = Yup.object({
  password: Yup.string().required('campo obligatorio'),
  email: Yup.string()
    .email('ingresar un email válido')
    .required('campo obligatorio'),
});
const AuthForm = ({ navigation }: AuthFormProps) => {
  const { state, login } = useAuth();
  // const { error, handleSignIn, loading } = useAuth();
  const { handleHideSnackbar, handleShowSnackbar, showSnackbar } =
    useSnackbar();
  const service = candidateService;

  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    // service.list();
  }, []);

  const handleLogin = async (values: UserDTO) => {
    const ok = await signIn({ email: values.email, password: values.password });

    if (!ok) {
      handleShowSnackbar();
    }
  };
  return (
    <>
      <AppSnackBar
        visible={showSnackbar}
        message="Login Error"
        handleHideSnackBar={handleHideSnackbar}
      ></AppSnackBar>

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
        }) => {
          const handleTextInputBlur = (key: keyof LoginForm) => {
            handleBlur(key);
            Keyboard.dismiss();
          };

          return (
            <View style={authStyles.container}>
              <FormInputWithHelper<LoginForm>
                formKey="email"
                value={values.email}
                placeholder="Escribí tu correo electrónico"
                key={'email'}
                label="Correo electrónico"
                onBlur={() => handleTextInputBlur('email')}
                onFocus={() => setFieldTouched('email', true)}
                onChangeText={handleChange('email')}
                keyboardType="email-address"
                errorCondition={Boolean(touched.email && errors.email) || false}
                errorMessage={errors.email ?? ''}
              ></FormInputWithHelper>
              <FormInputWithHelper<LoginForm>
                formKey="password"
                value={values.password}
                placeholder="Escribí tu contraseña"
                secureTextEntry={!passwordVisible}
                right={
                  <TextInput.Icon
                    icon={passwordVisible ? 'eye-off-outline' : 'eye-outline'}
                    onPress={() => setPasswordVisible(!passwordVisible)}
                  />
                }
                key={'password'}
                label="Contraseña"
                onBlur={() => handleTextInputBlur('password')}
                onFocus={() => setFieldTouched('password', true)}
                onChangeText={handleChange('password')}
                errorCondition={
                  Boolean(touched.password && errors.password) || false
                }
                errorMessage={errors.password ?? ''}
              ></FormInputWithHelper>

              <View style={authStyles.forgotPasswordContainer}>
                <TouchableWithoutFeedback
                  style={authStyles.forgotPassword}
                  onPress={() =>
                    navigation.navigate(PUBLIC_NAVIGATOR_ROUTES.RESET_PASSWORD)
                  }
                >
                  <Text
                    variant="labelMedium"
                    style={{
                      // borderBottomColor: 'black',
                      borderBottomWidth: 1,
                      color: '#b58df1',
                      fontWeight: 'bold',
                      top: -10,
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
          );
        }}
      </Formik>
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
