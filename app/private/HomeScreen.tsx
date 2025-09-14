import { View, Text } from 'react-native';
import React from 'react';
import { Button } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type PrivateStackParamList = {
  HomeScreen: undefined;
  Favoritos: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  PrivateStackParamList,
  'HomeScreen'
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View>
      <Text>HomeScreen</Text>
      <Button onPress={() => navigation.navigate('Favoritos')}>
        Favoritos
      </Button>
    </View>
  );
};

export default HomeScreen;
