import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PrivateStackParamList } from '../../navigator/types';
import Favoritos from '.';
import FavoritosOferta from '../favoritos-oferta';
import ROUTES from '../../navigator/routes';
import Conversacion from '../conversacion';

const FavoritosStack = createNativeStackNavigator<PrivateStackParamList>();

const FavoritosNavigator = () => (
  <FavoritosStack.Navigator>
    <FavoritosStack.Screen
      name={ROUTES.RECRUITER_FAVORITOS}
      component={Favoritos}
    />
    <FavoritosStack.Screen
      name={ROUTES.RECRUITER_FAVORITOS_OFERTA}
      component={FavoritosOferta}
    />
    <FavoritosStack.Screen
      name={ROUTES.RECRUITER_CONVERSACION}
      component={Conversacion}
    />
  </FavoritosStack.Navigator>
);
export default FavoritosNavigator;
