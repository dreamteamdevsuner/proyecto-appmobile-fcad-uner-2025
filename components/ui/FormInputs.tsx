/**
 * Importaciones de componentes y tipos de React Native y React.
 *
 * @module imports
 */
import {
  View, // Contenedor básico de layout
  Text, // Texto simple
  Keyboard, // API del teclado nativo
  // Props comunes de los inputs de texto
  KeyboardTypeOptions, // Opciones de tipo de teclado (email, numeric, etc.)
  StyleSheet, // Creación de estilos en React Native
} from 'react-native';
import React, { JSX } from 'react';
import { Icon, TextInput, TextInputProps } from 'react-native-paper';

interface FormInputProps<T> extends Partial<TextInputProps> {
  /** Clave del campo dentro del tipo genérico T. */
  formKey: keyof T;
  /** Etiqueta opcional que se muestra encima del campo. */
  label?: string;
  /** Texto de marcador de posición opcional. */
  placeholder?: string;
  /** Valor actual del campo (controlado). */
  value: string;
}

/**
 * Componente funcional que renderiza un `TextInput` de react‑native‑paper
 * con estilo “outlined”. Es genérico para poder tipar dinámicamente la
 * clave del formulario (`formKey`).
 *
 * @template T - Tipo del objeto de formulario que contiene este campo.
 *
 * @param {FormInputProps<T>} props - Propiedades del componente.
 * @returns {JSX.Element} El elemento `TextInput` configurado.
 */
export const FormInput = <T,>(props: FormInputProps<T>): JSX.Element => {
  const {
    formKey,
    label,
    placeholder,
    value,
    onBlur,
    onFocus,
    onChangeText,
    keyboardType,
    ...inheritProps
  } = props;

  return (
    <TextInput
      /** Evento que se dispara cuando el input pierde el foco. */
      onBlur={onBlur}
      /** Evita la capitalización automática del teclado. */
      autoCapitalize="none"
      /** Etiqueta visible; si no se provee, se muestra una cadena vacía. */
      label={label ?? ''}
      /** Texto de ayuda cuando el campo está vacío; también opcional. */
      placeholder={placeholder ?? ''}
      /** Estilo del contorno del input. */
      mode="outlined"
      /** Evento que se dispara al enfocar el input. */
      onFocus={onFocus}
      /** Actualiza el valor del input según el texto ingresado. */
      onChangeText={onChangeText}
      /** Valor controlado del input. */
      value={value}
      /** Tipo de teclado (por defecto 'default'). */
      keyboardType={keyboardType ?? 'default'}
      {...inheritProps}
    />
  );
};

/**
 * Versión del componente que incluye un mensaje de ayuda o error debajo del input.
 *
 * @template T - Tipo del objeto de formulario que contiene este campo.
 *
 * @param {FormInputProps<T> & { errorCondition: boolean; errorMessage: string }} props
 *        Propiedades del componente, incluyendo la condición de error y su mensaje.
 * @returns {JSX.Element} El input con posible mensaje de error.
 */
export const FormInputWithHelper = <T,>(
  props: FormInputProps<T> & {
    /** Indica si debe mostrarse el mensaje de error. */
    errorCondition: boolean;
    /** Texto del mensaje de error que se mostrará bajo el input. */
    errorMessage: string;
  },
): JSX.Element => {
  const {
    formKey,
    label,
    placeholder,
    value,
    onBlur,
    onFocus,
    onChangeText,
    keyboardType,
    errorCondition,
    errorMessage,
    ...inheritProps
  } = props;

  return (
    <>
      <TextInput
        onBlur={onBlur}
        autoCapitalize="none"
        label={label ?? ''}
        placeholder={placeholder ?? ''}
        mode="outlined"
        onFocus={onFocus}
        onChangeText={onChangeText}
        value={value}
        keyboardType={keyboardType ?? 'default'}
        {...inheritProps}
      />
      {/* Si errorCondition es true, mostramos la vista de error. */}
      {errorCondition && (
        <View style={localStyles.errorView}>
          <Icon source="alert-circle-outline" size={20} />
          <Text style={localStyles.errorText}>{errorMessage}</Text>
        </View>
      )}
    </>
  );
};

/**
 * Definición de estilos locales para el componente.
 *
 * @constant {StyleSheet.NamedStyles<{errorView: object; errorText: object}>}
 *          localStyles - Conjunto de estilos reutilizables.
 */
const localStyles = StyleSheet.create({
  /** Contenedor horizontal del mensaje de error (icono + texto). */
  errorView: {
    opacity: 0.7,
    display: 'flex',
    flexDirection: 'row',
  },
  /** Estilo del texto del mensaje de error. */
  errorText: {
    textTransform: 'capitalize',
  },
});
