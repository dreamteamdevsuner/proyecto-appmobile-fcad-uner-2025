import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PrivateStackParamList } from '../../../candidates/navigator/types';
import ROUTES from '../../../candidates/navigator/routes';
import Mensajeria from '../../../candidates/screens/mensajeria';
import ConversacionProfesional from '../conversacionProfesional';
import { KeyboardAvoidingView, Platform } from 'react-native';

const MensajeriaStack = createNativeStackNavigator<PrivateStackParamList>();

const MensajeriaNavigator = () => (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={90}
  >
    <MensajeriaStack.Navigator>
      <MensajeriaStack.Screen
        name={ROUTES.CANDIDATE_MENSAJERIA}
        component={Mensajeria}
        options={{ title: 'Chats', orientation: 'default' }}
      />
      <MensajeriaStack.Screen
        name={ROUTES.CANDIDATE_CONVERSACION}
        component={ConversacionProfesional}
        options={({ route }) => ({
          title: route.params?.title ?? 'Conversación',
          orientation: 'default',
        })}
      />
    </MensajeriaStack.Navigator>
  </KeyboardAvoidingView>
);
export default MensajeriaNavigator;
