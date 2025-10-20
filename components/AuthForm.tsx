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
import { signIn } from '../services/apiAuth';
import { FormInput, FormInputWithHelper } from './ui/FormInputs';
import { LoginForm } from '../interfaces/LoginForm';
import { UserDTO } from '../services/interfaces/UserDTO';

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
const AuthForm = () => {
  const { state, login } = useAuth();

  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleShowSnackbar = () => {
    setShowSnackbar(true);
  };
  const handleHideSnackbar = () => {
    setShowSnackbar(false);
  };

  const handleLogin = async (values: UserDTO) => {
    // console.log("handle login");
    console.log('values', values);
    //MOCKUP LOGIN SUCCESS
    // (async () => {
    //   const ok = await login(values.email, values.password);
    //   if (!ok) {
    //     handleShowSnackbar();
    //   }
    // })();
    const singInRes = await signIn(values);
    if (!singInRes) {
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
          }) => {
            const handleTextInputBlur = (key: keyof LoginForm) => {
              handleBlur(key);
              Keyboard.dismiss();
            };
            const handleTextFieldTouched = (key: keyof LoginForm) => {
              setFieldTouched(key);
            };
            const handleOnChangeText = (key: keyof LoginForm) => {
              handleChange(key);
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
                  errorCondition={
                    Boolean(touched.email && errors.email) || false
                  }
                  errorMessage={errors.email ?? ''}
                ></FormInputWithHelper>
                <FormInputWithHelper<LoginForm>
                  formKey="password"
                  value={values.password}
                  placeholder="Escribí tu contraseña"
                  secureTextEntry={true}
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
            );
          }}
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
