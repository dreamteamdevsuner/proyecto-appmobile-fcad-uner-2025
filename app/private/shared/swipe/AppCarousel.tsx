import { StyleProp, ViewStyle, Dimensions } from 'react-native';
import React, { PropsWithChildren } from 'react'
import { CarouselItemProps } from '../swipe_match/SwipeMatch';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
interface AppCarouselProps<T> extends PropsWithChildren {
  styles?: StyleProp<ViewStyle>,
  children?: React.ReactNode,
  ref?: React.RefObject<ICarouselInstance | null>,
  width: number;
  data: T[];
  enabledScroll: boolean;
  handleScrollEnabled?: (val: boolean) => void
  renderItem: (props: CarouselItemProps<T>) => React.JSX.Element;

}

const screenWidth = Dimensions.get('window').width;
const AppCarousel = <T,>(props: AppCarouselProps<T>) => {
  const { ref, data, enabledScroll, renderItem, handleScrollEnabled } = props
  const progress = useSharedValue<number>(0);
  const width = props?.width ?? screenWidth / 2
  return (
    <Carousel<T>
      ref={ref}
      width={width}
      data={data}

      style={props.styles}
      onProgressChange={progress}
      enabled={enabledScroll}
      renderItem={({ item }) => renderItem({ item, handleScrollEnabled })

      }
    />
  )
}

export default AppCarousel

