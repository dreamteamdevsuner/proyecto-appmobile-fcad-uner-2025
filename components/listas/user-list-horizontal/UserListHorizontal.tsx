import React from 'react';
import {
  FlatList,
  StyleSheet,
  ListRenderItem,
  TouchableOpacity,
} from 'react-native';
import { Avatar, List, Text } from 'react-native-paper';
import { UserItemInfo } from '@models/index';

type Props = {
  users: UserItemInfo[];
  onSelectUser?: (user: UserItemInfo) => void;
};

const UserListHorizontal: React.FC<Props> = ({ users, onSelectUser }) => {
  const renderItem: ListRenderItem<UserItemInfo> = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        if (onSelectUser) onSelectUser(item);
      }}
    >
      {item.avatarUrl ? (
        <Avatar.Image size={60} source={{ uri: item.avatarUrl }} />
      ) : (
        <Avatar.Text
          size={60}
          label={item.name.charAt(0)}
          style={{ backgroundColor: item.avatarBgColor || '#DA79AE' }}
        />
      )}
      <Text style={styles.cardTitle}>{item.name}</Text>
      {item.subtitle && (
        <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <FlatList<UserItemInfo>
      data={users}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString() + item.name}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      ListEmptyComponent={
        <List.Item
          title="No hay elementos"
          left={(props) => <List.Icon {...props} icon="alert-circle-outline" />}
        />
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 5,
    gap: 15,
  },
  selectedTitle: {
    fontWeight: 'bold',
    padding: 30,
  },
  card: {
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  cardTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
});
export default UserListHorizontal;
