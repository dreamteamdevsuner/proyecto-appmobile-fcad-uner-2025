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

import { Text } from 'react-native-paper';
// import supabase from '../../supabase/supabase';
import PUBLIC_NAVIGATOR_ROUTES from './PUBLIC_NAVIGATOR_ROUTES';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

//Provisorio reemplazar el Record
interface RouteProps extends NativeStackScreenProps<Record<string, any>> {}
const Auth = ({ navigation }: RouteProps) => {
  return (
    <KeyboardAwareScrollView bottomOffset={50}>
      <View style={{ paddingHorizontal: 60, paddingTop: 40 }}>
        <Logo></Logo>
        <AuthForm navigation={navigation}></AuthForm>

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
    </KeyboardAwareScrollView>
  );
};

export default Auth;
