import {
  Dimensions,
  LayoutChangeEvent,
  StyleSheet,
  View,
}
  from 'react-native';
import React, { useRef, useState } from 'react';
import { candidates2 } from '../../../../mockup/candidates';
import CandidateCard from '../../../../components/ui/CandidateCard';
import SwipeMatch from '../../shared/swipe_match/SwipeMatch';
import { Candidate } from '../../../../interfaces/Candidate';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Text } from 'react-native-paper';
import ROUTES from '../navigator/routes';
import { TouchableOpacity, Image } from 'react-native';
import AppCarousel from '../../shared/swipe/AppCarousel';
import { LinkImage, PortfolioText, checkIsLinkImage, checkIsPortfolioText, isUser } from '../../../../utils/checkTypeOfRenderItem';
import { ProfileUser } from '../../../../types';
import JobsyHeader from '../../../../components/ui/JobsyHeader';
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


const CandidatePortfolioCarouselItem = ({ item }: { item: LinkImage | PortfolioText | ProfileUser }) => {
  let innerContent = <View ><Text>Placeholder </Text></View>
  let styles = StyleSheet.create({
    container: {
      width: '100%',
      flex: 1,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      maxWidth: 'auto',

    }

  })
  if (checkIsLinkImage(item)) {
    innerContent = <View style={{ width: '100%', flex: 1, }}>

      <Image
        source={item.link}
        style={{ resizeMode: 'cover', width: '100%', height: '100%' }} ></Image>
    </View>
  }
  if (checkIsPortfolioText(item)) {
    styles = { ...styles, container: { ...styles.container, backgroundColor: 'black', } }
    innerContent = <Text style={{ color: 'white', maxWidth: '80%' }}>Placeholder {item.portfolioText} </Text>
  }
  return <View {...{ item }} style={styles.container} >
    {innerContent}
  </View>

}

const CandidatePortfolioScreen = ({ navigation, route }: CandidatePortfolioScreenProps) => {


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
    {
      portfolioText: "🎬 Tengo muchas ganas de trabajar en nuevos proyectos de diseño UI para mobile. Estoy ansiosa por proyectos que me propongan desafíos Soy proactiva y mi ojo estético es mi don. Donde pongo el ojo, pongo la conversión. Si te interesó mi perfil, matcheame y hablemos. \n Juani 🌈"

    }

  ]

  const [containerViewRefHeight, setContainerViewRefHeight] = useState<number>()
  const containerViewRef = useRef<View | null>(null)
  const getContainerViewRefHeight = function (e: LayoutChangeEvent) {

    setContainerViewRefHeight(e.nativeEvent.layout.height)
  }

  return (
    <View onLayout={getContainerViewRefHeight} ref={containerViewRef} style={{ flex: 1, backgroundColor: 'transparent' }}>
      <AppCarousel< LinkImage | PortfolioText | ProfileUser  > width={width} height={containerViewRefHeight} styles={{ maxHeight: "100%", minHeight: '100%' }} data={carouselData} enabledScroll={true} renderItem={({ item }) => {
        return <CandidatePortfolioCarouselItem {...{ item }}></CandidatePortfolioCarouselItem>


      }}></AppCarousel>
    </View>
  )
}


//  options={{
//           headerShown: true,
//           headerTitle: 'Jobsy',
//           tabBarIcon: ({ color, size }) => (
//             <MaterialCommunityIcons
//               name="account-group-outline"
//               size={size}
//               color={color}
//             />
//           ),


//           header: ({ options }) => <JobsyHeader headerTitle={options.headerTitle?.toString() ?? 'placeholder title'}></JobsyHeader>


//         }} 

export const SwipeStack = () => {
  return (<Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={ROUTES.RECRUITER_SWIPE_MATCH_SCREEN}>
    <Stack.Screen options={{
      headerShown: true,
      headerTitle: 'Jobsy',
      header: ({ options }) => <JobsyHeader headerTitle={options.headerTitle?.toString() ?? 'placeholder title'}></JobsyHeader>
    }} name={ROUTES.RECRUITER_SWIPE_MATCH_SCREEN} component={RecruiterSwipeMatchScreen}></Stack.Screen>
    <Stack.Screen options={{ headerShown: true, headerTitle: 'Descubrir profesionales' }} name={ROUTES.RECRUITER_CANDIDATE_PROFILE} component={CandidatePortfolioScreen}></Stack.Screen>
  </Stack.Navigator>)
}

export default RecruiterSwipeMatchScreen;
