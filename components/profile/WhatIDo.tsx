import { ScrollView, StyleSheet, View } from 'react-native';
import { Surface } from 'react-native-paper';
import { ProfileUser } from '../../types/ProfileUser';

export const WhatIDo = (user: ProfileUser) => {
  return (
    <ScrollView contentContainerStyle={styles.tabContent}>
      <Surface mode="flat" elevation={2} style={styles.surfaceDescription}>
        <View style={{ width: '100%', alignItems: 'center', gap: 16 }}></View>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  tabContent: {
    flexGrow: 1,
    backgroundColor: 'transparent',
    gap: 2,
  },
  surfaceDescription: {
    paddingTop: 16,
    paddingHorizontal: 32,
    paddingBottom: 32,
    backgroundColor: '#FEF7FF',
  },
});
