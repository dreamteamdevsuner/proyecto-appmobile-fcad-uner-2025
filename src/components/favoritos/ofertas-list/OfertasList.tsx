import React, { useState } from 'react';
import { View, FlatList, StyleSheet, ListRenderItem } from 'react-native';
import { List } from 'react-native-paper';

type Item = {
  id: number;
  title: string;
  subtitle?: string;
};

type Props = {
  items: Item[];
  setSelectedId: (id: number | null) => void;
};

const OfertasList: React.FC<Props> = ({ items, setSelectedId }) => {
  const [pressedId, setPressedId] = useState<number | null>(null);

  const renderItem: ListRenderItem<Item> = ({ item }) => {
    return (
      <List.Item
        title={item.title}
        description={item.subtitle}
        titleStyle={pressedId === item.id ? styles.selectedTitle : undefined}
        onPress={() => setSelectedId(item.id)}
        onPressIn={() => setPressedId(item.id)}
        onPressOut={() => setPressedId(null)}
        right={(props) => <List.Icon {...props} icon='chevron-right' />}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList<Item>
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString() + item.title}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <List.Item
            title='No hay elementos'
            left={(props) => (
              <List.Icon {...props} icon='alert-circle-outline' />
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
});

export default OfertasList;
