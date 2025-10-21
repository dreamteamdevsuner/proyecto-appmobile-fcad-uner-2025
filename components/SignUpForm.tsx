import { View, StyleSheet } from 'react-native';
import React from 'react';
import { UserDTO } from '../services/interfaces/UserDTO';
import * as Yup from 'yup';
import { Formik, FormikProps } from 'formik';
import { signUp } from '../services/apiAuth';
import { FormInputWithHelper } from './ui/FormInputs';
import { Keyboard } from 'react-native';

import { Button, Checkbox, Text, useTheme } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { PaperSelect } from 'react-native-paper-select';
import FormDropdown from '../app/private/shared/perfil/ajustes/componentesFormularios/FormDropdown';

export enum Roles {
  PROFESIONAL = 1,
  RECLUTADOR = 2,
}
export interface SignUpForm {
  email: string;
  password: string;
  password2: string;
  nombre: string;
  apellido: string;
  idtipousuario: Roles;
  terminosYCondiciones: boolean;
}
const singnUpForm: SignUpForm = {
  email: '',
  password: '',
  nombre: '',
  apellido: '',
  password2: '',
  idtipousuario: Roles.PROFESIONAL,
  terminosYCondiciones: false,
};

const formValidationSchema = Yup.object({
  password: Yup.string()
    .required('campo obligatorio')
    .min(6, 'debe contener al menos 6 caracteres'),
  password2: Yup.string()
    .oneOf(
      [Yup.ref('password'), ''],
      'confirmar contraseña y contraseña deben ser iguales',
    )
    .required('campo obligatorio'),
  email: Yup.string()
    .email('ingresar un email válido')
    .required('campo obligatorio'),
  nombre: Yup.string().required('campo obligatorio'),
  apellido: Yup.string().required(),
  terminosYCondiciones: Yup.boolean().required(),
});
const SignUpForm = () => {
  const handleSignUp = async (user: UserDTO) => {
    console.log('user', user);
    const res = await signUp(user);
    console.log('SIGNUP RESPONSE', res);
  };
  const theme = useTheme();
  return (
    <KeyboardAwareScrollView bottomOffset={62}>
      <Formik
        initialValues={singnUpForm}
        onSubmit={(values) => handleSignUp(values)}
        validationSchema={formValidationSchema}
        validateOnChange={true}
      >
        {(formik) => {
          const {
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            setFieldTouched,
            values,
            errors,
            isValid,
            dirty,
            touched,
            initialTouched,
          } = formik;
          return (
            <View style={signUpStyles.container}>
              <FormDropdown
                placeholder="Registrarme como"
                name="idtipousuario"
                items={[
                  { value: Roles.PROFESIONAL, label: 'profesional' },
                  { value: Roles.RECLUTADOR, label: 'reclutador' },
                ]}
                textStyled={'capitalize'}
                formik={formik}
                viewStyles={{}}
              >
                <View
                  style={{ marginBottom: 10, marginLeft: 10, opacity: 0.8 }}
                >
                  <Text>Registrarme como</Text>
                </View>
              </FormDropdown>
              <FormInputWithHelper<SignUpForm>
                formKey="nombre"
                value={values.nombre}
                placeholder="Escribí tu nombre"
                key={'nombre'}
                label="Nombre"
                onBlur={() => handleBlur('nombre')}
                onFocus={() => setFieldTouched('nombre', true)}
                onChangeText={handleChange('nombre')}
                errorCondition={
                  Boolean(touched.nombre && errors.nombre) || false
                }
                errorMessage={errors.nombre ?? ''}
              ></FormInputWithHelper>
              <FormInputWithHelper<SignUpForm>
                formKey="apellido"
                value={values.apellido}
                placeholder="Escribí tu apellido"
                key={'apellido'}
                label="Apellido"
                onBlur={() => handleBlur('apellido')}
                onFocus={() => setFieldTouched('apellido', true)}
                onChangeText={handleChange('apellido')}
                errorCondition={
                  Boolean(touched.apellido && errors.apellido) || false
                }
                errorMessage={errors.nombre ?? ''}
              ></FormInputWithHelper>
              <FormInputWithHelper<SignUpForm>
                formKey="email"
                value={values.email}
                placeholder="Escribí tu correo electrónico"
                key={'email'}
                label="Correo electrónico"
                onBlur={() => handleBlur('email')}
                onFocus={() => setFieldTouched('email', true)}
                onChangeText={handleChange('email')}
                keyboardType="email-address"
                errorCondition={Boolean(touched.email && errors.email) || false}
                errorMessage={errors.email ?? ''}
              ></FormInputWithHelper>
              <FormInputWithHelper<SignUpForm>
                formKey="password"
                value={values.password}
                placeholder="Escribí tu contraseña"
                secureTextEntry={true}
                key={'password'}
                label="Contraseña"
                onBlur={() => handleBlur('password')}
                onFocus={() => setFieldTouched('password', true)}
                onChangeText={handleChange('password')}
                errorCondition={
                  Boolean(touched.password && errors.password) || false
                }
                errorMessage={errors.password ?? ''}
              ></FormInputWithHelper>
              <FormInputWithHelper<SignUpForm>
                formKey="password2"
                value={values.password2}
                placeholder="Escribí tu contraseña"
                secureTextEntry={true}
                key={'password2'}
                label="Repetir Contraseña"
                onBlur={() => handleBlur('password2')}
                onFocus={() => setFieldTouched('password2', true)}
                onChangeText={handleChange('password2')}
                errorCondition={
                  Boolean(touched.password2 && errors.password2) || false
                }
                errorMessage={errors.password2 ?? ''}
              ></FormInputWithHelper>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                <Checkbox
                  status={values.terminosYCondiciones ? 'checked' : 'unchecked'}
                  onPress={() => {
                    setFieldValue(
                      'terminosYCondiciones',
                      !values.terminosYCondiciones,
                    );
                  }}
                />
                <Text variant="labelSmall">
                  Acepto los términos y condiciones.
                </Text>
              </View>
              <Button
                mode="contained"
                style={{
                  backgroundColor: theme.colors.primary,
                  opacity: (dirty && !isValid) || !dirty ? 0.5 : 1,
                }}
                onPress={() => {
                  Keyboard.dismiss();
                  handleSubmit();
                }}
                disabled={(dirty && !isValid) || !dirty}
              >
                <Text
                  style={{
                    color: '#1D1C21',

                    textTransform: 'capitalize',
                  }}
                >
                  registrarme
                </Text>
              </Button>
            </View>
          );
        }}
      </Formik>
    </KeyboardAwareScrollView>
  );
};

const signUpStyles = StyleSheet.create({
  container: { flexDirection: 'column', gap: 20 },

  errorView: { opacity: 0.7, display: 'flex', flexDirection: 'row' },
  errorText: { textTransform: 'capitalize' },
});

export default SignUpForm;
