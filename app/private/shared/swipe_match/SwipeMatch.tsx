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

const data = candidates2;
const width = Dimensions.get('window').width;


export interface CarouselItemProps<T> extends PropsWithChildren {
  item: T,
  handleScrollEnabled?: (val: boolean) => void,
  children?: React.ReactNode
}
/**
 * Generic interface for the component rendered inside the carousel.
 *
 * @template T - Type of the data item.
 */

const SwipeMatch = <T,>({
  data,

  renderItem,
}: {
  data: T[];
  //Render the list items
  renderItem: (props: CarouselItemProps<T>) => React.JSX.Element;

}): React.JSX.Element => {
  // Reference to the carousel instance – allows programmatic control.
  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const { enabledScroll, handleLike, handleScrollEnabled } = useSwipeMatch({
    ref,
  });

  return (
    <View style={styles.container}>
      <View style={styles.carouselContainer}>
        <Carousel<T>
          ref={ref}
          width={width}
          data={data}
          style={styles.carousel}
          onProgressChange={progress}
          enabled={enabledScroll}
          renderItem={({ item }) => renderItem({ item, handleScrollEnabled })

          }
        />
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
/* 
return (
  <View style={styles.container}>
    <View style={styles.carouselContainer}>
      <Carousel
        ref={ref}
        width={width}
        data={data}
        style={styles.carousel}
        onProgressChange={progress}
        enabled={enabledScroll}
        renderItem={({ item, index }) => {
          return (
            <CandidateCard
              {...{ handleScrollEnabled }}
              key={index}
              candidate={item}
            >
              <View
                style={{
                  paddingVertical: 25,
                  paddingHorizontal: 35,
                  flexDirection: 'row',
                  gap: 20,
                  maxHeight: '70%',
                }}
              >
                <View style={{ flexBasis: '80%' }}>
                  <Card.Cover
                    style={{ objectFit: 'fill', marginLeft: 40 }}
                    source={imageLink}
                    height={50}
                  ></Card.Cover>
                </View>
                <View>
                  <View style={{ flexDirection: 'row' }}>
                    <Icon
                      source={'map-marker-outline'}
                      size={20}
                      color="black"
                    ></Icon>
                    <Text> {item.country.slice(0, 2).toUpperCase() + '.'}</Text>
                  </View>
                  <Text style={{ opacity: 0.3 }}> REMOTO</Text>
                </View>
              </View>
            </CandidateCard>
          );
        }}
      />
    </View>
    <SwipeMatchButtons {...{ handleLike }}></SwipeMatchButtons>
  </View>
); */
/*    renderItem={function ({ item, index }) {
            return ItemComponent({
              handleScrollEnabled,
              candidate: item,
              children: (
                <View
                  style={{
                    paddingVertical: 25,
                    paddingHorizontal: 35,
                    flexDirection: 'row',
                    gap: 20,
                    maxHeight: '70%',
                  }}
                >
                  <View style={{ flexBasis: '80%' }}>
                    <Card.Cover
                      style={{ objectFit: 'fill', marginLeft: 40 }}
                      source={imageLink}
                      height={50}
                    ></Card.Cover>
                  </View>
                  <View>
                    <View style={{ flexDirection: 'row' }}>
                      <Icon
                        source={'map-marker-outline'}
                        size={20}
                        color="black"
                      ></Icon>
                      <Text>
                        {' '}
                        {item.country.slice(0, 2).toUpperCase() + '.'}
                      </Text>
                    </View>
                    <Text style={{ opacity: 0.3 }}> REMOTO</Text>
                  </View>
                </View>
              ),
            });
          }} */

/*     return ItemComponent({
              item,
              handleScrollEnabled,

              children: (
                <View
                  style={{
                    paddingVertical: 25,
                    paddingHorizontal: 35,
                    flexDirection: 'row',
                    gap: 20,
                    maxHeight: '70%',
                  }}
                >
                  <View style={{ flexBasis: '80%' }}>
                    <Card.Cover
                      style={{ objectFit: 'fill', marginLeft: 40 }}
                      source={imageLink}
                      height={50}
                    ></Card.Cover>
                  </View>
                  <View>
                    <View style={{ flexDirection: 'row' }}>
                      <Icon
                        source={'map-marker-outline'}
                        size={20}
                        color="black"
                      ></Icon>
                      <Text>
                        {' '}
                        {item.country.slice(0, 2).toUpperCase() + '.'}
                      </Text>
                    </View>
                    <Text style={{ opacity: 0.3 }}> REMOTO</Text>
                  </View>
                </View>
              ),
            });
          }} */
