import { useRef, useState } from 'react';
import {
  LinkImage,
  PortfolioText,
} from '../../../../../utils/checkTypeOfRenderItem';
import { Dimensions, LayoutChangeEvent, View } from 'react-native';
import AppCarousel from '../../../shared/swipe/AppCarousel';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import ROUTES from '../../navigator/routes';
import CandidatePortfolioCarouselItem from '../../../../../components/ui/CandidatePortfolioCarouselItem';
import { RootStackParams } from '../../navigator/SwipeStack';
interface CandidatePortfolioScreenProps
  extends NativeStackScreenProps<
    RootStackParams,
    ROUTES.RECRUITER_CANDIDATE_PROFILE_PREVIEW
  > {}
const width = Dimensions.get('screen').width;
const CandidatePortfolioScreen = ({
  navigation,
  route,
}: CandidatePortfolioScreenProps) => {
  const carouselData: Array<LinkImage | PortfolioText> = [
    {
      link: route.params.fotoperfil ?? '',
    },

    {
      portfolioText: route?.params?.bio ?? '',
    },
  ];

  const [containerViewRefHeight, setContainerViewRefHeight] =
    useState<number>();
  const containerViewRef = useRef<View | null>(null);
  const getContainerViewRefHeight = function (e: LayoutChangeEvent) {
    setContainerViewRefHeight(e.nativeEvent.layout.height);
  };

  return (
    <View
      onLayout={getContainerViewRefHeight}
      ref={containerViewRef}
      style={{ flex: 1, backgroundColor: 'transparent' }}
    >
      <AppCarousel<LinkImage | PortfolioText>
        width={width}
        height={containerViewRefHeight}
        styles={{ maxHeight: '100%', minHeight: '100%' }}
        data={carouselData}
        enabledScroll={true}
        renderItem={({ item }) => {
          return (
            <CandidatePortfolioCarouselItem
              {...{ item }}
            ></CandidatePortfolioCarouselItem>
          );
        }}
      ></AppCarousel>
    </View>
  );
};
export default CandidatePortfolioScreen;
