import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../../../appContext/authContext';
import RecruiterNavigator from '../recruiter/navigator/RecruiterNavigator';
import CandidateNavigator from '../candidates/navigator/CandidateNavigator';
import SeguridadScreen from '../shared/perfil/ajustes/SeguridadScreen';
import DatosCuentaScreen from '../shared/perfil/ajustes/DatosCuentaScreen';
import CambiarContrasenaScreen from '../shared/perfil/ajustes/CambiarContasenaScreen';
import EditarPerfilScreen from '../shared/perfil/ajustes/EditarPerfilScreen';

import PRIVATE_NAVIGATOR_ROUTES from './privateNavigatorRoutes';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Role } from '@services/interfaces/TipoUsuario.interface';
import PrivateHomeScreen from '../PrivateHomeScreen';
export const privateNavigatorRootParams = {
  // [PRIVATE_NAVIGATOR_ROUTES.HOME_SCREEN]: undefined,
  HomeScreen: {},
  [PRIVATE_NAVIGATOR_ROUTES.EDITAR_PERFIL]: undefined,
  [PRIVATE_NAVIGATOR_ROUTES.SEGURIDAD]: undefined,
  [PRIVATE_NAVIGATOR_ROUTES.DATOS_CUENTA]: undefined,
  [PRIVATE_NAVIGATOR_ROUTES.CAMBIAR_CONTRASENA]: undefined,
};
const Test = () => {
  const {
    state: { loading, user },
    logout,
  } = useAuth();

  return (
    <View>
      <Text>Test</Text>
      <Text> {JSON.stringify(user)}</Text>
      <Button onPress={() => logout()}>
        <Text>Logout</Text>
      </Button>
    </View>
  );
};

const Stack = createNativeStackNavigator<typeof privateNavigatorRootParams>();
const PrivateNavigator = () => {
  const {
    state: { loading, user },
  } = useAuth();

  return (
    <Stack.Navigator
      // initialRouteName={PRIVATE_NAVIGATOR_ROUTES.HOME_SCREEN}
      screenOptions={{ headerShown: false, orientation: 'portrait' }}
    >
      <Stack.Screen
        name={PRIVATE_NAVIGATOR_ROUTES.HOME_SCREEN}
        // component={Test}
        component={PrivateHomeScreen}
        // component={CandidateNavigator}
        // component={
        //   loading && !user
        //     ? Test
        //     : user?.tipousuario?.nombre === Role.PROFESIONAL
        //       ? CandidateNavigator
        //       : RecruiterNavigator
        // }
      ></Stack.Screen>
      <Stack.Screen
        name={PRIVATE_NAVIGATOR_ROUTES.EDITAR_PERFIL}
        component={EditarPerfilScreen}
        options={{ headerShown: true, title: 'Editar perfil' }}
      />
      <Stack.Screen
        name={PRIVATE_NAVIGATOR_ROUTES.SEGURIDAD}
        component={SeguridadScreen}
        options={{
          headerShown: true,
          title: 'Seguridad',
        }}
      />
      <Stack.Screen
        name={PRIVATE_NAVIGATOR_ROUTES.DATOS_CUENTA}
        component={DatosCuentaScreen}
        options={{
          headerShown: true,
          title: 'Datos de la cuenta',
        }}
      />
      <Stack.Screen
        name={PRIVATE_NAVIGATOR_ROUTES.CAMBIAR_CONTRASENA}
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
