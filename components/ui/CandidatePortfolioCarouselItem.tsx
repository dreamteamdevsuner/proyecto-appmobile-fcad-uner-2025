import { StyleSheet, View, Pressable } from 'react-native';
import {
  checkIsLinkImage,
  checkIsPortfolioText,
  LinkImage,
  PortfolioText,
} from '../../utils/checkTypeOfRenderItem';
import { Text } from 'react-native-paper';
import CarouselPortfolioCarouselImage from './CarouselPortfolioCarouselImage';

const CandidatePortfolioCarouselItem = ({
  item,
}: {
  item: LinkImage | PortfolioText;
}) => {
  let innerContent;
  let styles = StyleSheet.create({
    container: {
      width: '100%',
      flex: 1,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      maxWidth: 'auto',
    },
  });
  if (checkIsLinkImage(item)) {
    innerContent = (
      <CarouselPortfolioCarouselImage
        link={item.link}
      ></CarouselPortfolioCarouselImage>
    );
  }
  if (checkIsPortfolioText(item)) {
    styles = {
      ...styles,
      container: { ...styles.container, backgroundColor: 'black' },
    };

    innerContent = (
      <Pressable style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={{ color: 'white', maxWidth: '80%' }}>
          {item.portfolioText}
        </Text>
      </Pressable>
    );
  }
  return (
    <View {...{ item }} style={styles.container}>
      {innerContent}
    </View>
  );
};

export default CandidatePortfolioCarouselItem;
