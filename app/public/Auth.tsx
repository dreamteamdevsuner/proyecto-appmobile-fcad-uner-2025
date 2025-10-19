import {
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { useEffect } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Logo from '../../components/Logo';
import AuthForm from '../../components/AuthForm';

import { Button, Text } from 'react-native-paper';
import supabase from '../../supabase/supabase';
import PUBLIC_NAVIGATOR_ROUTES from './PUBLIC_NAVIGATOR_ROUTES';
//TODO move a su component
export const Divider = () => {
  // TODO GRIS MOVER A PALETTE DESPUES
  //  #cac4d0
  // TODO GRIS MOVER A PALETTE DESPUES
  const styles = StyleSheet.create({
    divider: {
      marginVertical: 30,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    dividerDecoration: {
      backgroundColor: '#cac4d0',

      height: 1.2,

      width: 106.83,
    },
  });
  return (
    <View style={styles.divider}>
      <View style={styles.dividerDecoration}></View>
      <Text variant="labelSmall"> o Inicia con</Text>
      <View style={styles.dividerDecoration}></View>
    </View>
  );
};

//Provisorio reemplazar el Record
interface RouteProps extends NativeStackScreenProps<Record<string, any>> {}
const Auth = ({ navigation }: RouteProps) => {
  useEffect(() => {
    supabase
      .from('publicacion')
      .select()
      .then(({ data, error }) => {
        if (error) {
          console.log('errrrrr', error);
        }
        console.log('data', data);
      });
  }, []);

  return (
    <View style={{ paddingHorizontal: 60, paddingTop: 40 }}>
      <Logo></Logo>
      <AuthForm></AuthForm>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginTop: 40,
          justifyContent: 'center',
        }}
      >
        <Text variant="labelMedium">No tengo cuenta.</Text>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate(PUBLIC_NAVIGATOR_ROUTES.SIGN_UP)}
        >
          <Text
            variant="labelMedium"
            style={{
              textDecorationLine: 'underline',
              textDecorationStyle: 'solid',
              textDecorationColor: 'white',
              borderBottomColor: 'white',
              borderBottomWidth: 1.5,
            }}
          >
            Registrarme
          </Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

export default Auth;
