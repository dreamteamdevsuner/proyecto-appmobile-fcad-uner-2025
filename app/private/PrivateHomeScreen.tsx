import { View, Text, Button } from 'react-native';
import React from 'react';
import { useAuth } from '../../appContext/authContext';

import CandidateNavigator from './candidates/navigator/CandidateNavigator';
import RecruiterNavigator from './recruiter/navigator/RecruiterNavigator';
import { Role } from '@services/interfaces/TipoUsuario.interface';

const PrivateHomeScreen = () => {
  const {
    state: { user, loading },
    logout,
  } = useAuth();
  if (loading) {
    return <View style={{ flex: 1 }}>Loading</View>;
  }
  if (!user) {
    return (
      <View style={{ flex: 1 }}>
        <Text>Error getting user</Text>
      </View>
    );
  }

  return user?.tipousuario.nombre === Role.PROFESIONAL ? (
    <CandidateNavigator></CandidateNavigator>
  ) : (
    <RecruiterNavigator></RecruiterNavigator>
  );
};

export default PrivateHomeScreen;
