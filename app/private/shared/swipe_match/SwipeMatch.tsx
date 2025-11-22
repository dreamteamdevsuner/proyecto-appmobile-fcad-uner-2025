import { View, Text, Dimensions, StyleSheet } from 'react-native';
import React, { PropsWithChildren, useState, useEffect } from 'react'; // 1. Importamos useState
import { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';

import SwipeMatchButtons from './SwipeMatchButtons';
import useSwipeMatch from '../../../../hooks/useSwipeMatch';
import AppCarousel from '../swipe/AppCarousel';

// Mantenemos tus interfaces intactas
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
}: {
  data: T[];
  onScrollEnd?: (val: number) => void;
  handleScrollEnd: () => void;
  renderItem: (props: CarouselItemProps<T>) => React.JSX.Element;
}): React.JSX.Element => {
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  // 2. Estado local para controlar cuándo ocultar el carrusel
  const [currentIndex, setCurrentIndex] = useState(0);

  const { enabledScroll, handleLike, handleScrollEnabled } = useSwipeMatch({
    ref,
  });

  // Reiniciar índice si la data cambia drásticamente (opcional, por seguridad)
  useEffect(() => {
    if (!data || data.length === 0) {
      setCurrentIndex(0);
    }
  }, [data]);

  // 3. CONDICIÓN DE FIN: Si el índice supera la cantidad de items, mostramos mensaje
  if (data && currentIndex >= data.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>✅</Text>
        <Text style={styles.emptyTitle}>¡Estás al día!</Text>
        <Text style={styles.emptySubtitle}>
          No hay más perfiles para revisar por el momento.
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
            // 4. Sincronizamos el swipe manual del dedo con nuestro estado
            onSnapToItem: (index) => setCurrentIndex(index),
          }}
        />
      </View>

      <SwipeMatchButtons
        handleLike={(like) => {
          // Usamos currentIndex del estado para asegurar precisión
          const currentItem = data[currentIndex];

          if (!currentItem) return;

          console.log('❤️ LIKE BTN PRESSED:', like);

          // Lógica para detectar IDs (Reclutador vs Profesional)
          const currentOfferId = currentItem?.ofertaId || currentItem?.id;
          const targetProfesionalId = currentItem?.profesionalId;

          // Ejecutar la lógica de base de datos
          handleLike(like, currentOfferId, targetProfesionalId);

          // 5. CRUCIAL: Forzamos el avance del índice visualmente
          // Esto hará que se cumpla la condición (currentIndex >= data.length)
          // y se oculte la tarjeta inmediatamente.
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
    // backgroundColor: 'rgba(50, 50, 50, 0.4)', // Puedes descomentar si te gusta el fondo oscuro
  },
  // Estilos para la pantalla de "Fin"
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
  // Tus estilos existentes
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
