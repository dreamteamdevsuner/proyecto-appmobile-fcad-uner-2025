import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PrivateStackParamList } from '../../navigator/types';
import ROUTES from '../../navigator/routes';
import Mensajeria from '.';
import Conversacion from '../conversacion';
import { KeyboardAvoidingView, Platform } from 'react-native';

const MensajeriaStack = createNativeStackNavigator<PrivateStackParamList>();

const MensajeriaNavigator = () => (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={30}
  >
    <MensajeriaStack.Navigator>
      <MensajeriaStack.Screen
        name={ROUTES.RECRUITER_MENSAJERIA}
        component={Mensajeria}
        options={{ title: 'Mensajería', orientation: 'default' }}
      />
      <MensajeriaStack.Screen
        name={ROUTES.RECRUITER_CONVERSACION}
        component={Conversacion}
        options={({ route }) => ({
          title: route.params?.title ?? 'Conversación',
          orientation: 'default',
        })}
      />
    </MensajeriaStack.Navigator>
  </KeyboardAvoidingView>
);
export default MensajeriaNavigator;
