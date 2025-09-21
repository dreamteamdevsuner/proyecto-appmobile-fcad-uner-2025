import { View, StyleSheet, StyleProp, ViewStyle, FlatList } from 'react-native';
import React, { PropsWithChildren } from 'react';
import { Button, Card, Chip, Text } from 'react-native-paper';
import { Candidate } from '../../interfaces/Candidate';
import { Pressable } from 'react-native-gesture-handler';
interface CandidateCardProps extends PropsWithChildren {
  candidate: Candidate;
  styles?: StyleProp<ViewStyle>;
  handleScrollEnabled: (val: boolean) => void;
}
const CandidateCard = ({
  candidate,
  children,
  handleScrollEnabled,
}: CandidateCardProps) => {
  return (
    <Card style={styles.card}>
      <View
        style={{
          overflow: 'hidden',
          maxHeight: 340,
        }}
      >
        {children}
      </View>
      <View style={{ marginTop: -20 }}>
        <Card.Title
          title={
            <Text
              variant="headlineSmall"
              style={{
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {candidate.firstName + ' ' + candidate.lastName}{' '}
            </Text>
          }
        ></Card.Title>

        <Card.Content>
          <Text
            style={{
              textAlign: 'center',
              marginTop: -10,
            }}
            variant="titleMedium"
          >
            {candidate.profession}
          </Text>
          <FlatList
            data={candidate.skills}
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleScrollEnabled(false);
              return;
            }}
            onTouchEnd={(e) => handleScrollEnabled(false)}
            onScrollBeginDrag={(e) => handleScrollEnabled(false)}
            onScrollEndDrag={() => {
              handleScrollEnabled(true);
            }}
            style={styles.chipContainer}
            horizontal={true}
            renderItem={({ item, index }) => (
              <Chip
                mode="outlined"
                textStyle={{ color: 'white' }}
                style={styles.chip}
                key={index}
              >
                {item}
              </Chip>
            )}
          ></FlatList>
          <View
            style={{
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              style={{ width: 20 }}
              children
              buttonColor="transparent"
              textColor="black"
              icon="plus-circle-outline"
              mode="contained"
            ></Button>
          </View>
        </Card.Content>
      </View>
    </Card>
  );
};
const styles = StyleSheet.create({
  card: {
    width: '90%',
    position: 'relative',
    marginHorizontal: 'auto',
    marginTop: 20,
    paddingBottom: 40,
    textAlign: 'center',
    flex: 1,
    justifyContent: 'center',
    borderRadius: 50,
  },
  contentWrapper: {
    backgroundColor: 'blue',
    width: '100%',
  },
  chipContainer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    paddingVertical: 8,
    gap: 8,

    alignSelf: 'center',
  },
  chip: {
    backgroundColor: '#2c2c2c',
    color: 'white',
    borderRadius: 20,
    fontSize: 10,
    //POR QUE LOS ESTILOS DE LEO NO ME FUNCIONAN SI ES EL MISMO COMPONENT Y TENGO QUE AGREGAR MR = 5 ??!
    marginRight: 5,
  },
});
export default CandidateCard;
