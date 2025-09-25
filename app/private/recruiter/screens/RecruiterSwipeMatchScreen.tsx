import {

  Dimensions,
  View,


} from 'react-native';
import React from 'react';


import { candidates2 } from '../../../../mockup/candidates';
import CandidateCard from '../../../../components/ui/CandidateCard';

import SwipeMatch from '../../shared/swipe_match/SwipeMatch';
import { Candidate } from '../../../../interfaces/Candidate';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Text } from 'react-native-paper';

import ROUTES from '../navigator/routes';
import { TouchableOpacity, Image } from 'react-native';

import AppCarousel from '../../shared/swipe/AppCarousel';
const data = candidates2;


export type RootStackParams = {
  [ROUTES.RECRUITER_SWIPE_MATCH_SCREEN]: {},
  [ROUTES.RECRUITER_CANDIDATE_PROFILE]: {
    id: number
  }
}
const Stack = createNativeStackNavigator<RootStackParams>()


interface RecruiterSwipeMatchScreen extends NativeStackScreenProps<RootStackParams, ROUTES.RECRUITER_SWIPE_MATCH_SCREEN> { }
const RecruiterSwipeMatchScreen = ({ navigation }: RecruiterSwipeMatchScreen) => {
  return (
    <SwipeMatch<Candidate>
      data={data}
      renderItem={(
        { item,
          handleScrollEnabled
        }


      ) => {
        return (
          <CandidateCard
            item={item}
            {...{ handleScrollEnabled }}
          >
            <TouchableOpacity onPress={() => navigation.navigate(ROUTES.RECRUITER_CANDIDATE_PROFILE, { id: 1 })}>
              <View
                style={{
                  alignContent: 'center',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Button
                  style={{ width: 24 }}
                  children
                  buttonColor="transparent"
                  textColor="black"
                  icon="plus-circle-outline"
                  mode="contained"
                ></Button>
              </View>
            </TouchableOpacity>
          </CandidateCard>
        );
      }}
    ></SwipeMatch>
  );





}
interface CandidatePortfolioScreenProps extends NativeStackScreenProps<RootStackParams, ROUTES.RECRUITER_CANDIDATE_PROFILE> { }
const width = Dimensions.get("screen").width
const CandidatePortfolioScreen = ({ navigation, route }: CandidatePortfolioScreenProps) => {

  console.log("Navigation", navigation)
  console.log("Route", route)
  const carouselData = [
    {
      link: require(`../../../../assets/images/mockupCandidatePortfolio/candidatePortfolio-1.jpg`)

    },
    {
      link: require(`../../../../assets/images/mockupCandidatePortfolio/candidatePortfolio-2.jpg`)

    },
    {
      link: require(`../../../../assets/images/mockupCandidatePortfolio/candidatePortfolio-3.jpg`)

    },

  ]
  return (

    <AppCarousel< {
      link:
      any;
    }  > width={width} data={carouselData} enabledScroll={true} styles={{ flex: 1 }} renderItem={({ item }) => {

      return (<View {...{ item }} style={{ width: '100%', flex: 1 }} >



        <View style={{ width: '100%', flex: 1 }}>
          <Image
            source={item.link}
            style={{ height: '100%', width: '100%', objectFit: 'cover' }} ></Image>
        </View>
      </View>)
    }}></AppCarousel>
  )
}


export const SwipeStack = () => {
  return (<Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={ROUTES.RECRUITER_SWIPE_MATCH_SCREEN}>
    <Stack.Screen name={ROUTES.RECRUITER_SWIPE_MATCH_SCREEN} component={RecruiterSwipeMatchScreen}></Stack.Screen>
    <Stack.Screen options={{ headerShown: true, headerTitle: 'Descubrir profesionales' }} name={ROUTES.RECRUITER_CANDIDATE_PROFILE} component={CandidatePortfolioScreen}></Stack.Screen>
  </Stack.Navigator>)
}

export default RecruiterSwipeMatchScreen;
