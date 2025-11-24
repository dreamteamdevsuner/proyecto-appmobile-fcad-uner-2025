import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { List } from 'react-native-paper';
import { OfertaItem } from '../../../types/OfertaItem';

type Props = {
  ofertas: OfertaItem[];
  onSelectOferta: (oferta: OfertaItem) => void;
};

const OfertasList3: React.FC<Props> = ({ ofertas, onSelectOferta }) => {
  const [pressedId, setPressedId] = useState<number | string | null>(null);

  const renderItem = ({ item }: { item: OfertaItem }) => {
    return (
      <List.Item
        title={item.title}
        description={() => (
          <View style={styles.descContainer}>
            <Text style={[styles.subtitle, item.read && styles.readText]}>
              {item.subtitle}
            </Text>
            {item.time && (
              <Text style={[styles.time, item.read && styles.readText]}>
                {item.time}
              </Text>
            )}
          </View>
        )}
        style={[
          styles.item,
          pressedId === item.id && styles.selectedItem,
          item.read && styles.readItem,
        ]}
        titleStyle={[
          styles.title,
          pressedId === item.id ? styles.selectedTitle : undefined,
          item.read && styles.readText,
        ]}
        onPress={() => onSelectOferta(item)}
        onPressIn={() => setPressedId(item.id)}
        onPressOut={() => setPressedId(null)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={ofertas}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
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
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  selectedTitle: {
    fontWeight: 'bold',
  },
  selectedItem: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  descContainer: {
    flexDirection: 'column',
    gap: 2,
    marginTop: 2,
  },
  subtitle: {
    color: '#D0D0D0',
    fontSize: 14,
  },
  time: {
    color: '#9E9E9E',
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  item: {
    backgroundColor: '#1D1C21',
  },

  readItem: {
    backgroundColor: '#1d1c214d',
  },

  readText: {
    color: '#585959ff',
  },
});

export default OfertasList3;
