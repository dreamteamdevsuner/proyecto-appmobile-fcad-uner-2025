import React, { useState } from 'react';
import { LayoutChangeEvent, View, StyleSheet } from 'react-native';
import { FormikProps } from 'formik';
import { Menu, TextInput, useTheme, Chip, Text } from 'react-native-paper';
import { useInputTheme } from '../../../constants/theme/useInputTheme';
import { DropdownItem } from '@services/perfilService';
import { SkillConNivel } from '@interfaces/EditarPerfil';

type OptionType = { label: string; value: string };

type FormDropdownProps<Values> = {
  name: keyof Values & string;
  formik: FormikProps<Values>;
  items: OptionType[];
  placeholder?: string;
  multiple?: boolean;
  onLayout?: (event: LayoutChangeEvent) => void;
  onItemSelected?: (value: string, name: keyof Values & string) => boolean;
  niveles?: DropdownItem[]; 
  isSkill?: boolean;
};

const FormDropdown = <Values extends object>({
  name,
  formik,
  items,
  onLayout,
  placeholder = 'Seleccionar...',
  multiple = false,
  onItemSelected,
  isSkill,
}: FormDropdownProps<Values>) => {
  const [visible, setVisible] = useState(false);
  const [anchorWidth, setAnchorWidth] = useState(0);
  const { theme } = useInputTheme();

  const { values, errors, touched } = formik;
  const value = formik.values[name] as string | string[] | SkillConNivel[];
  const hasError = touched[name] && errors[name];

  const handleSelect = (val: string) => {
    let shouldProceed = true;
    if (onItemSelected) {
      shouldProceed = onItemSelected(val, name);
    }

    if (!shouldProceed) {
      setVisible(false);
      return;
    }

    if (name === 'redSeleccionada') {
      const redesActuales =
        (formik.values as { redes?: { tipo: string; url: string }[] }).redes ||
        [];
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

    if (multiple && !isSkill) {
      const selected: string[] = Array.isArray(value) ? (value as string[]) : [];
      const newValues = selected.includes(val)
        ? selected.filter((v) => v !== val)
        : [...selected, val];
      formik.setFieldValue(name, newValues);
    } else if (!multiple){
      formik.setFieldValue(name, val);
      setVisible(false);
    }
  };

  const selectedText = React.useMemo(() => {
    if (name === 'redSeleccionada') {
      return placeholder;
    }
    if (multiple) {
      if (Array.isArray(value) && value.length > 0) {
        return `${value.length} seleccionados`;
      }
      return placeholder;
    }
    return items.find((item) => item.value === value)?.label || placeholder;
  }, [value, items, multiple, name, placeholder]);  
        

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
        {items.map((item) => {
          let isCurrentlySelected = false;
          if (multiple && Array.isArray(value)) {
            if (isSkill) {
              // Caso SkillConNivel[]
              isCurrentlySelected = (value as SkillConNivel[]).some(v => v.idskill === item.value);
            } else {
              // Caso string[]
              isCurrentlySelected = (value as string[]).includes(item.value);
            }
          }
          return (
            <Menu.Item
              key={item.value}
              title={item.label}
              onPress={() => handleSelect(item.value)}
              trailingIcon={
                multiple && isCurrentlySelected ? 'check' : undefined}
            />
          );
        })}
      </Menu>
      {hasError && (
        <Text style={styles.errorText}>{errors[name] as string}</Text>
      )}

      {multiple &&
        name === 'habilidades' &&
        Array.isArray(value) &&
        value.length > 0 && (
          <View style={styles.chipContainer}>
                     {' '}
            {(value as string[]).map((val: string) => {
              const itemLabel =
                items.find((i) => i.value === val)?.label || val;
              return (
                <Chip
                  key={val}
                  onClose={() => handleSelect(val)}
                  style={styles.chip}
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
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  chip: {
    backgroundColor: '#2C2C2C',
    borderRadius: 20,
    borderWidth: 1,
  },
});

export default FormDropdown;
