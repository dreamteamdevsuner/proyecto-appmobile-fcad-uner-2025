import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

//TODO move a su component
const Divider = () => {
  // TODO GRIS MOVER A PALETTE DESPUES
  //  #cac4d0
  // TODO GRIS MOVER A PALETTE DESPUES
  const styles = StyleSheet.create({
    divider: {
      marginVertical: 30,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
    dividerDecoration: {
      backgroundColor: '#cac4d0',

      height: 1.2,

      width: 106.83,
    },
  });
  return (
    <View style={styles.divider}>
      <View style={styles.dividerDecoration}></View>
      <Text variant="labelSmall"> o Inicia con</Text>
      <View style={styles.dividerDecoration}></View>
    </View>
  );
};

export default Divider;
