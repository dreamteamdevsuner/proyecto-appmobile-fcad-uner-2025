import { View, Text, Dimensions, StyleSheet } from 'react-native';
import React, { PropsWithChildren } from 'react';
import Carousel, {
  CarouselRenderItem,
  ICarouselInstance,
} from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
import { candidates2 } from '../../../../mockup/candidates';

import SwipeMatchButtons from './SwipeMatchButtons';
import useSwipeMatch from '../../../../hooks/useSwipeMatch';
import AppCarousel from '../swipe/AppCarousel';

const data = candidates2;
const width = Dimensions.get('window').width;
/**
 * Propiedades que se pasan a cada componente de elemento del carrusel.
 *
 * @template T – El tipo del dato que se muestra en el carrusel.
 */
export interface CarouselItemProps<T> extends PropsWithChildren {
  /** El dato que será renderizado. */
  item: T,
  /**
    * Callback opcional que permite al componente padre habilitar o deshabilitar el desplazamiento.
    *
    * @param val – `true` para habilitar el scroll, `false` para deshabilitarlo.
    */
  handleScrollEnabled?: (val: boolean) => void,
  /** Hijos opcionales que pueden renderizarse dentro del elemento. */
  children?: React.ReactNode
}

/**
 * Generic interface for the component rendered inside the carousel.
 *
 * @template T – Type of the data items supplied to the carousel.
 */
const SwipeMatch = <T,>({
  data,

  renderItem,
}: {
  /** Arreglo de objetos de datos que el carrusel iterará. */
  data: T[];
  /**
    * Función de renderizado para cada elemento del carrusel.
    *
    * @param props – Props que cumplen con {@link CarouselItemProps}.
    * @returns Un elemento JSX que representa el ítem renderizado.
    */
  renderItem: (props: CarouselItemProps<T>) => React.JSX.Element;

}): React.JSX.Element => {
  // Reference to the carousel instance – allows programmatic control.
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  // Hook personalizado que agrupa la lógica de swipe‑match (habilitar scroll, manejar likes, etc.).
  const { enabledScroll, handleLike, handleScrollEnabled } = useSwipeMatch({
    ref,
  });

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <AppCarousel  {...{ data, ref, width, enabledScroll, handleScrollEnabled, renderItem }}  ></AppCarousel>

      </View>
      <SwipeMatchButtons {...{ handleLike }}></SwipeMatchButtons>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(50, 50, 50, 0.4)',
    flex: 1,
    flexDirection: 'column',
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
