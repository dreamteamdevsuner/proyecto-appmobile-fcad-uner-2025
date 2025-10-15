import { ScrollView, StyleSheet, View } from 'react-native';
import { Surface } from 'react-native-paper';
import { ProfileUser } from '../../types/ProfileUser';
import Portfolio from '../../app/private/shared/perfil/Portfolio';

export const WhatIDo = (user: ProfileUser) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.tabContent}
    >
      <Surface mode="flat" elevation={2} style={styles.surfaceDescription}>
        <Portfolio></Portfolio>
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
    paddingHorizontal: 12,
    paddingBottom: 32,
    backgroundColor: '#1D1C21',
  },
});
