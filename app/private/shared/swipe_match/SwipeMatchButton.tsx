import {
  View,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React from 'react';
import { Button, Icon } from 'react-native-paper';

interface SwipeMatchBtnProps {
  styles?: StyleProp<ViewStyle>;
  activeOpacity?: number;
  iconSource: string;
  iconSize: number;
  onPress: () => void;
  iconColor: string;
}
const SwipeMatchButton = ({
  activeOpacity = 0.6,
  iconColor = 'black',

  onPress,
  styles,
  iconSize,
  iconSource,
}: SwipeMatchBtnProps) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={activeOpacity}>
      <Button
        icon={() => (
          <View style={{ marginLeft: 15 }}>
            <Icon size={iconSize} color={iconColor} source={iconSource}></Icon>
          </View>
        )}
        mode="contained"
        style={{
          borderRadius: 100,
          height: 100,
          width: 100,
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          elevation: 9,
          ...StyleSheet.flatten(styles),
        }}
        buttonColor="white"
        textColor="black"
        children
      ></Button>
    </TouchableOpacity>
  );
};

export default SwipeMatchButton;
