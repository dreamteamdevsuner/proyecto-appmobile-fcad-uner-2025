import { View, Text, Dimensions, StyleSheet } from 'react-native';
import React, { PropsWithChildren, useState, useEffect } from 'react';
import { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';

import SwipeMatchButtons from './SwipeMatchButtons';
import useSwipeMatch from '../../../../hooks/useSwipeMatch';
import AppCarousel from '../swipe/AppCarousel';

const width = Dimensions.get('window').width;

export interface CarouselItemProps<T> extends PropsWithChildren {
  item: T;
  handleScrollEnabled?: (val: boolean) => void;
  children?: React.ReactNode;
}

const SwipeMatch = <
  T extends { id?: string; ofertaId?: string; profesionalId?: string },
>({
  data,
  handleScrollEnd,
  renderItem,
  onMatchSuccess,
}: {
  data: T[];
  onScrollEnd?: (val: number) => void;
  handleScrollEnd: () => void;
  renderItem: (props: CarouselItemProps<T>) => React.JSX.Element;
  onMatchSuccess?: (
    candidateName: string,
    candidateId: string,
    candidateFotoPerfil: string,
    idMatch: string,
  ) => void;
}): React.JSX.Element => {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const [currentIndex, setCurrentIndex] = useState(0);
  const { enabledScroll, handleLike, handleScrollEnabled } = useSwipeMatch({
    ref,
    onMatchSuccess,
  });

  useEffect(() => {
    if (!data || data.length === 0) {
      setCurrentIndex(0);
    }
  }, [data]);

  if (data && currentIndex >= data.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>✅</Text>
        <Text style={styles.emptyTitle}>¡Estás al día!</Text>
        <Text style={styles.emptySubtitle}>
          No hay más novedades por el momento.
        </Text>
      </View>
    );
  }

  console.log('🔵 SWIPE RENDER — data.length:', data?.length);
  console.log('🟣 currentIndex:', currentIndex);

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <AppCarousel
          {...{
            handleScrollEnd,
            data,
            ref,
            width,
            enabledScroll,
            handleScrollEnabled,
            renderItem,
            handleLike,
            onSnapToItem: (index: number) => setCurrentIndex(index),
          }}
        />
      </View>

      <SwipeMatchButtons
        handleLike={async (like) => {
          const currentItem = data[currentIndex];

          if (!currentItem) return;

          console.log('❤️ LIKE BTN PRESSED');

          const currentOfferId = currentItem?.ofertaId || currentItem?.id;
          const targetProfesionalId = currentItem?.profesionalId;

          await handleLike(like, currentOfferId, targetProfesionalId);

          setCurrentIndex((prev) => prev + 1);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexBasis: '50%',
    gap: 20,
    paddingBottom: 100,
  },
  carouselContainer: {
    paddingBottom: 10,
    position: 'relative',
    maxHeight: '65%',
  },
  carousel: { height: '100%' },
  matchButton: {
    fontSize: 30,
  },
});

export default SwipeMatch;
