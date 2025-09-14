import React, { useState } from 'react';
import { View, FlatList, StyleSheet, ListRenderItem } from 'react-native';
import { List } from 'react-native-paper';
import { OfertaItem } from '../../../types/OfertaItem';

type Props = {
  ofertas: OfertaItem[];
  setSelectedId: (id: number | null) => void;
};

const OfertasList: React.FC<Props> = ({ ofertas, setSelectedId }) => {
  const [pressedId, setPressedId] = useState<number | null>(null);

  const renderItem: ListRenderItem<OfertaItem> = ({ item }) => {
    return (
      <List.Item
        title={item.title}
        description={item.subtitle}
        style={pressedId === item.id ? styles.selectedItem : undefined}
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
      <FlatList<OfertaItem>
        data={ofertas}
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
  selectedItem: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});

export default OfertasList;
