import React from 'react';
import { TextInput, TextInputProps } from 'react-native-paper';
import { FormikProps } from 'formik';
import { useInputTheme } from '../../../constants/theme/useInputTheme';

type FormFieldProps = Omit<
  TextInputProps,
  'value' | 'onChangeText' | 'onBlur'
> & {
  name: string;
  formik: FormikProps<any>;
};

const FormField = ({ name, formik, ...props }: FormFieldProps) => {
  const { values, handleChange, handleBlur, errors, touched } = formik;
  const inputTheme = useInputTheme();

  return (
    <TextInput
      mode="outlined"
      value={values[name]}
      onChangeText={handleChange(name)}
      onBlur={handleBlur(name)}
      error={touched[name] && Boolean(errors[name])}
      {...props}
    />
  );
};

export default FormField;
