import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { verifySignUpOtp } from '../../services/apiAuth';
import { useAuth } from '../../appContext/authContext';
import PUBLIC_NAVIGATOR_ROUTES from '@app/public/PUBLIC_NAVIGATOR_ROUTES';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PublicNavigatorParamList } from './PublicNavigator';

type VerificarCodigoProps = NativeStackScreenProps<
  PublicNavigatorParamList,
  PUBLIC_NAVIGATOR_ROUTES.VERIFY_REGISTER
>;

const VerificarCodigoScreen = ({ route }: VerificarCodigoProps) => {
  const theme = useTheme();
  const [token, setToken] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const { email } = route.params;

  const handleVerify = async () => {
    if (token.length !== 6 || !/^\d+$/.test(token)) {
      Alert.alert('Código inválido', 'El código debe tener 6 dígitos.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await verifySignUpOtp(email, token);
      if (!data.session) {
        throw new Error('No se pudo iniciar sesión.');
      }
    } catch (error: any) {
      setIsLoading(false);
      Alert.alert('Error', 'El código es incorrecto o ha expirado.');
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text variant="headlineSmall" style={styles.title}>
        Verificá tu correo electrónico
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
        Por favor  ingresá el código de 6 dígitos que enviamos a:
      </Text>
      <Text style={styles.email}>{email}</Text>

      <TextInput
        label="Código de 6 dígitos"
        value={token}
        onChangeText={setToken}
        maxLength={6}
        keyboardType="number-pad"
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleVerify}
        loading={isLoading}
        disabled={isLoading}
        style={styles.button}
      >
        Verificar y Entrar
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 5,
  },
  email: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    marginBottom: 20,
  },
  button: {
    padding: 5,
  },
});

export default VerificarCodigoScreen;
