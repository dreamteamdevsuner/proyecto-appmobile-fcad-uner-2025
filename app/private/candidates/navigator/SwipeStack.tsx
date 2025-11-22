import { View, Text, Image } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ROUTES from './routes';
import CandidateSwipeMatchScreen from '../screens/CandidateHomeScreen';
import JobPostingScreen from '../screens/jobPostingScreen/JobPostingScreen';
import JobsyHeader from '@components/ui/JobsyHeader';
export type CandidateSwipeStackRootParams = {
  [ROUTES.CANDIDATE_SWIPE_MATCH_SCREEN]: {};
  [ROUTES.CANDIDATE_JOB_OFFER_SCREEN]: {
    jobOfferId: string;
  };
};
//  <Appbar.Header>
//         <Appbar.BackAction onPress={() => {}} />
//         <Appbar.Content title="Descubrir ofertas" />
//       </Appbar.Header>
const Stack = createStackNavigator<CandidateSwipeStackRootParams>();
const SwipeStack = () => {
  return (
    <Stack.Navigator initialRouteName={ROUTES.CANDIDATE_SWIPE_MATCH_SCREEN}>
      <Stack.Screen
        options={{
          headerTitle: 'Jobsy',

          header: ({ options }) => (
            <JobsyHeader
              headerTitle={
                options.headerTitle?.toString() ?? 'placeholder title'
              }
              propStyles={{ logo: { width: 45, height: 45 } }}
            ></JobsyHeader>
          ),
        }}
        name={ROUTES.CANDIDATE_SWIPE_MATCH_SCREEN}
        component={CandidateSwipeMatchScreen}
      ></Stack.Screen>
      <Stack.Screen
        options={{ headerTitle: 'Descubrir ofertas' }}
        name={ROUTES.CANDIDATE_JOB_OFFER_SCREEN}
        component={JobPostingScreen}
      ></Stack.Screen>
    </Stack.Navigator>
  );
};

export default SwipeStack;
