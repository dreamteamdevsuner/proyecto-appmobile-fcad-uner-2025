import {

  View,
}
  from 'react-native';
import React from 'react';
import { candidates2 } from '../../../../mockup/candidates';
import CandidateCard from '../../../../components/ui/CandidateCard';
import SwipeMatch from '../../shared/swipe_match/SwipeMatch';
import { Candidate } from '../../../../interfaces/Candidate';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, } from 'react-native-paper';
import ROUTES from '../navigator/routes';
import { TouchableOpacity } from 'react-native';
import { RootStackParams } from '../navigator/SwipeStack';


const data = candidates2;







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











export default RecruiterSwipeMatchScreen;
