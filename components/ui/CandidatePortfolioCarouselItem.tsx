import { StyleSheet, View, Image } from "react-native"
import { checkIsLinkImage, checkIsPortfolioText, LinkImage, PortfolioText } from "../../utils/checkTypeOfRenderItem"
import { Text } from "react-native-paper"

const CandidatePortfolioCarouselItem = ({ item }: { item: LinkImage | PortfolioText }) => {
  let innerContent = <View ><Text>Placeholder </Text></View>
  let styles = StyleSheet.create({
    container: {
      width: '100%',
      flex: 1,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      maxWidth: 'auto',

    }

  })
  if (checkIsLinkImage(item)) {
    innerContent = <View style={{ width: '100%', flex: 1, }}>

      <Image
        source={item.link}
        style={{ resizeMode: 'cover', width: '100%', height: '100%' }} ></Image>
    </View>
  }
  if (checkIsPortfolioText(item)) {
    styles = { ...styles, container: { ...styles.container, backgroundColor: 'black', } }
    innerContent = <Text style={{ color: 'white', maxWidth: '80%' }}>Placeholder {item.portfolioText} </Text>
  }
  return <View {...{ item }} style={styles.container} >
    {innerContent}
  </View>

}
export default CandidatePortfolioCarouselItem