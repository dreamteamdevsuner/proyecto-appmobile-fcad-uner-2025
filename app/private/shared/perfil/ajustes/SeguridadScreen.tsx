import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet } from 'react-native';
import { List, Divider } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';

type NavigationProp = StackNavigationProp<RootStackParamList>;

export default function SeguridadScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <List.Item
          title="Datos de cuenta"
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('DatosCuenta')}
        />
        <Divider />
        <List.Item
          title="Cambiar contraseña"
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => navigation.navigate('CambiarContrasena')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
  },
  card: {
    margin: 16,
    borderRadius: 20,
    backgroundColor: '#1D1C21',
    overflow: 'hidden',
  },
});
