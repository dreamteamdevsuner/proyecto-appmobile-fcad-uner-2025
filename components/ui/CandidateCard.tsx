import { View, StyleSheet, StyleProp, ViewStyle, FlatList } from 'react-native';
import React, { PropsWithChildren, useMemo } from 'react';
import { Button, Card, Chip, Icon, Text } from 'react-native-paper';
import { Candidate } from '../../interfaces/Candidate';
import { Pressable } from 'react-native-gesture-handler';
export interface CandidateCardProps extends PropsWithChildren {
  item: Candidate;
  styles?: StyleProp<ViewStyle>;
  handleScrollEnabled?: (val: boolean) => void | undefined;
}
function CandidateCard({
  item,
  children,
  handleScrollEnabled,
}: CandidateCardProps) {
  const imageLink = require('../../assets/images/avatarCandidatePlaceholder.jpg');

  return (
    <Card style={styles.card}>
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
          <View style={{ flexBasis: '80%' }}>
            <Card.Cover
              style={{ objectFit: 'fill', marginLeft: 40 }}
              source={imageLink}
              height={50}
            ></Card.Cover>
          </View>
          <View>
            <View style={{ flexDirection: 'row' }}>
              <Icon
                source={'map-marker-outline'}
                size={20}
                color="black"
              ></Icon>
              <Text> {item.country.slice(0, 2).toUpperCase() + '.'}</Text>
            </View>
            <Text style={{ opacity: 0.3 }}> REMOTO</Text>
          </View>
        </View>
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
              {item.firstName + ' ' + item.lastName}
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
            {item.profession}
          </Text>
          <FlatList
            data={item.skills}
            scrollEnabled={false}
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleScrollEnabled && handleScrollEnabled(false);
              return;
            }}
            onTouchEnd={(e) =>
              handleScrollEnabled && handleScrollEnabled(false)
            }
            onScrollBeginDrag={(e) =>
              handleScrollEnabled && handleScrollEnabled(false)
            }
            onScrollEndDrag={() => {
              handleScrollEnabled && handleScrollEnabled(true);
            }}
            style={styles.chipContainer}
            horizontal={true}
            renderItem={({ item, index }) => (
              <Chip
                mode="outlined"
                textStyle={{ color: 'white' }}
                style={styles.chip}
                key={index}
                onPress={() =>
                  handleScrollEnabled && handleScrollEnabled(false)
                }
              >
                {item}
              </Chip>
            )}
          ></FlatList>
          {children}
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
  chip: {
    backgroundColor: '#2c2c2c',
    color: 'white',
    borderRadius: 20,

    fontSize: 10,

    marginRight: 5,
  },
});
export default CandidateCard;
