import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ROUTES from './routes';
import JobsyHeader from '../../../../components/ui/JobsyHeader';
import RecruiterSwipeMatchScreen from '../screens/RecruiterSwipeMatchScreen';
import CandidatePortfolioScreen from '../screens/candidatePortfolioScreen/CandidatePortfolioSceen';

import ProfileScreen from '../../shared/perfil/ProfileScreen';

import { Pressable, View } from 'react-native';

import { Icon, Text } from 'react-native-paper';
import { CandidatePreview } from '../../../../types/database/DBCandidatePreview';
import ConversacionRecruiter from '../screens/conversacionRecruiter';
type CarouselDataType = Pick<CandidatePreview, 'bio' | 'fotoperfil'>;
export type RootStackParams = {
  [ROUTES.RECRUITER_SWIPE_MATCH_SCREEN]: undefined;
  [ROUTES.RECRUITER_CANDIDATE_PROFILE]: {
    userId: string;
    title?: string;
    searchId?: string;
    initialRouteName?: string;
  };
  [ROUTES.RECRUITER_CANDIDATE_PROFILE_PREVIEW]: {
    userId: string;
  } & CarouselDataType;
  [ROUTES.RECRUITER_CONVERSACION]: {
    title: string;
    myName: string;
    otherAvatarUrl?: string;
    myAvatarUrl?: string;
    idOfertaTrabajoMatch?: string;
    idUsuarioProfesional?: string;
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
                options?.headerTitle?.toString() ?? 'placeholder title'
              }
            ></JobsyHeader>
          ),
        }}
        name={ROUTES.RECRUITER_SWIPE_MATCH_SCREEN}
        component={RecruiterSwipeMatchScreen}
      ></Stack.Screen>
      <Stack.Screen
        options={function ({ navigation, route }) {
          return {
            headerShown: true,
            headerTitle: 'Descubrir profesionales ',
            header: function ({ options }) {
              return (
                <View
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 15,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                  }}
                >
                  <Text>{options.headerTitle?.toString() ?? 'fallback'} </Text>

                  <View style={{ marginLeft: 'auto' }}>
                    <Pressable
                      onPress={() => {
                        navigation.navigate(
                          ROUTES.RECRUITER_CANDIDATE_PROFILE,
                          {
                            userId: route.params?.userId,
                            title: 'title',
                          },
                        );
                      }}
                    >
                      <Icon size={15} color="white" source={'close'}></Icon>
                    </Pressable>
                  </View>
                </View>
              );
            },
          };
        }}
        name={ROUTES.RECRUITER_CANDIDATE_PROFILE_PREVIEW}
        component={CandidatePortfolioScreen}
      ></Stack.Screen>

      <Stack.Screen
        options={function ({ navigation, route }) {
          return {
            headerShown: true,
            headerTitle: 'Descubrir profesionales ',
            header: function ({ options }) {
              return (
                <View
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 15,
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <View>
                    <Pressable
                      onPress={() => {
                        navigation.popToTop();
                      }}
                    >
                      <Icon
                        size={15}
                        color="white"
                        source={'chevron-left'}
                      ></Icon>
                    </Pressable>
                  </View>
                  <Text>{options.headerTitle?.toString() ?? 'fallback'} </Text>
                </View>
              );
            },
          };
        }}
        name={ROUTES.RECRUITER_CANDIDATE_PROFILE}
        component={ProfileScreen}
      ></Stack.Screen>

      <Stack.Screen
        name={ROUTES.RECRUITER_CONVERSACION}
        component={ConversacionRecruiter}
        options={({ route }) => ({
          title: route.params?.title ?? 'Conversación',
          orientation: 'default',
          headerShown: true,
        })}
      />
    </Stack.Navigator>
  );
};
export default SwipeStack;
