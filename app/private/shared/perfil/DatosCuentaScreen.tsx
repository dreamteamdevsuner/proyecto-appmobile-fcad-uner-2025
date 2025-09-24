import React, { useState } from "react";  
import { SafeAreaView } from "react-native-safe-area-context";
import { Formik } from "formik";
import { TextInput, Button, Text, Dialog, Portal } from "react-native-paper";
import { StyleSheet } from "react-native";

export default function DatosCuentaScreen() {
  const [dialogVisible, setDialogVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.sectionTitle}>Mantené siempre actualizados tus datos</Text>

      <Formik
        initialValues={{ 
          email: "", 
          correoAsociado: "",
          telefono: "",
        }}
        onSubmit={(values) => {
          console.log("Datos guardados: ", values);
          setDialogVisible(true);
      }}
      >
        {({ handleChange, handleSubmit, values }) => (
          <>
            <TextInput
              label="Correo electrónico"
              value={values.email}
              onChangeText={handleChange("email")}
              style={styles.input}
              mode="outlined"
              theme={{ roundness: 30 }}
            />
            <TextInput
              label="Correo asociado"
              value={values.correoAsociado}
              onChangeText={handleChange("correoAsociado")}
              style={styles.input}
              mode="outlined"
              theme={{ roundness: 30 }}

            />
            <TextInput
              label="Teléfono"
              value={values.telefono}
              onChangeText={handleChange("telefono")}
              style={styles.input}
              mode="outlined"
              theme={{ roundness: 30 }}
           />

            <Button mode="contained" style={styles.button} onPress={() => handleSubmit()}>
              Guardar cambios
            </Button>
            <Portal>
              <Dialog
                visible={dialogVisible}
                onDismiss={() => setDialogVisible(false)}
                style={{ borderRadius: 20}}
              >
                <Dialog.Title>Datos guardados</Dialog.Title>
                <Dialog.Content>
                  <Text>Los datos de tu cuenta han sido actualizados correctamente.</Text>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={() => setDialogVisible(false)}>OK</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </>
        )}
      </Formik>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  sectionTitle: { fontSize: 16, 
    fontWeight: "bold", 
    marginTop: 5,
    marginVertical: 20,
    textAlign: "center"
  },
  input: {
    marginHorizontal: 40,    
    marginBottom: 10,
    backgroundColor: 'white',
  },
  button: {
    margin: 40,
    marginVertical: 200,
    backgroundColor: 'black'
  },
});