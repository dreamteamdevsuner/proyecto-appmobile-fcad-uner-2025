import React, { useState } from "react";  
import { SafeAreaView } from "react-native-safe-area-context";
import { Formik } from "formik";
import { TextInput, Button, Text, Dialog, Portal } from "react-native-paper";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from '../../../../../appContext/authContext';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Por favor, ingresa un correo válido')
    .required('El correo electrónico es obligatorio'),
  correoAsociado: Yup.string()
    .email('Por favor, ingresa un correo válido'),
  telefono: Yup.string(), // Opcional
});
export default function DatosCuentaScreen() {
  const [dialogVisible, setDialogVisible] = useState(false);
  const navigation = useNavigation();
  const { state } = useAuth();

  const userDatosCuenta = {
      email: state.user?.email || '',
      correoAsociado: "",
      telefono: "",
    };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.sectionTitle}>Mantené siempre actualizados tus datos</Text>

      <Formik
        initialValues={userDatosCuenta}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={(values) => {
          console.log("Datos guardados: ", values);
          setDialogVisible(true);
      }}
      >
        {({ handleChange, handleSubmit, values, errors, touched }) => (
          <>
            <TextInput
              label="Correo electrónico"
              value={values.email}
              onChangeText={handleChange("email")}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
              error={touched.email && !!errors.email}
            />
            {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <TextInput
              label="Correo asociado"
              value={values.correoAsociado}
              onChangeText={handleChange("correoAsociado")}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
              error={touched.correoAsociado && !!errors.correoAsociado}
            />
            {touched.correoAsociado && errors.correoAsociado && (
                  <Text style={styles.errorText}>{errors.correoAsociado}</Text>
            )}

            <TextInput
              label="Teléfono"
              value={values.telefono}
              onChangeText={handleChange("telefono")}
              style={styles.input}
              mode="outlined"
              keyboardType="phone-pad"            
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
                <Dialog.Title>Datos actualizados</Dialog.Title>
                <Dialog.Content>
                  <Text>Los datos de tu cuenta han sido actualizados correctamente.</Text>
                </Dialog.Content>
                <Dialog.Actions>
                  <Button 
                    mode="contained"
                    onPress={() => { 
                    setDialogVisible(false);
                    navigation.goBack(); 
                  }}                               
                >
                  OK</Button>
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
    padding: 16,
  },
  sectionTitle: { fontSize: 16, 
    fontWeight: "bold", 
    marginTop: 5,
    marginVertical: 20,
    textAlign: "center"
  },
  input: {
    marginHorizontal: 30,    
    marginBottom: 5,
  },
   errorText: {
    fontSize: 12,
    color: '#ff9b92',
    marginHorizontal: 40,
    marginBottom: 10,
  },
  button: {
    marginHorizontal: 20,
    marginVertical: 80,
    backgroundColor: '#BEB52C',
  },
});