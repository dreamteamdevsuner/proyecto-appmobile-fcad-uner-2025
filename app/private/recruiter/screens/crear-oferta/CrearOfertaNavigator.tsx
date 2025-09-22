import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CrearOferta from '.';
import ROUTES from '../../navigator/routes';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { PrivateStackParamList as RecruiterStackParamList } from '../../navigator/types';

const CrearOfertaStack = createNativeStackNavigator<RecruiterStackParamList>();

const CrearOfertaNavigator = () => (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={30}
  >
    <CrearOfertaStack.Navigator>
      <CrearOfertaStack.Screen
        name={ROUTES.RECRUITER_CREAR_OFERTA}
        component={CrearOferta}
        options={{ title: 'Nueva Oferta' }}
      />
    </CrearOfertaStack.Navigator>
  </KeyboardAvoidingView>
);
export default CrearOfertaNavigator;
