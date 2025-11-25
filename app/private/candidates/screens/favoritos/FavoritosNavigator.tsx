import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { KeyboardAvoidingView, Platform } from 'react-native';
import ROUTES from '../../../candidates/navigator/routes';
import Favoritos from './index';
import FavoritosMatchsScreen from '../favoritos-matchs';
import FavoritosInteresantesScreen from '../favoritos-interesan';
import CandidateTestScreen from '../CandidateTestScreen';
import Conversacion from '../conversacionProfesional';
import { PrivateStackParamList } from '../../../candidates/navigator/types';
import JobsyHeader from '../../../../../components/ui/JobsyHeader';
import JobPostingScreen from '../jobPostingScreen/JobPostingScreen';

const FavoritosStack = createNativeStackNavigator<PrivateStackParamList>();

const FavoritosNavigator = () => (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={30}
  >
    <FavoritosStack.Navigator>
      <FavoritosStack.Screen
        name={ROUTES.CANDIDATE_FAVORITOS}
        component={Favoritos}
        options={{ title: 'Favoritos' }}
      />
      <FavoritosStack.Screen
        name={ROUTES.CANDIDATE_FAVORITOS_MATCHS}
        component={FavoritosMatchsScreen}
        options={{ title: 'Favoritos' }}
      />
      <FavoritosStack.Screen
        name={ROUTES.CANDIDATE_FAVORITOS_INTERESANTES}
        component={FavoritosInteresantesScreen}
        options={{ title: 'Favoritos' }}
      />
      <FavoritosStack.Screen
        name={ROUTES.CANDIDATE_TEST}
        component={CandidateTestScreen}
        options={{ title: 'Favoritos' }}
      />
      <FavoritosStack.Screen
        name={ROUTES.CANDIDATE_CONVERSACION}
        component={Conversacion}
        options={{ title: 'Conversación' }}
      />
      <FavoritosStack.Screen
        options={{ headerTitle: 'Descubrir ofertas' }}
        name={ROUTES.CANDIDATE_TAB_JOB_OFFER_SCREEN}
        component={JobPostingScreen}
      />
    </FavoritosStack.Navigator>
  </KeyboardAvoidingView>
);

export default FavoritosNavigator;
