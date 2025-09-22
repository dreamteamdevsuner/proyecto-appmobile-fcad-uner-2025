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
import Carousel, {
  ICarouselInstance,
  Pagination,
} from 'react-native-reanimated-carousel';
import { candidates2 } from '../../../../mockup/candidates';
import CandidateCard from '../../../../components/ui/CandidateCard';
import { Button, Card, Icon, TouchableRipple } from 'react-native-paper';
import { ElevationLevels } from 'react-native-paper/lib/typescript/types';
import SwipeMatchButton from '../../shared/swipe_match/SwipeMatchButton';
const data = candidates2;
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const RecruiterSwipeMatchScreen = () => {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const imageLink = require('../../../../assets/images/avatarCandidatePlaceholder.jpg');
  const [isBeingPressed, setIsBeingPress] = useState(false);
  const [enabledScroll, setEnabledScroll] = useState(true);
  const handleScrollEnabled = (val: boolean) => {
    setEnabledScroll(val);
  };

  const handleLike = (like: boolean) => {
    console.log('like res', like);
    ref.current?.next();
  };
  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <Carousel
          ref={ref}
          width={width}
          height={height / 2}
          data={data}
          onProgressChange={progress}
          enabled={enabledScroll}
          renderItem={({ item, index }) => {
            return (
              <CandidateCard
                {...{ handleScrollEnabled }}
                key={index}
                candidate={item}
              >
                <View
                  style={{
                    paddingVertical: 25,
                    paddingHorizontal: 35,
                    flexDirection: 'row',
                    gap: 20,
                    maxHeight: '70%',
                  }}
                >
                  <View style={{ flexBasis: '80%' }}>
                    <Card.Cover
                      style={{ objectFit: 'fill', marginLeft: 40 }}
                      source={imageLink}
                      height={50}
                    ></Card.Cover>
                  </View>
                  <View>
                    <View style={{ flexDirection: 'row' }}>
                      <Icon
                        source={'map-marker-outline'}
                        size={20}
                        color="black"
                      ></Icon>
                      <Text>
                        {' '}
                        {item.country.slice(0, 2).toUpperCase() + '.'}
                      </Text>
                    </View>
                    <Text style={{ opacity: 0.3 }}> REMOTO</Text>
                  </View>
                </View>
              </CandidateCard>
            );
          }}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <SwipeMatchButton
          iconSize={20.75}
          iconColor="black"
          iconSource={'close'}
          onPress={() => handleLike(false)}
          styles={{ width: 80, height: 80 }}
        ></SwipeMatchButton>
        <SwipeMatchButton
          iconSize={65.69}
          iconColor="black"
          iconSource={'heart-outline'}
          onPress={() => handleLike(true)}
        ></SwipeMatchButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(50,50,50,.4)',
    flex: 1,
    flexDirection: 'column',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  carouselContainer: { paddingBottom: 10 },
  carousel: {},

  matchButton: {
    fontSize: 30,
  },
});
export default RecruiterSwipeMatchScreen;
