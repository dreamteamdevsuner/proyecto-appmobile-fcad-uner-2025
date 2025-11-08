import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { List, IconButton } from 'react-native-paper';
import { OfertaItem } from '../../../types/OfertaItem';

type Props = {
  ofertas: OfertaItem[];
  onSelectOferta: (oferta: OfertaItem) => void;
  onDeleteOferta?: (oferta: OfertaItem) => void;
};

const OfertasList3: React.FC<Props> = ({
  ofertas,
  onSelectOferta,
  onDeleteOferta,
}) => {
  const [pressedId, setPressedId] = useState<number | string | null>(null);

  const renderItem = ({ item }: { item: OfertaItem }) => {
    return (
      <List.Item
        title={item.title}
        description={() => (
          <View style={styles.descContainer}>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
            {item.time && <Text style={styles.time}>{item.time}</Text>}
          </View>
        )}
        style={pressedId === item.id ? styles.selectedItem : undefined}
        titleStyle={[
          styles.title,
          pressedId === item.id ? styles.selectedTitle : undefined,
        ]}
        onPress={() => onSelectOferta(item)}
        onPressIn={() => setPressedId(item.id)}
        onPressOut={() => setPressedId(null)}
        right={() =>
          onDeleteOferta ? (
            <View style={styles.actions}>
              <IconButton
                icon="delete"
                size={20}
                iconColor="#B0B0B0"
                style={{ margin: 0 }}
                onPress={() => {
                  if (onDeleteOferta) onDeleteOferta(item);
                }}
              />
            </View>
          ) : null
        }
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
});

export default OfertasList3;
