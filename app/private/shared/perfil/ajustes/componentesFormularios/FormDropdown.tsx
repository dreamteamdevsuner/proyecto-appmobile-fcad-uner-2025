import React, { useState } from 'react';
import { LayoutChangeEvent, View, StyleSheet } from 'react-native';
import { FormikProps } from 'formik';
import { Menu, TextInput, useTheme, Chip, Text } from 'react-native-paper';
import { useInputTheme } from '../../../constants/theme/useInputTheme';

type OptionType = { label: string; value: string };

type FormDropdownProps<Values> = {
  name: keyof Values & string;
  formik: FormikProps<Values>;
  items: OptionType[];
  placeholder?: string;
  multiple?: boolean;
  onLayout?: (event: LayoutChangeEvent) => void;

};

const FormDropdown = <Values extends {}> ({
  name,
  formik,
  items,
  onLayout,
  placeholder = 'Seleccionar...',
  multiple = false,
}: FormDropdownProps<Values>) => {
  const [visible, setVisible] = useState(false);
  const [anchorWidth, setAnchorWidth] = useState(0);
  const { theme } = useInputTheme();

  const { values, errors, touched } = formik;
  const value = formik.values[name];
  
  const hasError = touched[name] && errors[name]

  const handleSelect = (val: string) => {
    if (name === 'redSeleccionada') {
      const redesActuales = (formik.values as { redes?: { tipo: string; url: string}[] }).redes || [];
      if (!redesActuales.some((r) => r.tipo === val)) {
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
    <View style={{ marginBottom: 20 }} onLayout={onLayout}>
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
              theme={theme}
              error={!!hasError}
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
      {hasError && (
        <Text style={styles.errorText}>{errors[name] as string}</Text>
      )}

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

const styles = StyleSheet.create({
  errorText: {
    fontSize: 12,
    color: '#FF8A80',
    marginTop: 4,
    marginLeft: 12,
  }
});

export default FormDropdown;
