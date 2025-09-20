import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PrivateStackParamList } from '../../../candidates/navigator/types';
import ROUTES from '../../../candidates/navigator/routes';
import Mensajeria from '../../../candidates/screens/mensajeria';
import Conversacion from '../../../candidates/screens/conversacion';
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
        name={ROUTES.CANDIDATE_MENSAJERIA}
        component={Mensajeria}
        options={{ title: 'Mensajería' }}
      />
      <MensajeriaStack.Screen
        name={ROUTES.CANDIDATE_CONVERSACION}
        component={Conversacion}
        options={({ route }) => ({
          title: route.params?.title ?? 'Conversación',
        })}
      />
    </MensajeriaStack.Navigator>
  </KeyboardAvoidingView>
);
export default MensajeriaNavigator;
