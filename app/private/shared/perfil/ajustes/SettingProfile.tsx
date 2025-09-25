import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { List, Divider, Portal, Dialog, Button } from 'react-native-paper';
import { AUTH_ACTIONS, useAuth } from '../../../../../appContext/authContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { useNavigation } from '@react-navigation/native';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function SettingProfileScreen() {
  const [dialogVisible, setDialogVisible] = useState(false);
  const { logout } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  const showDialog = () => setDialogVisible(true);
  const hideDialog = () => setDialogVisible(false);

  const handleLogout = () => {
    logout();
    hideDialog();
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Card con opciones */}
      <View style={styles.card}>
        <List.Item
          title="Cerrar Sesión"
          left={(props) => <List.Icon {...props} icon="power" />}
          onPress={showDialog}
        />
        <Divider />
        <List.Item
          title="Editar perfil"
          left={(props) => <List.Icon {...props} icon="pencil-outline" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('EditarPerfil')}
        />
        <Divider />
        <List.Item
          title="Seguridad"
          left={(props) => <List.Icon {...props} icon="shield-outline" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('Seguridad')}
        />
      </View>

      {/* Dialogo de cerrar sesión */}
      <Portal>
        <Dialog
          visible={dialogVisible}
          onDismiss={hideDialog}
          style={styles.dialog}
        >
          <Dialog.Title>Cerrar sesión</Dialog.Title>
          <Dialog.Content>
            <Text>¿Estás seguro de que querés cerrar sesión?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancelar</Button>
            <Button
              mode="contained"
              onPress={() => {
                handleLogout();
              }}
            >
              Aceptar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  card: {
    margin: 16,
    backgroundColor: '#F8EEF6', // rosado claro
    borderRadius: 20,
    overflow: 'hidden',
  },
  dialog: {
    borderRadius: 30,
  },
});
