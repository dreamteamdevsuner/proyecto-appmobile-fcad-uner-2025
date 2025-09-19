import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PrivateStackParamList } from '../../navigator/types';
import { KeyboardAvoidingView } from 'react-native';
import ROUTES from '../../navigator/routes';
import { ProfileScreen } from '.';

const ProfileStack = createNativeStackNavigator<PrivateStackParamList>();

const ProfileNavigator = () => (
  <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name={ROUTES.PROFILE}
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
    </ProfileStack.Navigator>
  </KeyboardAvoidingView>
);
export default ProfileNavigator;
