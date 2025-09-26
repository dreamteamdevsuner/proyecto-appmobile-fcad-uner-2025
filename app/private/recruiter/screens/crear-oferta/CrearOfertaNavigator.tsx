import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CrearOferta from '.';
import OfertaScreen from '../oferta';
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
        options={{ title: 'Nueva Oferta', headerShown: true }}
      />
      <CrearOfertaStack.Screen
        name={ROUTES.RECRUITER_CREAR_OFERTA_PREVIEW}
        component={OfertaScreen}
        options={{ title: 'Preview', headerShown: true }}
      />
    </CrearOfertaStack.Navigator>
  </KeyboardAvoidingView>
);
export default CrearOfertaNavigator;
