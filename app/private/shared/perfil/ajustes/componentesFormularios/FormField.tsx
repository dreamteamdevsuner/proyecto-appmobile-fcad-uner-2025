import React from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import { TextInput, TextInputProps, Text } from 'react-native-paper';
import { FormikProps } from 'formik';
import { useInputTheme } from '../../../constants/theme/useInputTheme';

type FormFieldProps<Values> = Omit<
  TextInputProps,
  'value' | 'onChangeText' | 'onBlur'
> & {
  name: keyof Values & string;
  formik: FormikProps<Values>;
  onLayout?: (event: LayoutChangeEvent) => void;
};

const FormField = <Values extends {}> ({ 
  name, 
  formik, 
  onLayout,
  ...props 
}: FormFieldProps<Values>) => {
  const { values, handleChange, handleBlur, errors, touched } = formik;
  const inputTheme = useInputTheme();

  const hasError = touched[name] && errors[name]

  return (
    <View onLayout={onLayout}>
        <TextInput
          mode="outlined"
          value={values[name] as string}
          onChangeText={handleChange(name)}
          onBlur={handleBlur(name)}
          error={!!hasError}
          theme={inputTheme.theme}
          {...props}
        />
        {hasError && (
        <Text style={styles.errorText}>{errors[name] as string}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  errorText: {
    fontSize: 12,
    color: '#FF8A80', 
    marginTop: 4,
    marginLeft: 12, 
  },
});

export default FormField;
