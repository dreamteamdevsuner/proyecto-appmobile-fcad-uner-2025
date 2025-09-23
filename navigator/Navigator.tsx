import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';

import { AuthContext } from '../appContext/authContext';
import PrivateNavigator from '../app/private/PrivateNavigator';
import PublicNavigator from '../app/public/PublicNavigator';

//Agregar Root Stack Params Luego
const Stack = createNativeStackNavigator();
const Navigator = () => {
  const { userState } = useContext(AuthContext);

  return userState.isLogged ? (
    <PrivateNavigator></PrivateNavigator>
  ) : (
    <PublicNavigator></PublicNavigator>
  );
};
export default Navigator;
