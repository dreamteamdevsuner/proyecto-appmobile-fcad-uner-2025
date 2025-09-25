import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import SwipeMatchButton from './SwipeMatchButton';
interface SwipeMatchButtonsProps {
  handleLike: (val: boolean) => void;
}
const SwipeMatchButtons = ({ handleLike }: SwipeMatchButtonsProps) => {
  return (
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
  );
};

export default SwipeMatchButtons;

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexBasis: '50%',
    gap: 20,
    paddingBottom: 100,
  },
});
