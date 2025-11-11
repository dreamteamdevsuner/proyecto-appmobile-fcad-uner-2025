import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SeguridadScreen from '../shared/perfil/ajustes/SeguridadScreen';
import DatosCuentaScreen from '../shared/perfil/ajustes/DatosCuentaScreen';
import CambiarContrasenaScreen from '../shared/perfil/ajustes/CambiarContasenaScreen';
import EditarPerfilScreen from '../shared/perfil/ajustes/EditarPerfilScreen';

import PRIVATE_NAVIGATOR_ROUTES from './privateNavigatorRoutes';

import PrivateHomeScreen from '../PrivateHomeScreen';
import { useAuth } from '@appContext/authContext';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../../../supabase/supabaseClient';
import { useUserProfile } from '../../../hooks/useUserProfile';
export const privateNavigatorRootParams = {
  HomeScreen: {},
  [PRIVATE_NAVIGATOR_ROUTES.EDITAR_PERFIL]: undefined,
  [PRIVATE_NAVIGATOR_ROUTES.SEGURIDAD]: undefined,
  [PRIVATE_NAVIGATOR_ROUTES.DATOS_CUENTA]: undefined,
  [PRIVATE_NAVIGATOR_ROUTES.CAMBIAR_CONTRASENA]: undefined,
};

const Stack = createNativeStackNavigator<typeof privateNavigatorRootParams>();
const PrivateNavigator = () => {
  const { state} = useAuth()
  const { onRefresh} = useUserProfile(state.user?.id)
  useEffect(() => {
    let loggedUserUpdatesListener: RealtimeChannel;
    if (state.user) {
      console.log('listening');

      // Assuming a 'profiles' table with user-specific data
      loggedUserUpdatesListener = supabase
        .channel('public:usuario')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'usuario',
            filter: `id=eq.${state.user.id}`,
          },
          async (payload) => {
            console.log('Profile updated:', payload.new);
            console.log('UPDATING ');
            await onRefresh()
            // Update UI or application state with new profile data
          },
        )
        .subscribe();
    }
    return () => {
      
      if (loggedUserUpdatesListener) {
         
        loggedUserUpdatesListener.unsubscribe();
      }
    };
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, orientation: 'portrait' }}
    >
      <Stack.Screen
        name={PRIVATE_NAVIGATOR_ROUTES.HOME_SCREEN}
        component={PrivateHomeScreen}
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
