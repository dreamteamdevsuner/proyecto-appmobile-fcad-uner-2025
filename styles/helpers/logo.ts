import { StyleSheet } from 'react-native';
import { LOGO } from '../../constants/ui/logo';

export const logoStyles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
    marginTop: 60,
  },
  logoImage: {
    width: 180,
    height: 180,
    borderRadius: 20,
  },
});
