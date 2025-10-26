import React, { useState } from 'react';
import { View, FlatList, StyleSheet, ListRenderItem } from 'react-native';
import { List } from 'react-native-paper';
import { Item } from '@models/index';

type Props = {
  items: Item[];
  onSelectItem: (item: Item) => void;
};

const ItemList: React.FC<Props> = ({ items, onSelectItem }) => {
  const [pressedId, setPressedId] = useState<string | null>(null);

  const renderItem: ListRenderItem<Item> = ({ item }) => {
    return (
      <List.Item
        title={item.titulo}
        description={item.subtitulo}
        style={pressedId === item.id ? styles.selectedItem : undefined}
        titleStyle={pressedId === item.id ? styles.selectedTitle : undefined}
        descriptionStyle={styles.subtitle}
        onPress={() => onSelectItem(item)}
        onPressIn={() => setPressedId(item.id)}
        onPressOut={() => setPressedId(null)}
        right={(props) => <List.Icon {...props} icon="chevron-right" />}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList<Item>
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <List.Item
            title="No hay elementos"
            left={(props) => (
              <List.Icon {...props} icon="alert-circle-outline" />
            )}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectedTitle: {
    fontWeight: 'bold',
  },
  selectedItem: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  subtitle: {
    color: '#B3B3B3',
  },
});

export default ItemList;
