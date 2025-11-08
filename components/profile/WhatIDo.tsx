import { ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { ActivityIndicator, Surface } from 'react-native-paper';
import Portfolio from '../../app/private/shared/perfil/Portfolio';
import { useProfileContext } from '@appContext/ProfileContext';

export const WhatIDo = () => {
  const { user, refreshing, onRefresh } = useProfileContext();

  if (!user) {
    return <ActivityIndicator />;
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.tabContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#A06FA6']}
          tintColor="#fff"
        />
      }
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
    backgroundColor: '#1D1C21',
    gap: 2,
  },
  surfaceDescription: {
    paddingTop: 16,
    paddingHorizontal: 12,
    paddingBottom: 32,
    backgroundColor: '#1D1C21',
  },
});
