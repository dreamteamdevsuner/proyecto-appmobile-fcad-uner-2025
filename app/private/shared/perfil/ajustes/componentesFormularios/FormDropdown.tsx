import React, { PropsWithChildren, useState } from 'react';
import {
  LayoutChangeEvent,
  View,
  TextStyle,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { FormikProps } from 'formik';
import { Menu, TextInput, Chip } from 'react-native-paper';
import { useInputTheme } from '../../../constants/theme/useInputTheme';
import { StyledTextInput } from '../../../../candidates/screens/conversacion/styles';
import { StyleSheet } from 'react-native';

type OptionType<T = string> = { label: string; value: T };

interface FormDropdownProps<T = string> extends PropsWithChildren {
  name: string;
  formik: FormikProps<any>;
  items: OptionType<T>[];
  placeholder?: string;
  multiple?: boolean;
  textStyled?: 'capitalize' | 'uppercase' | null;
  viewStyles?: StyleProp<ViewStyle>;
}

const FormDropdown = <T extends string | number = string>({
  name,
  formik,
  items,
  placeholder = 'Seleccionar...',
  children,
  multiple = false,
  textStyled = null,
  viewStyles = { marginBottom: 20 },
}: FormDropdownProps<T>) => {
  const [visible, setVisible] = useState(false);
  const [anchorWidth, setAnchorWidth] = useState(0);
  const { theme } = useInputTheme();
  const value = formik.values[name];

  const handleSelect = (val: T) => {
    if (name === 'redSeleccionada') {
      const redesActuales = formik.values.redes || [];
      if (!redesActuales.some((r: any) => r.tipo === val)) {
        formik.setFieldValue('redes', [
          ...redesActuales,
          { tipo: val, url: '' },
        ]);
      }
      formik.setFieldValue('redSeleccionada', '');
      setVisible(false);
      return;
    }

    if (multiple) {
      const selected: T[] = Array.isArray(value) ? value : [];
      const newValues = selected.includes(val)
        ? selected.filter((v) => v !== val)
        : [...selected, val];
      formik.setFieldValue(name, newValues);
    } else {
      formik.setFieldValue(name, val);
      setVisible(false);
    }
  };

  const selectedText =
    name === 'redSeleccionada'
      ? placeholder
      : multiple
        ? Array.isArray(value) && value.length > 0
          ? `${value.length} seleccionados`
          : placeholder
        : items.find((item) => item.value === value)?.label || placeholder;

  const onAnchorLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;

    if (width !== anchorWidth) {
      setAnchorWidth(width);
    }
  };

  return (
    <View style={StyleSheet.flatten(viewStyles)}>
      {children}
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        contentStyle={[
          { width: anchorWidth },
          { backgroundColor: theme.colors.background },
        ]}
        anchor={
          <View onLayout={onAnchorLayout}>
            <TextInput
              mode="outlined"
              value={selectedText}
              placeholder={placeholder}
              contentStyle={{
                ...(textStyled && { textTransform: textStyled }),
              }}
              editable={false}
              right={
                <TextInput.Icon
                  icon={visible ? 'chevron-up' : 'chevron-down'}
                  onPress={() => setVisible((prev) => !prev)}
                />
              }
            />
          </View>
        }
      >
        {items.map((item) => (
          <Menu.Item
            key={item.value}
            title={item.label}
            titleStyle={{ ...(textStyled && { textTransform: textStyled }) }}
            onPress={() => handleSelect(item.value)}
            trailingIcon={
              multiple && Array.isArray(value) && value.includes(item.value)
                ? 'check'
                : undefined
            }
          />
        ))}
      </Menu>
      {multiple && Array.isArray(value) && value.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 6,
            marginTop: 8,
          }}
        >
          {value.map((val: T) => {
            const itemLabel = items.find((i) => i.value === val)?.label || val;
            return (
              <Chip
                key={val}
                onClose={() => handleSelect(val)}
                style={{
                  backgroundColor: '#2C2C2C',
                  borderRadius: 20,
                  borderWidth: 1,
                }}
                closeIcon="close-circle-outline"
              >
                {itemLabel}
              </Chip>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default FormDropdown;
{
  /* const FormDropdown = <T  =  string >({
  name,
  formik,
  items,
  placeholder = 'Seleccionar...',
  multiple = false,
}: FormDropdownProps<T>) => {
  const [visible, setVisible] = useState(false);
  const [anchorWidth, setAnchorWidth] = useState(0);
  const { theme } = useInputTheme();
  const value = formik.values[name];

  const handleSelect = (val: string) => {
    if (name === 'redSeleccionada') {
      const redesActuales = formik.values.redes || [];
      if (!redesActuales.some((r: any) => r.tipo === val)) {
        formik.setFieldValue('redes', [
          ...redesActuales,
          { tipo: val, url: '' },
        ]);
      }
      formik.setFieldValue('redSeleccionada', '');
      setVisible(false);
      return;
    }

    if (multiple) {
      const selected: string[] = Array.isArray(value) ? value : [];
      const newValues = selected.includes(val)
        ? selected.filter((v) => v !== val)
        : [...selected, val];
      formik.setFieldValue(name, newValues);
    } else {
      formik.setFieldValue(name, val);
      setVisible(false);
    }
  };

  const selectedText =
    name === 'redSeleccionada'
      ? placeholder
      : multiple
        ? Array.isArray(value) && value.length > 0
          ? `${value.length} seleccionados`
          : placeholder
        : items.find((item) => item.value === value)?.label || placeholder;

  const onAnchorLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;

    if (width !== anchorWidth) {
      setAnchorWidth(width);
    }
  };

  return (
    <View style={{ marginBottom: 20 }}>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        contentStyle={[
          { width: anchorWidth },
          { backgroundColor: theme.colors.background },
        ]}
        anchor={
          <View onLayout={onAnchorLayout}>
            <TextInput
              mode="outlined"
              value={selectedText}
              placeholder={placeholder}
              editable={false}
              right={
                <TextInput.Icon
                  icon={visible ? 'chevron-up' : 'chevron-down'}
                  onPress={() => setVisible((prev) => !prev)}
                />
              }
            />
          </View>
        }
      >
        {items.map((item) => (
          <Menu.Item
            key={item.value}
            title={item.label}
            onPress={() => handleSelect(item.value)}
            trailingIcon={
              multiple && Array.isArray(value) && value.includes(item.value)
                ? 'check'
                : undefined
            }
          />
        ))}
      </Menu>
      {multiple && Array.isArray(value) && value.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 6,
            marginTop: 8,
          }}
        >
          {value.map((val: string) => {
            const itemLabel = items.find((i) => i.value === val)?.label || val;
            return (
              <Chip
                key={val}
                onClose={() => handleSelect(val)}
                style={{
                  backgroundColor: '#2C2C2C',
                  borderRadius: 20,
                  borderWidth: 1,
                }}
                closeIcon="close-circle-outline"
              >
                {itemLabel}
              </Chip>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default FormDropdown; */
}
