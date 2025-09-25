import {

  Dimensions,

} from 'react-native';
import React from 'react';


import { candidates2 } from '../../../../mockup/candidates';
import CandidateCard from '../../../../components/ui/CandidateCard';

import SwipeMatch from '../../shared/swipe_match/SwipeMatch';
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
