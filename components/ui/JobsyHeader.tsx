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
    backgroundColor: '#000000',
    alignItems: 'left',
    justifyContent: 'left',
    margin: 0,
    padding: 0,
    width: '100%',
    height: 52,
  },
  logo: {
    width: 120,
    height: 48,
    marginLeft: -20,
  },
});

export default JobsyHeader;
