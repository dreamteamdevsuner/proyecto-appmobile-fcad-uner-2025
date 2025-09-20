import { FlatList, StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';

interface HorizontalChipsProps {
  skills: string[];
  textColor?: string;
  backgroundColor?: string;
  borderRadius?: number;
}

/**
Recibe una lista de strings y como opcionales un color de texto, borderRadius y un color de fondo para los chips.
Valores por defecto:
- textColor: 'white'
- backgroundColor: '#2c2c2c'
- borderRadius: 20
**/
export const HorizontalChips = ({
  skills,
  textColor,
  backgroundColor,
  borderRadius,
}: HorizontalChipsProps) => {
  return (
    <FlatList
      data={skills}
      keyExtractor={(item, index) => index.toString()}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.chipContainer}
      renderItem={({ item }) => (
        <Chip
          key={item}
          style={{
            backgroundColor: backgroundColor ? backgroundColor : '#2c2c2c',
            borderRadius: borderRadius ? borderRadius : 20,
          }}
          textStyle={{ color: textColor ? textColor : 'white' }}
        >
          {item}
        </Chip>
      )}
    />
  );
};

const styles = StyleSheet.create({
  chipContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 8,
    marginVertical: 8,
    alignSelf: 'flex-start',
  },
});
