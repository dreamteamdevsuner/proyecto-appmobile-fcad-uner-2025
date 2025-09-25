import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Role, useAuth } from '../../appContext/authContext';
import RecruiterNavigator from './recruiter/navigator/RecruiterNavigator';
import CandidateNavigator from './candidates/navigator/CandidateNavigator';
import SeguridadScreen from './shared/perfil/ajustes/SeguridadScreen';
import DatosCuentaScreen from './shared/perfil/ajustes/DatosCuentaScreen';
import CambiarContrasenaScreen from './shared/perfil/ajustes/CambiarContasenaScreen';
import EditarPerfilScreen from './shared/perfil/ajustes/EditarPerfilScreen';
const Stack = createNativeStackNavigator();
const PrivateNavigator = () => {
  const { state } = useAuth();

  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{ headerShown: false, orientation: 'portrait' }}
    >
      <Stack.Screen
        name="HomeScreen"
        component={
          state.user?.role === Role.candidate
            ? CandidateNavigator
            : RecruiterNavigator
        }
      ></Stack.Screen>
      <Stack.Screen
        name="EditarPerfil"
        component={EditarPerfilScreen}
        options={{ headerShown: true, title: 'Editar perfil' }}
      />
      <Stack.Screen
        name="Seguridad"
        component={SeguridadScreen}
        options={{
          headerShown: true,
          title: 'Seguridad',
        }}
      />
      <Stack.Screen
        name="DatosCuenta"
        component={DatosCuentaScreen}
        options={{
          headerShown: true,
          title: 'Datos de la cuenta',
        }}
      />
      <Stack.Screen
        name="CambiarContrasena"
        component={CambiarContrasenaScreen}
        options={{
          headerShown: true,
          title: 'Cambiar contraseña',
        }}
      />
    </Stack.Navigator>
  );
};

export default PrivateNavigator;
