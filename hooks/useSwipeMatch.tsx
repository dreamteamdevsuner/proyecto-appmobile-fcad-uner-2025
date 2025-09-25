import React, { useState } from 'react';
import { ICarouselInstance } from 'react-native-reanimated-carousel';

const useSwipeMatch = ({
  ref,
}: {
  ref: React.RefObject<ICarouselInstance | null>;
}) => {
  const [enabledScroll, setEnabledScroll] = useState(true);
  const handleScrollEnabled = (val: boolean) => {
    setEnabledScroll(val);
  };

  const handleLike = (like: boolean) => {
    console.log('like res', like);
    ref.current?.next();
  };
  return { enabledScroll, handleScrollEnabled, handleLike };
};

export default useSwipeMatch;
