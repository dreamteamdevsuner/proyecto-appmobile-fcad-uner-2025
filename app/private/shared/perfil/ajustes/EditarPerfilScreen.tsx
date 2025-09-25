import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text as RNText,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import DropDownPicker from 'react-native-dropdown-picker';

// Importamos las listas del archivo de constantes
import {
  PAISES_LIST,
  HERRAMIENTAS_LIST,
  HABILIDADES_LIST,
  IDIOMAS_LIST,
  MODALIDADES_LIST,
  JORNADAS_LIST,
  CONTRATOS_LIST,
  REDES_LIST,
} from '../../constants/GenericList';

interface PerfilValues {
  nombre: string;
  apellido: string;
  profesion: string;
  localizacion: string;
  herramientas: string[];
  habilidades: string[];
  aboutMe: string;
  estudiosFormales: string;
  otrosEstudios: string;
  idiomasSeleccionados: string[];
  modalidadSeleccionada: string;
  jornadaSeleccionada: string;
  contratoSeleccionado: string;
  email: string;
  redes: { tipo: string; url: string }[];
}

const initialValues: PerfilValues = {
  nombre: '',
  apellido: '',
  profesion: '',
  localizacion: '',
  herramientas: [],
  habilidades: [],
  aboutMe: '',
  estudiosFormales: '',
  otrosEstudios: '',
  idiomasSeleccionados: [],
  modalidadSeleccionada: '',
  jornadaSeleccionada: '',
  contratoSeleccionado: '',
  email: '',
  redes: [],
};

