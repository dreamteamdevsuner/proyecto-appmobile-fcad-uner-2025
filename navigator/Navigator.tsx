import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { useAuth } from '../appContext/authContext';
import PrivateNavigator from '../app/private/PrivateNavigator';
import PublicNavigator from '../app/public/PublicNavigator';

//Agregar Root Stack Params Luego
const Stack = createNativeStackNavigator();
const Navigator = () => {
  const { state } = useAuth();
  console.log(state);

  return state.user ? (
    <PrivateNavigator></PrivateNavigator>
  ) : (
    <PublicNavigator></PublicNavigator>
  );
};
export default Navigator;
