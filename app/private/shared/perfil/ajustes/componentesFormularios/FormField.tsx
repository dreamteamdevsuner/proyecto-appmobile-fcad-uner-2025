import React from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import { TextInput, TextInputProps, Text } from 'react-native-paper';
import { FormikProps, getIn } from 'formik';
import { useInputTheme } from '../../../constants/theme/useInputTheme';

type FormFieldProps<Values> = Omit<
  TextInputProps,
  'value' | 'onChangeText' | 'onBlur'
> & {
  name: string;
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

  const fieldValue = getIn(values, name);
  const fieldError = getIn(errors, name);
  const fieldTouched = getIn(touched, name);
  const hasError = fieldTouched && fieldError;

  return (
    <View onLayout={onLayout}>
        <TextInput
          mode="outlined"
          value={fieldValue as string}
          onChangeText={handleChange(name)}
          onBlur={handleBlur(name)}
          error={!!hasError}
          theme={inputTheme.theme}
          {...props}
        />
        {hasError && (
        <Text style={styles.errorText}>{fieldError as string}</Text>
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
