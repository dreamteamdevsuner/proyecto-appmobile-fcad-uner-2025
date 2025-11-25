import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FieldArray, FormikProps } from 'formik';
import { Button, Checkbox } from 'react-native-paper';
import FormField from './FormField'; 

interface FieldMap {
  titulo: string;
  subtitulo: string;
}

interface ArrayEditorProps {
  formik: FormikProps<any>; 
  name: string; 
  title: string; 
  itemTitleLabel: string; 
  itemSubtitleLabel: string; 
  fieldMap: FieldMap; 
  onOpenCalendar: (index: number, field: string, arrayName: string) => void;
  getFechaDisplay: (date: any) => string | null;
  styles: any; 
}

const ArrayEditor: React.FC<ArrayEditorProps> = ({
  formik,
  name,
  title,
  itemTitleLabel,
  itemSubtitleLabel,
  fieldMap,
  onOpenCalendar,
  getFechaDisplay,
  styles,
}) => {


  const getEmptyItem = () => ({
    [fieldMap.titulo]: '',
    [fieldMap.subtitulo]: '',
    fechainicio: '',
    fechafin: '',
    activo: false,
  });


  const singularName = name.charAt(0).toUpperCase() + name.slice(1, -1);

  return (
    <View>
      
      <FieldArray name={name}>
        {(arrayHelpers) => (
          <View>
            {formik.values[name] && formik.values[name].length > 0 ? (
              formik.values[name].map((item: any, index: number) => {
                const fechaInicioDisplay = getFechaDisplay(item.fechainicio);
                const fechaFinDisplay = getFechaDisplay(item.fechafin);

                return (
                  <View key={index} style={styles.estudioContainer}>
                    <Text style={styles.estudioTitulo}>
                      {singularName} #{index + 1}
                    </Text>
                    
                    {/* Campo 1: Título o Posición */}
                    <FormField
                      name={`${name}[${index}].${fieldMap.titulo}`}
                      formik={formik}
                      placeholder={itemTitleLabel}
                      style={{ marginBottom: 10 }}
                    />

                    {/* Campo 2: Institución o Empresa */}
                    <FormField
                      name={`${name}[${index}].${fieldMap.subtitulo}`}
                      formik={formik}
                      placeholder={itemSubtitleLabel}
                      style={{ marginBottom: 10 }}
                    />

                    {/* Selector Fecha Inicio */}
                    <TouchableOpacity
                      style={styles.datePickerButton}
                      onPress={() => onOpenCalendar(index, 'fechainicio', name)}
                    >
                      <Text style={styles.datePickerButtonText}>
                        {fechaInicioDisplay || 'Fecha Inicio'}
                      </Text>
                    </TouchableOpacity>

                    {/* Selector Fecha Fin */}
                    <TouchableOpacity
                      style={styles.datePickerButton}
                      onPress={() => onOpenCalendar(index, 'fechafin', name)}
                      disabled={item.activo}
                    >
                      <Text
                        style={[
                          styles.datePickerButtonText,
                          item.activo && styles.datePickerButtonTextDisabled,
                        ]}
                      >
                        {item.activo
                          ? 'En curso' 
                          : fechaFinDisplay || 'Fecha Fin'}
                      </Text>
                    </TouchableOpacity>

                    {/* Checkbox "Activo" */}
                    <View style={styles.checkboxContainer}>
                      <Checkbox.Android
                        status={item.activo ? 'checked' : 'unchecked'}
                        onPress={() => {
                          const nuevoEstado = !item.activo;
                          formik.setFieldValue(
                            `${name}[${index}].activo`,
                            nuevoEstado
                          );
                          if (nuevoEstado) {
                            formik.setFieldValue(
                              `${name}[${index}].fechafin`,
                              null
                            );
                          }
                        }}
                      />
                      <Text style={{ color: 'white' }}>Actualmente aquí</Text>
                    </View>

                    <Button
                      mode="outlined"
                      color="#b58df1"
                      onPress={() => arrayHelpers.remove(index)}
                    >
                      Quitar {singularName}
                    </Button>
                  </View>
                );
              })
            ) : (
              <Text style={{ marginVertical: 10, color: 'gray' }}>
                No has añadido registros de {name}.
              </Text>
            )}

            <Button
              mode="contained"
              style={{ marginTop: 10 }}
              onPress={() => arrayHelpers.push(getEmptyItem())}
            >
              Añadir {singularName}
            </Button>
          </View>
        )}
      </FieldArray>
    </View>
  );
};

export default ArrayEditor;