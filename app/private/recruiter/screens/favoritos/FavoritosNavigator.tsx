import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Favoritos from '.';
import FavoritosOferta from '../favoritos-oferta';
import ROUTES from '../../navigator/routes';
import CAND_ROUTES from '../../../candidates/navigator/routes';
import Conversacion from '../conversacion';
import { KeyboardAvoidingView, Platform } from 'react-native';
import ProfileScreen from '../../../candidates/screens/perfil';
import { PrivateStackParamList as RecruiterStackParamList } from '../../navigator/types';
import { PrivateStackParamList as CandidateStackParamList } from '../../../candidates/navigator/types';

type CombinedStackParamList = RecruiterStackParamList & CandidateStackParamList;

const FavoritosStack = createNativeStackNavigator<CombinedStackParamList>();

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
          orientation: 'default',
        })}
      />
      <FavoritosStack.Screen
        name={ROUTES.RECRUITER_CONVERSACION}
        component={Conversacion}
        options={({ route }) => ({
          title: route.params?.title ?? 'Conversación',
          orientation: 'default',
        })}
      />
      <FavoritosStack.Screen
        name={CAND_ROUTES.CANDIDATE_PROFILE}
        component={ProfileScreen}
        options={{
          title: 'Favoritos',
        }}
      />
    </FavoritosStack.Navigator>
  </KeyboardAvoidingView>
);
export default FavoritosNavigator;
