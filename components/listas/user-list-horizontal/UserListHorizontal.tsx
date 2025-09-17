import React from 'react';
import {
  FlatList,
  StyleSheet,
  ListRenderItem,
  TouchableOpacity,
} from 'react-native';
import { Avatar, List, Text } from 'react-native-paper';
import { UserItem } from '../../../types/UserItem';

type Props = {
  users: UserItem[];
  onSelectUser?: (user: UserItem) => void;
};

const UserListHorizontal: React.FC<Props> = ({ users, onSelectUser }) => {
  const renderItem: ListRenderItem<UserItem> = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        if (onSelectUser) onSelectUser(item);
      }}
    >
      {item.avatarUrl ? (
        <Avatar.Image size={60} source={{ uri: item.avatarUrl }} />
      ) : (
        <Avatar.Text size={60} label={item.name.charAt(0)} />
      )}
      <Text style={styles.cardTitle}>{item.name}</Text>
      {item.subtitle && (
        <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <FlatList<UserItem>
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
  },
  selectedTitle: {
    fontWeight: 'bold',
  },
  card: {
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#666',
  },
});
export default UserListHorizontal;