const EditarPerfilScreen = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleSubmit = (values: PerfilValues) => {
    console.log('Perfil actualizado:', values);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyboardDismissMode="on-drag"
        >
          <Formik initialValues={initialValues} onSubmit={handleSubmit}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              setFieldValue,
            }) => (
              <View>
                {/* DATOS PERSONALES */}
                <Text style={styles.titulo}>Nombre</Text>
                <TextInput
                  mode="outlined"
                  onChangeText={handleChange('nombre')}
                  onBlur={handleBlur('nombre')}
                  value={values.nombre}
                  placeholder="Ingresá tu nombre"
                  style={styles.input}
                  theme={{ roundness: 30 }}
                />

                <Text style={styles.titulo}>Apellido</Text>
                <TextInput
                  mode="outlined"
                  onChangeText={handleChange('apellido')}
                  onBlur={handleBlur('apellido')}
                  value={values.apellido}
                  placeholder="Ingresá tu apellido"
                  style={styles.input}
                  theme={{ roundness: 30 }}
                />

                <Text style={styles.titulo}>Profesión</Text>
                <TextInput
                  mode="outlined"
                  onChangeText={handleChange('profesion')}
                  onBlur={handleBlur('profesion')}
                  value={values.profesion}
                  placeholder="Ej: Diseñador UX/UI"
                  style={styles.input}
                  theme={{ roundness: 30 }}
                />

                <Text style={styles.titulo}>Localización</Text>
                <DropDownPicker
                  open={openDropdown === 'localizacion'}
                  setOpen={() =>
                    setOpenDropdown(
                      openDropdown === 'localizacion' ? null : 'localizacion',
                    )
                  }
                  value={values.localizacion}
                  setValue={(callback) =>
                    setFieldValue('localizacion', callback(values.localizacion))
                  }
                  items={PAISES_LIST}
                  placeholder="Selecciona ubicación"
                  style={styles.dropdown}
                  zIndex={6000}
                  listMode="SCROLLVIEW"
                />

                {/* HERRAMIENTAS */}
                <Text style={styles.titulo}>Herramientas</Text>
                <DropDownPicker
                  open={openDropdown === 'herramientas'}
                  setOpen={() =>
                    setOpenDropdown(
                      openDropdown === 'herramientas' ? null : 'herramientas',
                    )
                  }
                  value={values.herramientas}
                  setValue={(callback) =>
                    setFieldValue('herramientas', callback(values.herramientas))
                  }
                  items={HERRAMIENTAS_LIST}
                  placeholder="Selecciona herramientas"
                  style={styles.dropdown}
                  multiple={true}
                  min={0}
                  max={HERRAMIENTAS_LIST.length}
                  mode="BADGE"
                  listMode="SCROLLVIEW"
                  zIndex={5000}
                />

                {/* HABILIDADES */}
                <Text style={styles.titulo}>Habilidades</Text>
                <DropDownPicker
                  open={openDropdown === 'habilidades'}
                  setOpen={() =>
                    setOpenDropdown(
                      openDropdown === 'habilidades' ? null : 'habilidades',
                    )
                  }
                  value={values.habilidades}
                  setValue={(callback) =>
                    setFieldValue('habilidades', callback(values.habilidades))
                  }
                  items={HABILIDADES_LIST}
                  placeholder="Selecciona habilidades"
                  style={styles.dropdown}
                  multiple={true}
                  min={0}
                  max={HABILIDADES_LIST.length}
                  mode="BADGE"
                  listMode="SCROLLVIEW"
                  zIndex={4000}
                />

                {/* SOBRE MÍ */}
                <Text style={styles.titulo}>Sobre mí</Text>
                <TextInput
                  mode="outlined"
                  style={styles.input}
                  onChangeText={handleChange('aboutMe')}
                  onBlur={handleBlur('aboutMe')}
                  value={values.aboutMe}
                  placeholder="Cuéntanos sobre ti"
                  multiline
                  contentStyle={{ paddingHorizontal: 20, paddingVertical: 15 }}
                  theme={{ roundness: 30 }}
                />

                {/* ESTUDIOS */}
                <Text style={styles.titulo}>Estudios formales</Text>
                <TextInput
                  mode="outlined"
                  style={styles.input}
                  onChangeText={handleChange('estudiosFormales')}
                  onBlur={handleBlur('estudiosFormales')}
                  value={values.estudiosFormales}
                  placeholder="Descripción"
                  multiline
                  theme={{ roundness: 30 }}
                />

                <Text style={styles.titulo}>Otros estudios</Text>
                <TextInput
                  mode="outlined"
                  style={styles.input}
                  onChangeText={handleChange('otrosEstudios')}
                  onBlur={handleBlur('otrosEstudios')}
                  value={values.otrosEstudios}
                  placeholder="Descripción"
                  multiline
                  theme={{ roundness: 30 }}
                />

                {/* IDIOMAS */}
                <Text style={styles.titulo}>Idiomas</Text>
                <DropDownPicker
                  open={openDropdown === 'idiomas'}
                  setOpen={() =>
                    setOpenDropdown(
                      openDropdown === 'idiomas' ? null : 'idiomas',
                    )
                  }
                  value={values.idiomasSeleccionados}
                  setValue={(callback) =>
                    setFieldValue(
                      'idiomasSeleccionados',
                      callback(values.idiomasSeleccionados),
                    )
                  }
                  items={IDIOMAS_LIST}
                  placeholder="Selecciona tu nivel de idiomas"
                  style={styles.dropdown}
                  multiple={true}
                  min={0}
                  max={IDIOMAS_LIST.length}
                  mode="BADGE"
                  listMode="SCROLLVIEW"
                  zIndex={3000}
                />

                {/* PREFERENCIAS (AHORA SEPARADAS) */}
                <Text style={styles.titulo}>Modalidad</Text>
                <DropDownPicker
                  open={openDropdown === 'modalidad'}
                  setOpen={() =>
                    setOpenDropdown(
                      openDropdown === 'modalidad' ? null : 'modalidad',
                    )
                  }
                  value={values.modalidadSeleccionada}
                  setValue={(callback) =>
                    setFieldValue(
                      'modalidadSeleccionada',
                      callback(values.modalidadSeleccionada),
                    )
                  }
                  items={MODALIDADES_LIST}
                  placeholder="Selecciona modalidad"
                  style={styles.dropdown}
                  zIndex={2000}
                  listMode="SCROLLVIEW"
                />

                <Text style={styles.titulo}>Jornada</Text>
                <DropDownPicker
                  open={openDropdown === 'jornada'}
                  setOpen={() =>
                    setOpenDropdown(
                      openDropdown === 'jornada' ? null : 'jornada',
                    )
                  }
                  value={values.jornadaSeleccionada}
                  setValue={(callback) =>
                    setFieldValue(
                      'jornadaSeleccionada',
                      callback(values.jornadaSeleccionada),
                    )
                  }
                  items={JORNADAS_LIST}
                  placeholder="Selecciona jornada"
                  style={styles.dropdown}
                  zIndex={1900}
                  listMode="SCROLLVIEW"
                />

                <Text style={styles.titulo}>Contrato</Text>
                <DropDownPicker
                  open={openDropdown === 'contrato'}
                  setOpen={() =>
                    setOpenDropdown(
                      openDropdown === 'contrato' ? null : 'contrato',
                    )
                  }
                  value={values.contratoSeleccionado}
                  setValue={(callback) =>
                    setFieldValue(
                      'contratoSeleccionado',
                      callback(values.contratoSeleccionado),
                    )
                  }
                  items={CONTRATOS_LIST}
                  placeholder="Selecciona contrato"
                  style={styles.dropdown}
                  zIndex={1800}
                  listMode="SCROLLVIEW"
                />

                {/* CONTACTO */}
                <Text style={styles.titulo}>Correo electrónico</Text>
                <TextInput
                  mode="outlined"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  placeholder="Escribe tu correo"
                  style={styles.input}
                  theme={{ roundness: 30 }}
                  keyboardType="email-address"
                />

                {/* REDES */}
                <RNText style={styles.titulo}>Redes</RNText>
                <DropDownPicker
                  open={openDropdown === 'redes'}
                  setOpen={() =>
                    setOpenDropdown(openDropdown === 'redes' ? null : 'redes')
                  }
                  value={null}
                  setValue={() => {}}
                  items={REDES_LIST}
                  placeholder="Selecciona una red para agregar"
                  style={styles.dropdown}
                  listMode="SCROLLVIEW"
                  zIndex={1700}
                  onChangeValue={(value) => {
                    const nuevasRedes = [...values.redes];
                    if (value && !nuevasRedes.find((r) => r.tipo === value)) {
                      setFieldValue('redes', [
                        ...nuevasRedes,
                        { tipo: value, url: '' },
                      ]);
                    }
                  }}
                />

                {values.redes.length > 0 && (
                  <View style={styles.redesContainer}>
                    {values.redes.map((red, idx) => (
                      <View key={`${red.tipo}_${idx}`} style={styles.redItem}>
                        <TextInput
                          mode="outlined"
                          label={red.tipo}
                          value={red.url}
                          placeholder={`Pegá acá la URL de tu ${red.tipo}`}
                          onChangeText={(text) => {
                            const nuevasRedes = values.redes.map((r) =>
                              r.tipo === red.tipo ? { ...r, url: text } : r,
                            );
                            setFieldValue('redes', nuevasRedes);
                          }}
                          style={[styles.input, { flex: 1, marginBottom: 0 }]}
                          theme={{ roundness: 30 }}
                        />
                        <Button
                          compact
                          mode="text"
                          onPress={() => {
                            const nuevasRedes = values.redes.filter(
                              (r) => r.tipo !== red.tipo,
                            );
                            setFieldValue('redes', nuevasRedes);
                          }}
                        >
                          Quitar
                        </Button>
                      </View>
                    ))}
                  </View>
                )}
                <Button
                  onPress={handleSubmit as any}
                  mode="contained"
                  style={styles.boton}
                >
                  Guardar cambios
                </Button>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 30,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  dropdown: {
    borderRadius: 30,
    marginBottom: 10,
  },
  boton: {
    marginTop: 20,
    backgroundColor: '#000',
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 10,
  },
  redesContainer: {
    margin: 10,
  },
  redItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default EditarPerfilScreen;
