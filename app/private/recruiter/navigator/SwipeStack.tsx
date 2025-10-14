import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ROUTES from './routes';
import JobsyHeader from '../../../../components/ui/JobsyHeader';
import RecruiterSwipeMatchScreen from '../screens/RecruiterSwipeMatchScreen';
import CandidatePortfolioScreen from '../screens/candidatePortfolioScreen/CandidatePortfolioSceen';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import { RouteProp } from '@react-navigation/native';
import { CombinedParamList } from '../../shared/perfil/ProfileScreen';

import ProfileNavigator from '../../candidates/screens/perfil/ProfileNavigator';
import { createContext, PropsWithChildren, useState } from 'react';

export type RootStackParams = {
  [ROUTES.RECRUITER_SWIPE_MATCH_SCREEN]: undefined;
  [ROUTES.RECRUITER_CANDIDATE_PROFILE]: {
    id: number;
  };
  [ROUTES.RECRUITER_CANDIDATE_PROFILE_FULL]: {
    route: RouteProp<CombinedParamList, keyof CombinedParamList>;
    endReached: boolean;
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
        name={ROUTES.RECRUITER_CANDIDATE_PROFILE}
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
        name={ROUTES.RECRUITER_CANDIDATE_PROFILE_FULL}
        component={ProfileNavigator}
      ></Stack.Screen>
    </Stack.Navigator>
  );
};
export default SwipeStack;
