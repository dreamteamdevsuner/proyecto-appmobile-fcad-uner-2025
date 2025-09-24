import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, Text as RNText } from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Formik } from "formik";
import DropDownPicker from "react-native-dropdown-picker";

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
  preferenciasSeleccionadas: string[]; 
  email: string;
  redes: { tipo: string; url: string }[];
}

const initialValues: PerfilValues = {
  nombre: "",
  apellido: "",
  profesion: "",
  localizacion: "",
  herramientas: [],
  habilidades: [],
  aboutMe: "",
  estudiosFormales: "",
  otrosEstudios: "",
  idiomasSeleccionados: [],
  preferenciasSeleccionadas: [],
  email: "",
  redes: [],
};

const localizacionList = [
  { label: "Argentina", value: "argentina" },
  { label: "Chile", value: "chile" },
  { label: "Uruguay", value: "uruguay" },
  { label: "México", value: "mexico" },
];

// Herramientas y habilidades
const herramientasList = [
  { label: "Figma", value: "figma" },
  { label: "Sketch", value: "sketch" },
  { label: "Photoshop", value: "photoshop" },
  { label: "Illustrator", value: "illustrator" },
  { label: "VSCode", value: "vscode" },
];

const habilidadesList = [
  { label: "Diseño UI", value: "ui" },
  { label: "Prototipado", value: "prototipado" },
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "Gestión", value: "gestion" },
];

// Idiomas + niveles
const idiomasCompleto = [
  { label: "Inglés", value: "header_ingles", selectable: false },
  { label: "Inglés - A1", value: "ingles_a1" },
  { label: "Inglés - A2", value: "ingles_a2" },
  { label: "Inglés - B1", value: "ingles_b1" },
  { label: "Inglés - B2", value: "ingles_b2" },
  { label: "Inglés - C1", value: "ingles_c1" },
  { label: "Inglés - C2", value: "ingles_c2" },
  { label: "Inglés - Nativo", value: "ingles_nativo" },

  { label: "Español", value: "header_espanol", selectable: false },
  { label: "Español - A1", value: "espanol_a1" },
  { label: "Español - A2", value: "espanol_a2" },
  { label: "Español - B1", value: "espanol_b1" },
  { label: "Español - B2", value: "espanol_b2" },
  { label: "Español - C1", value: "espanol_c1" },
  { label: "Español - C2", value: "espanol_c2" },
  { label: "Español - Nativo", value: "espanol_nativo" },

  { label: "Portugués", value: "header_portugues", selectable: false },
  { label: "Portugués - A1", value: "portugues_a1" },
  { label: "Portugués - A2", value: "portugues_a2" },
  { label: "Portugués - B1", value: "portugues_b1" },
  { label: "Portugués - B2", value: "portugues_b2" },
  { label: "Portugués - C1", value: "portugues_c1" },
  { label: "Portugués - C2", value: "portugues_c2" },
  { label: "Portugués - Nativo", value: "portugues_nativo" },
];

// Preferencias unificadas
const preferenciasList = [
  { label: "Modalidad", value: "header_modalidad", selectable: false },
  { label: "Remoto", value: "remoto" },
  { label: "Presencial", value: "presencial" },
  { label: "Híbrido", value: "hibrido" },

  { label: "Jornada", value: "header_jornada", selectable: false },
  { label: "Media jornada", value: "media jornada" },
  { label: "Jornada completa", value: "jornada completa" },
  { label: "Proyecto", value: "proyecto" },

  { label: "Contrato", value: "header_contrato", selectable: false },
  { label: "Inmediato", value: "inmediato" },
  { label: "Proceso de selección", value: "proceso_seleccion" },
];

const redesList = [
  { label: "Behance", value: "Behance" },
  { label: "GitHub", value: "GitHub" },
  { label: "Instagram", value: "Instagram" },
  { label: "LinkedIn", value: "LinkedIn" },
  { label: "Web", value: "Web" },
];


const renderListItem = (props: any) => {
  const { item, onPress } = props;
  const isHeader = item.selectable === false;

  return (
    <TouchableOpacity
      activeOpacity={isHeader ? 1 : 0.7}
      onPress={() => {
        if (isHeader) return;
        onPress?.();
      }}
      style={{
          paddingVertical: 12,
          paddingHorizontal: 16,
          backgroundColor: isHeader ? '#F8EEF6' : 'white',
        }}
      >
      <RNText
        style={{
          fontWeight: isHeader ? "700" : "400",
          fontSize: isHeader ? 15 : 14,
          color: isHeader ? "#333" : "#000",
        }}
      >
        {item.label}
      </RNText>
    </TouchableOpacity>  
  );
};

