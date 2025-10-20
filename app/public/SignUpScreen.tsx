import { View, Text } from 'react-native';
import React from 'react';
import Logo from '../../components/Logo';
import SignUpForm from '../../components/SignUpForm';

const SignUpScreen = () => {
  return (
    <View style={{ paddingHorizontal: 60, paddingTop: 40, flex: 1 }}>
      <Logo></Logo>
      <SignUpForm></SignUpForm>
    </View>
  );
};

export default SignUpScreen;
