import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CrearOferta from '.';
import OfertaScreen from '../oferta';
import ROUTES from '../../navigator/routes';
import { PrivateStackParamList as RecruiterStackParamList } from '../../navigator/types';
import EditarOferta from '../editar-oferta';

const CrearOfertaStack = createNativeStackNavigator<RecruiterStackParamList>();

const CrearOfertaNavigator = () => (
  <CrearOfertaStack.Navigator>
    <CrearOfertaStack.Screen
      name={ROUTES.RECRUITER_CREAR_OFERTA}
      component={CrearOferta}
      options={{ title: 'Nueva Oferta', headerShown: true }}
    />
    <CrearOfertaStack.Screen
      name={ROUTES.RECRUITER_EDITAR_OFERTA}
      component={EditarOferta}
      options={{ title: 'Editar Oferta', headerShown: true }}
    />
    <CrearOfertaStack.Screen
      name={ROUTES.RECRUITER_CREAR_OFERTA_PREVIEW}
      component={OfertaScreen}
      options={{ title: 'Preview', headerShown: true }}
    />
  </CrearOfertaStack.Navigator>
);
export default CrearOfertaNavigator;
