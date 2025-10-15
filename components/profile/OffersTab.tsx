import React from 'react';
import { FlatList, View, Text, ListRenderItem, StyleSheet } from 'react-native';
import { Offer, OfferStatus } from '../../types';
import { Divider, List } from 'react-native-paper';

const OffersTab = (offers: Offer[] | undefined): React.JSX.Element => {
  const renderItem: ListRenderItem<Offer> = ({ item }) => {
    return (
      <List.Item
        title={item.name}
        description={item.description}
        right={(props) => <List.Icon {...props} icon={'chevron-right'} />}
      />
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={offers}
        renderItem={renderItem}
        keyExtractor={(item) => item.name.toString()}
        ListEmptyComponent={
          <List.Item
            title="No hay elementos."
            left={(props) => (
              <List.Icon {...props} icon="alert-circle-outline" />
            )}
          />
        }
        ItemSeparatorComponent={() => <Divider></Divider>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D1C21',
  },
  selectedTitle: {
    fontWeight: 'bold',
  },
  selectedItem: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});

export default OffersTab;