const EditarPerfilScreen = () => {
  const [localizacionOpen, setLocalizacionOpen] = useState(false);
  const [herramientasOpen, setHerramientasOpen] = useState(false);
  const [habilidadesOpen, setHabilidadesOpen] = useState(false);
  const [idiomasOpen, setIdiomasOpen] = useState(false);
  const [preferenciasOpen, setPreferenciasOpen] = useState(false);
  const [redesOpen, setRedesOpen] = useState(false);
  const [redSeleccionada, setRedSeleccionada] = useState<string | null>(null);

  const handleSubmit = (values: PerfilValues) => {
    //Aquí iría la lógica para enviar los datos al backend
    console.log("Perfil actualizado:" , values);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>  
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ handleChange, handleBlur, handleSubmit, values, setFieldValue }) => (
            <View>
              {/* DATOS PERSONALES */}
              <Text style={styles.titulo}>Nombre</Text>
              <TextInput
                mode="outlined"
                onChangeText={handleChange("nombre")}
                onBlur={handleBlur("nombre")}
                value={values.nombre}
                placeholder="Ingresá tu nombre"
                style={styles.input}
                theme={{ roundness: 30 }}
              />

              <Text style={styles.titulo}>Apellido</Text>
              <TextInput
                mode="outlined"
                onChangeText={handleChange("apellido")}
                onBlur={handleBlur("apellido")}
                value={values.apellido}
                placeholder="Ingresá tu apellido"
                style={styles.input}
                theme={{ roundness: 30 }}
              />

              <Text style={styles.titulo}>Profesión</Text>
              <TextInput
                mode="outlined"
                onChangeText={handleChange("profesion")}
                onBlur={handleBlur("profesion")}
                value={values.profesion}
                placeholder="Ej: Diseñador UX/UI"
                style={styles.input}
                theme={{ roundness: 30 }}
              />

              <Text style={styles.titulo}>Localización</Text>
              <DropDownPicker
                open={localizacionOpen}
                setOpen={setLocalizacionOpen}
                value={values.localizacion}
                setValue={(callback) =>
                  setFieldValue("localizacion", callback(values.localizacion))}
                items={localizacionList}
                placeholder="Selecciona ubicación"
                style={styles.dropdown}
                zIndex={6000}
                listMode="SCROLLVIEW"
              />

              {/* HERRAMIENTAS */}
              <Text style={styles.titulo}>Herramientas</Text>
              <DropDownPicker
                open={herramientasOpen}
                setOpen={setHerramientasOpen}
                value={values.herramientas}
                setValue={(callback) =>
                  setFieldValue("herramientas", callback(values.herramientas))
                }
                items={herramientasList}
                placeholder="Selecciona herramientas"
                style={styles.dropdown}
                multiple={true}
                mode="BADGE"
                listMode="MODAL"
                zIndex={5000}
              />

              {/* HABILIDADES */}
              <Text style={styles.titulo}>Habilidades</Text>
              <DropDownPicker
                open={habilidadesOpen}
                setOpen={setHabilidadesOpen}
                value={values.habilidades}
                setValue={(callback) =>
                  setFieldValue("habilidades", callback(values.habilidades))}
                items={habilidadesList}
                placeholder="Selecciona habilidades"
                style={styles.dropdown}
                multiple={true}
                mode="BADGE"
                listMode="MODAL"
                zIndex={2000}
              />

              {/* SOBRE MÍ */}
              <Text style={styles.titulo}>Sobre mí</Text>
              <TextInput
                mode="outlined"
                style={styles.input}
                onChangeText={handleChange("aboutMe")}
                onBlur={handleBlur("aboutMe")}
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
                onChangeText={handleChange("estudiosFormales")}
                onBlur={handleBlur("estudiosFormales")}
                value={values.estudiosFormales}
                placeholder="Descripción"
                multiline
                theme={{ roundness: 30 }}
              />

              <Text style={styles.titulo}>Otros estudios</Text>
              <TextInput
                mode="outlined"
                style={styles.input}
                onChangeText={handleChange("otrosEstudios")}
                onBlur={handleBlur("otrosEstudios")}
                value={values.otrosEstudios}
                placeholder="Descripción"
                multiline
                theme={{ roundness: 30 }}
              />

              {/* IDIOMAS */}
              <Text style={styles.titulo}>Idiomas</Text>
              <DropDownPicker
                open={idiomasOpen}
                setOpen={setIdiomasOpen}
                value={values.idiomasSeleccionados}
                setValue={(cb) =>
                  setFieldValue("idiomasSeleccionados", cb(values.idiomasSeleccionados))}
                items={idiomasCompleto}
                placeholder="Selecciona idiomas y niveles"
                style={styles.dropdown}
                multiple
                mode="BADGE"
                listMode="MODAL"
                zIndex={3000}
                renderListItem={renderListItem}
              />

              {/* PREFERENCIAS */}
              <Text style={styles.titulo}>Preferencias</Text>
              <DropDownPicker
                open={preferenciasOpen}
                setOpen={setPreferenciasOpen}
                value={values.preferenciasSeleccionadas}
                setValue={(cb) =>
                  setFieldValue("preferenciasSeleccionadas", cb(values.preferenciasSeleccionadas))}
                items={preferenciasList}
                placeholder="Selecciona modalidad, jornada y contrato"
                style={styles.dropdown}
                multiple
                mode="BADGE"
                listMode="MODAL"
                zIndex={2000}
                renderListItem={renderListItem}
              />

              {/* CONTACTO */}
              <Text style={styles.titulo}>Correo electrónico</Text>
              <TextInput
                mode="outlined"
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                value={values.email}
                placeholder="Escribe tu correo"
                style={styles.input}
                theme={{ roundness: 30 }}
              />
              
              {/* REDES */}
              <RNText style={styles.titulo}>Redes</RNText>
              <DropDownPicker
                open={redesOpen}
                setOpen={setRedesOpen}
                value={redSeleccionada}
                setValue={setRedSeleccionada}
                items={redesList}
                placeholder="Selecciona tus red"
                style={styles.dropdown}
                listMode="MODAL"
                zIndex={1000}
              />
              {redSeleccionada && (
                <TextInput 
                mode="outlined"
                value={values.redes.find((r) => r.tipo === redSeleccionada)?.url || ""}
                placeholder={`Pegá acá la URL de tu ${redSeleccionada}`}
                onChangeText={(text) => {
                  let nuevasRedes = [...values.redes];
                  const idx = nuevasRedes.findIndex((r) => r.tipo === redSeleccionada);
                  if (idx > -1) {
                    nuevasRedes[idx].url = text;
                  } else {
                    nuevasRedes.push({ tipo: redSeleccionada, url: text});
                  }
                  setFieldValue("redes", nuevasRedes);
                }}
                style={styles.input}
                theme={{ roundness: 30 }}
              />
            )}
            {values.redes.length > 0 && (
              <View style={{ margin: 10}}>
                {values.redes.map((red, idx) =>
                <View 
                  key={`${red.tipo}_${idx}`}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 5
                  }}
                >
                  <RNText style={{ fontSize: 14 }}>
                    {red.tipo}: {red.url || "(sin URL)"}
                  </RNText>
                  <Button 
                    compact
                    mode="text"
                    onPress={() => {
                      const nuevasRedes = values.redes.filter((r) => r.tipo !== red.tipo);
                      setFieldValue("redes", nuevasRedes);
                      if (redSeleccionada === red.tipo) {
                        setRedSeleccionada(null);
                      }
                    }}
                  >Quitar
                  </Button>              
                </View>
              )}
            </View>
          )}          

            {/* BOTÓN GUARDAR */}
            <Button
              onPress={handleSubmit as any}
              mode="contained"
              style={styles.boton}
            >Guardar cambios
            </Button>
          </View>
        )}
      </Formik>
    </ScrollView>
  </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, backgroundColor: "#fff" },
  input: {
    borderWidth: 0.5,
    borderColor: "#ccc",
    borderRadius: 30,
    marginBottom: 10,
    backgroundColor: "white",
  },
  dropdown: { 
    borderRadius: 30, 
    marginBottom: 10, 
   },
  boton: { 
    marginTop: 20, 
    backgroundColor: "#000"
   },
  titulo: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 10,
  },
});

export default EditarPerfilScreen;
