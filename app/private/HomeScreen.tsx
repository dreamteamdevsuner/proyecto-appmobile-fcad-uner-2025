import { View } from 'react-native';
import React from 'react';
import { Button } from 'react-native-paper';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrivateStackParamList } from '../../navigator/types';

type Props = {
  navigation: NativeStackNavigationProp<PrivateStackParamList>;
};

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View>
      <Button onPress={() => navigation.navigate('Favoritos')}>
        Favoritos
      </Button>
      <Button onPress={() => navigation.navigate('Mensajería')}>
        Mensajeria
      </Button>
    </View>
  );
};

export default HomeScreen;
