import {
  View,
  Image,
  StyleSheet,
  ViewStyle,
  StyleProp,
  ImageProps,
} from 'react-native';
import React from 'react';

interface JobsyHeaderProps {
  headerTitle: string;
  styles?: {
    [key: string]: StyleProp<ViewStyle>;
    logo?: StyleProp<ImageProps>;
  };
}
const JobsyHeader = ({ headerTitle, styles }: JobsyHeaderProps) => {
  return (
    <View style={StyleSheet.flatten(styles?.headerContainer)}>
      <Image
        source={require('../../assets/images/logo/logo-jobsy-favicon-jobsy-byn.png')}
        style={(styles?.logo && { ...StyleSheet.flatten(styles.logo) }) || ''}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#000000',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
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
