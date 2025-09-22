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
import CandidateCard from '../../../../components/ui/CandidateCard';

import SwipeMatch from '../../shared/swipe_match/SwipeMatch';
const data = candidates2;
const width = Dimensions.get('window').width;

const RecruiterSwipeMatchScreen = () => {
  const imageLink = require('../../../../assets/images/avatarCandidatePlaceholder.jpg');
  return <SwipeMatch ItemComponent={CandidateCard}></SwipeMatch>;
};

export default RecruiterSwipeMatchScreen;
