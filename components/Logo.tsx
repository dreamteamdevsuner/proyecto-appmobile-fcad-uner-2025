import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { logoStyles } from '../styles/helpers/logo';

const Logo = () => {
  return (
    <View style={logoStyles.logoContainer}>
      <Image
        source={require('../assets/images/logo/logo-jobsy-favicon-jobsy-byn.png')}
        style={logoStyles.logoImage}
        resizeMode="contain"
      />
    </View>
  );
};

export default Logo;
