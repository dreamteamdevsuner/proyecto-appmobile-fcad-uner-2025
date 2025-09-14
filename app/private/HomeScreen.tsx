import { View, Text } from 'react-native';
import React from 'react';
import { Button } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type PrivateStackParamList = {
  HomeScreen: undefined;
  Favoritos: undefined;
  Mensajeria: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<PrivateStackParamList>;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View>
      <Button onPress={() => navigation.navigate('Favoritos')}>
        Favoritos
      </Button>
      <Button onPress={() => navigation.navigate('Mensajeria')}>
        Mensajeria
      </Button>
    </View>
  );
};

export default HomeScreen;
