import { View, Image, StyleSheet } from 'react-native';
import React from 'react';

const JobsyHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <Image
        source={require('../../assets/images/logo/logo-jobsy-favicon-jobsy-byn.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#000000', // negro del fondo
    alignItems: 'left',
    justifyContent: 'left',
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: '100%',
  },
  logo: {
    width: 120, // ajustá el tamaño según el diseño
    height: 40,
  },
});

export default JobsyHeader;
