import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { TextInput, Button, Dialog, Portal } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";

const validationSchema = Yup.object().shape({
  actual: Yup.string().required("La contraseña actual es obligatoria"),
  nueva: Yup.string().min(6, "Mínimo 6 caracteres").required("Nueva contraseña obligatoria"),
  repetir: Yup.string()
    .oneOf([Yup.ref("nueva")], "Las contraseñas no coinciden")
    .required("Repite la nueva contraseña"),
});

export default function CambiarContrasenaScreen() {
  const [dialogVisible, setDialogVisible] = useState(false);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Creá una nueva contraseña</Text>

      <Formik
        initialValues={{ actual: "", nueva: "", repetir: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          setDialogVisible(true);
          console.log("Cambio de contraseña:", values);
        }}
      >
        {({ handleChange, handleSubmit, values, errors }) => (
          <>
            <TextInput
              label="Contraseña actual"
              value={values.actual}
              onChangeText={handleChange("actual")}
              secureTextEntry
              style={styles.input}
              error={!!errors.actual}
              mode="outlined"
              theme={{ roundness: 30 }}
            />

            <TextInput
              label="Nueva contraseña"
              value={values.nueva}
              onChangeText={handleChange("nueva")}
              secureTextEntry
              style={styles.input}
              error={!!errors.nueva}
              mode="outlined"
              theme={{ roundness: 30 }}
            />

            <TextInput
              label="Repetir nueva contraseña"
              value={values.repetir}
              onChangeText={handleChange("repetir")}
              secureTextEntry
              style={styles.input}
              error={!!errors.repetir}
              mode="outlined"
              theme={{ roundness: 30 }}
            />

            <Button mode="contained" style={styles.button} onPress={() => handleSubmit()}>
              Guardar contraseña
            </Button>
            <Portal>
              <Dialog
                visible={dialogVisible}
                onDismiss={() => setDialogVisible(false)}
                style={{ borderRadius: 20}}
              >
                <Dialog.Title>Contaseña actualizada</Dialog.Title>
                <Dialog.Content>
                  <Text style={{ color: '#EAEAEA' }}>La contraseña de tu cuenta ha sido actualizada correctamente.</Text>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button onPress={() => { setDialogVisible(false);
                    navigation.goBack();
                  }}
                  >OK</Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,
    padding: 16
  },
  sectionTitle: { fontSize: 16, 
    fontWeight: "bold", 
    marginTop: 5,
    marginVertical: 20,
    textAlign: "center"
  },
  input: { 
    marginHorizontal: 30,
    marginBottom: 10,
   },
  button: { margin: 40,
    marginVertical: 200,
    backgroundColor: '#beb53c',
   },
});
