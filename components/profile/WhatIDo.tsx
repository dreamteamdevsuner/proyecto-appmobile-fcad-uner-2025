import { ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { ActivityIndicator, Surface } from 'react-native-paper';
import Portfolio from '../../app/private/shared/perfil/Portfolio';
import {
  CandidateTabScreenProps,
  PROFILE_ROUTES,
} from '@app/private/shared/perfil/types';

type Props = CandidateTabScreenProps<PROFILE_ROUTES.WHAT_I_DO>;

export const WhatIDo = ({ route }: Props) => {
  const { user } = route.params;

  if (!user) {
    return <ActivityIndicator />;
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.tabContent}
      refreshControl={
        <RefreshControl
          refreshing={Boolean(route.params?.refreshing)}
          onRefresh={route.params?.onRefresh ?? (() => {})}
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
