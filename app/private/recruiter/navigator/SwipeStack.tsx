import { createNativeStackNavigator } from "@react-navigation/native-stack"
import ROUTES from "./routes"
import JobsyHeader from "../../../../components/ui/JobsyHeader"
import RecruiterSwipeMatchScreen from "../screens/RecruiterSwipeMatchScreen"
import CandidatePortfolioScreen from "../screens/candidatePortfolioScreen/CandidatePortfolioSceen"

export type RootStackParams = {
  [ROUTES.RECRUITER_SWIPE_MATCH_SCREEN]: {},
  [ROUTES.RECRUITER_CANDIDATE_PROFILE]: {
    id: number
  }
  [ROUTES.RECRUITER_CANDIDATE_PROFILE_FULL]: {

  }
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
  </Stack.Navigator>)
}
export default SwipeStack