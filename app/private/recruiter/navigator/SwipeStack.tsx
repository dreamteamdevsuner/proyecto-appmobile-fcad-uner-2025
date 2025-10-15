import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ROUTES from './routes';
import JobsyHeader from '../../../../components/ui/JobsyHeader';
import RecruiterSwipeMatchScreen from '../screens/RecruiterSwipeMatchScreen';
import CandidatePortfolioScreen from '../screens/candidatePortfolioScreen/CandidatePortfolioSceen';

import ProfileNavigator from '../../candidates/screens/perfil/ProfileNavigator';
import ProfileScreen from '../../shared/perfil/ProfileScreen';
import CandidateProfileWrapper from '../../candidates/screens/perfil';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
        options={{ headerShown: true, headerTitle: 'Descubrir profesionales' }}
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
