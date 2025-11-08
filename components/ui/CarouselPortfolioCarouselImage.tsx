import { View, Text, Image } from 'react-native';
import React from 'react';
import useImageSourceFallback from '../../hooks/useImageSourceFallback';

const CarouselPortfolioCarouselImage = ({ link }: { link: string }) => {
  const { imageError, onError } = useImageSourceFallback(
    link,
    '../../assets/images/candidatePortfolioPlaceholder.jpg',
  );

  return (
    <View style={{ width: '100%', flex: 1 }}>
      {/* profile_avatar_placeholder.png */}
      <Image
        source={
          imageError
            ? require('../../assets/images/profile_avatar_placeholder.png')
            : { uri: link }
        }
        onError={onError}
        defaultSource={require('../../assets/images/profile_avatar_placeholder.png')}
        style={{
          resizeMode: imageError ? 'contain' : 'cover',
          width: '100%',
          height: '100%',
        }}
      ></Image>
    </View>
  );
};

export default CarouselPortfolioCarouselImage;
