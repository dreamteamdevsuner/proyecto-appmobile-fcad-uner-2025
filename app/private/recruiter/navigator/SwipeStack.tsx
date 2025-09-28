import { createNativeStackNavigator } from "@react-navigation/native-stack"
import ROUTES from "./routes"
import JobsyHeader from "../../../../components/ui/JobsyHeader"
import RecruiterSwipeMatchScreen from "../screens/RecruiterSwipeMatchScreen"
import CandidatePortfolioScreen from "../screens/candidatePortfolioScreen/CandidatePortfolioSceen"
import { View } from "react-native"
import { Text } from "react-native-paper"
import CandidateProfileScreen from "../../candidates/screens/CandidateProfileScreen"
import { RouteProp } from "@react-navigation/native"
import ProfileScreenShared, { CombinedParamList } from "../../shared/perfil/ProfileScreen"
import CandidateProfileWrapper from "../../candidates/screens/perfil"
import ProfileNavigator from "../../candidates/screens/perfil/ProfileNavigator"


export type RootStackParams = {
  [ROUTES.RECRUITER_SWIPE_MATCH_SCREEN]: undefined,
  [ROUTES.RECRUITER_CANDIDATE_PROFILE]: {
    id: number
  },
  [ROUTES.RECRUITER_CANDIDATE_PROFILE_FULL]: {
    route: RouteProp<CombinedParamList, keyof CombinedParamList>;
  },

}
const Test = () => {
  return (<View>
    <Text> Lorem ipsum dolor, sit amet consectetur adipisicing elit. Omnis, voluptatem tenetur? Eaque officiis itaque quae autem ea molestias blanditiis aut corporis eligendi alias. Distinctio excepturi recusandae tempora, sed nemo sit obcaecati repudiandae necessitatibus officia. Laudantium eum officia perspiciatis excepturi consequuntur. </Text>
  </View>)
}
const Stack = createNativeStackNavigator<RootStackParams>()
const SwipeStack = () => {
  return (<Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={ROUTES.RECRUITER_SWIPE_MATCH_SCREEN}>
    <Stack.Screen options={{
      headerShown: true,
      headerTitle: 'Jobsy',
      header: ({ options }) => <JobsyHeader headerTitle={options.headerTitle?.toString() ?? 'placeholder title'}></JobsyHeader>
    }} name={ROUTES.RECRUITER_SWIPE_MATCH_SCREEN} component={RecruiterSwipeMatchScreen}></Stack.Screen>
    <Stack.Screen options={{ headerShown: true, headerTitle: 'Descubrir profesionales' }} name={ROUTES.RECRUITER_CANDIDATE_PROFILE} component={CandidatePortfolioScreen}></Stack.Screen>
    <Stack.Screen
      options={{
        headerShown: true,
        headerTitle: 'Jobsy',
        header: ({ options }) => <JobsyHeader headerTitle={options.headerTitle?.toString() ?? 'placeholder title'}></JobsyHeader>
      }}
      name={ROUTES.RECRUITER_CANDIDATE_PROFILE_FULL} component={ProfileNavigator}></Stack.Screen>
  </Stack.Navigator>)
}
export default SwipeStack