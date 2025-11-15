import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PrivateStackParamList } from '../../navigator/types';
import ROUTES from '../../navigator/routes';
import Mensajeria from '.';
import ConversacionRecruiter from '../conversacionRecruiter';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { Platform } from 'react-native';

const MensajeriaStack = createNativeStackNavigator<PrivateStackParamList>();

const MensajeriaNavigator = () => (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={90}
  >
    <MensajeriaStack.Navigator>
      <MensajeriaStack.Screen
        name={ROUTES.RECRUITER_MENSAJERIA}
        component={Mensajeria}
        options={{ title: 'Mensajería', orientation: 'default' }}
      />
      <MensajeriaStack.Screen
        name={ROUTES.RECRUITER_CONVERSACION}
        component={ConversacionRecruiter}
        options={({ route }) => ({
          title: route.params?.title ?? 'Conversación',
          orientation: 'default',
        })}
      />
    </MensajeriaStack.Navigator>
  </KeyboardAvoidingView>
);
export default MensajeriaNavigator;
