import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PrivateStackParamList } from '../../navigator/types';
import Favoritos from '.';
import FavoritosOferta from '../favoritos-oferta';
import ROUTES from '../../navigator/routes';
import Conversacion from '../conversacion';
import { KeyboardAvoidingView, Platform } from 'react-native';

const FavoritosStack = createNativeStackNavigator<PrivateStackParamList>();

const FavoritosNavigator = () => (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={30}
  >
    <FavoritosStack.Navigator>
      <FavoritosStack.Screen
        name={ROUTES.RECRUITER_FAVORITOS}
        component={Favoritos}
        options={{ title: 'Favoritos' }}
      />
      <FavoritosStack.Screen
        name={ROUTES.RECRUITER_FAVORITOS_OFERTA}
        component={FavoritosOferta}
        options={({ route }) => ({
          title: route.params?.title ?? 'Oferta',
        })}
      />
      <FavoritosStack.Screen
        name={ROUTES.RECRUITER_CONVERSACION}
        component={Conversacion}
        options={({ route }) => ({
          title: route.params?.title ?? 'Conversación',
        })}
      />
    </FavoritosStack.Navigator>
  </KeyboardAvoidingView>
);
export default FavoritosNavigator;
