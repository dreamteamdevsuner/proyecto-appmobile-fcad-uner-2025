import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PrivateStackParamList } from '../../navigator/types';
import ROUTES from '../../navigator/routes';
import Mensajeria from '.';
import Conversacion from '../conversacion';

const MensajeriaStack = createNativeStackNavigator<PrivateStackParamList>();

const MensajeriaNavigator = () => (
  <MensajeriaStack.Navigator>
    <MensajeriaStack.Screen
      name={ROUTES.RECRUITER_MENSAJERIA}
      component={Mensajeria}
    />
    <MensajeriaStack.Screen
      name={ROUTES.RECRUITER_CONVERSACION}
      component={Conversacion}
    />
  </MensajeriaStack.Navigator>
);
export default MensajeriaNavigator;
