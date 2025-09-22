import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ROUTES from '../navigator/routes';
import { PrivateStackParamList } from '../navigator/types';

type Props = NativeStackScreenProps<
  PrivateStackParamList,
  ROUTES.CANDIDATE_TEST
>;

const CandidateTestScreen: React.FC<Props> = ({ route }) => {
  const { title, company } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oferta de empleo</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
  },
});

export default CandidateTestScreen;
