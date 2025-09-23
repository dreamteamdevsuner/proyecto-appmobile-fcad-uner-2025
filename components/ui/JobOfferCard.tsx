import {
  View,
  StyleProp,
  ViewStyle,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import React, { PropsWithChildren } from 'react';
import { JobOffer } from '../../interfaces/JobOffer';
import { Button, Card, Chip, Icon, Text } from 'react-native-paper';
export interface JobOfferCardProps extends PropsWithChildren {
  item: JobOffer;
  styles?: StyleProp<ViewStyle>;
  handleScrollEnabled: (val: boolean) => void | undefined;
}
function JobOfferCard(
  this: any,
  { item, children, handleScrollEnabled }: JobOfferCardProps,
) {
  const imageLink = require('../../assets/images/avatarCandidatePlaceholder.jpg');
  console.log('ITEM', item);
  return (
    <Card style={styles.card}>
      <View style={styles.recruiter}>
        {/* <Card.Cover
          style={{ objectFit: 'fill', marginLeft: 40 }}
          source={imageLink}
          height={20}
        ></Card.Cover> */}
        <View>
          <Text>{item.recruiterFirstName + ' ' + item.recruiterLastName}</Text>
        </View>
      </View>
      <View
        style={{
          overflow: 'hidden',
          maxHeight: 340,
        }}
      >
        <View
          style={{
            paddingVertical: 25,
            paddingHorizontal: 35,
            flexDirection: 'row',
            gap: 20,
            maxHeight: '70%',
          }}
        >
          <View style={{ flexBasis: '80%' }}></View>
          <View>
            <View style={{ flexDirection: 'row' }}>
              <Icon
                source={'map-marker-outline'}
                size={20}
                color="black"
              ></Icon>
              {/*    <Text> {item.country.slice(0, 2).toUpperCase() + '.'}</Text> */}
            </View>
            <Text style={{ opacity: 0.3 }}> REMOTO</Text>
          </View>
        </View>
      </View>
      <View style={{ marginTop: -20 }}>
        <Card.Title
          title={
            <Text
              children
              variant="headlineSmall"
              style={{
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              {/* {item.firstName + ' ' + item.lastName}{' '} */}
            </Text>
          }
        ></Card.Title>

        <Card.Content>
          {/*   <Text
            style={{
              textAlign: 'center',
              marginTop: -10,
            }}
            variant="titleMedium"
          >
            {item.profession}
          </Text> */}
          {/*      <FlatList
            data={item.skills}
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
                onPress={() => handleScrollEnabled(false)}
              >
                {item}
              </Chip>
            )}
          ></FlatList> */}
          <View
            style={{
              alignContent: 'center',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              style={{ width: 24 }}
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
}

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
  recruiter: {
    display: 'flex',
    flexDirection: 'row',
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

export default JobOfferCard;
