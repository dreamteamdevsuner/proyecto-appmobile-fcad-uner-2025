import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import React, { useState } from 'react';
import { useSharedValue } from 'react-native-reanimated';

import { candidates2 } from '../../../../mockup/candidates';
import CandidateCard, {
  CandidateCardProps,
} from '../../../../components/ui/CandidateCard';

import SwipeMatch, { CarouselItemProps } from '../../shared/swipe_match/SwipeMatch';
import { Candidate } from '../../../../interfaces/Candidate';
const data = candidates2;
const width = Dimensions.get('window').width;

const RecruiterSwipeMatchScreen = () => {
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
          ></CandidateCard>
        );
      }}
    ></SwipeMatch>
  );





}


export default RecruiterSwipeMatchScreen;
