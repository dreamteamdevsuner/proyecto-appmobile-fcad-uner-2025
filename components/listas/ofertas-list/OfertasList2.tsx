import React, { useState } from 'react';
import { View, FlatList, StyleSheet, ListRenderItem } from 'react-native';
import { List, IconButton } from 'react-native-paper';
import { OfertaItem } from '../../../types/OfertaItem';

type Props = {
  ofertas: OfertaItem[];
  onSelectOferta: (oferta: OfertaItem) => void;
  onMessageOferta?: (oferta: OfertaItem) => void;
};

const OfertasList2: React.FC<Props> = ({
  ofertas,
  onSelectOferta,
  onMessageOferta,
}) => {
  const [pressedId, setPressedId] = useState<number | string | null>(null);

  const renderItem: ListRenderItem<OfertaItem> = ({ item }) => {
    return (
      <List.Item
        title={item.title}
        description={item.subtitle}
        style={pressedId === item.id ? styles.selectedItem : undefined}
        titleStyle={pressedId === item.id ? styles.selectedTitle : undefined}
        descriptionStyle={styles.subtitle}
        onPress={() => onSelectOferta(item)}
        onPressIn={() => setPressedId(item.id)}
        onPressOut={() => setPressedId(null)}
        right={() => (
          <View style={styles.actions}>
            <IconButton
              icon="message"
              size={20}
              onPress={() => {
                if (onMessageOferta) onMessageOferta(item);
              }}
            />
          </View>
        )}
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
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    color: '#B3B3B3',
  },
});

export default OfertasList2;
