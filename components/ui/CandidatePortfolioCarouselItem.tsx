import {
  StyleSheet,
  View,
  Image,
  Touchable,
  Pressable,
  Button,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  checkIsLinkImage,
  checkIsPortfolioText,
  LinkImage,
  PortfolioText,
} from '../../utils/checkTypeOfRenderItem';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { RootStackParams } from '../../app/private/recruiter/navigator/SwipeStack';

import { StackNavigationProp } from '@react-navigation/stack';
import CANDIDATE_ROUTES from '../../app/private/candidates/navigator/routes';
import ROUTES from '../../app/private/recruiter/navigator/routes';

const CandidatePortfolioCarouselItem = ({
  item,
}: {
  item: LinkImage | PortfolioText;
}) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();
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
      <View style={{ width: '100%', flex: 1 }}>
        <Image
          source={item.link}
          style={{ resizeMode: 'cover', width: '100%', height: '100%' }}
        ></Image>
      </View>
    );
  }
  if (checkIsPortfolioText(item)) {
    styles = {
      ...styles,
      container: { ...styles.container, backgroundColor: 'black' },
    };

    innerContent = (
      <Pressable
        style={{ flex: 1, justifyContent: 'center' }}
        onPress={() => {
          navigation.navigate(ROUTES.RECRUITER_CANDIDATE_PROFILE, {
            userId: 222,
            title: 'title',
          });
        }}
      >
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
