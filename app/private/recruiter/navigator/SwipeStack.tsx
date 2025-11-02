import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ROUTES from './routes';
import JobsyHeader from '../../../../components/ui/JobsyHeader';
import RecruiterSwipeMatchScreen from '../screens/RecruiterSwipeMatchScreen';
import CandidatePortfolioScreen from '../screens/candidatePortfolioScreen/CandidatePortfolioSceen';

import ProfileNavigator from '../../candidates/screens/perfil/ProfileNavigator';
import ProfileScreen from '../../shared/perfil/ProfileScreen';
import CandidateProfileWrapper from '../../candidates/screens/perfil';
import {
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Icon, Text } from 'react-native-paper';

export type RootStackParams = {
  [ROUTES.RECRUITER_SWIPE_MATCH_SCREEN]: undefined;
  [ROUTES.RECRUITER_CANDIDATE_PROFILE]: { userId?: number; title?: string };
  [ROUTES.RECRUITER_CANDIDATE_PROFILE_PREVIEW]: {
    id: number;
  };
};

const Stack = createNativeStackNavigator<RootStackParams>();

const SwipeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={ROUTES.RECRUITER_SWIPE_MATCH_SCREEN}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Jobsy',

          header: ({ options }) => (
            <JobsyHeader
              headerTitle={
                options.headerTitle?.toString() ?? 'placeholder title'
              }
            ></JobsyHeader>
          ),
        }}
        name={ROUTES.RECRUITER_SWIPE_MATCH_SCREEN}
        component={RecruiterSwipeMatchScreen}
      ></Stack.Screen>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Descubrir profesionales ',
          header: ({ navigation, options }) => {
            return (
              <View
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 15,
                  flexDirection: 'row',
                }}
              >
                <Text>{options.headerTitle?.toString()} </Text>
                <View style={{ marginLeft: 'auto' }}>
                  <Pressable
                    onPress={() => {
                      navigation.navigate(ROUTES.RECRUITER_CANDIDATE_PROFILE, {
                        userId: 222,
                        title: 'title',
                      });
                    }}
                  >
                    <Icon size={15} color="white" source={'close'}></Icon>
                  </Pressable>
                </View>
              </View>
            );
          },
        }}
        name={ROUTES.RECRUITER_CANDIDATE_PROFILE_PREVIEW}
        component={CandidatePortfolioScreen}
      ></Stack.Screen>
      <Stack.Screen
        options={{
          headerShown: true,

          headerTitle: 'Jobsy',
          header: ({ options }) => (
            <JobsyHeader
              headerTitle={
                options.headerTitle?.toString() ?? 'placeholder title'
              }
            ></JobsyHeader>
          ),
        }}
        name={ROUTES.RECRUITER_CANDIDATE_PROFILE}
        // component={ProfileNavigator}
        component={ProfileScreen}
      ></Stack.Screen>
    </Stack.Navigator>
  );
};
export default SwipeStack;
