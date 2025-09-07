import React, { useState } from 'react';
import { View, FlatList, StyleSheet, ListRenderItem } from 'react-native';
import { List, Avatar, IconButton } from 'react-native-paper';
import { Confirmacion } from '../../index';
type User = {
  id: number;
  name: string;
  avatarUrl?: string;
  role: string;
};

type Props = {
  users: User[];
};

const UserList: React.FC<Props> = ({ users }) => {
  const [pressedId, setPressedId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  const openDialog = (user: User) => {
    setSelectedUser(user);
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setTimeout(() => {
      setSelectedUser(null);
    }, 300);
  };

  const confirmAction = () => {
    if (selectedUser) {
      console.log(selectedUser.name, 'fue eliminado.');
    }
    closeDialog();
  };
  const renderItem: ListRenderItem<User> = ({ item }) => {
    return (
      <List.Item
        title={item.name}
        style={{ paddingRight: 0 }}
        contentStyle={{ paddingRight: 0 }}
        description={item.role}
        titleStyle={pressedId === item.id ? styles.selectedTitle : undefined}
        left={() =>
          item.avatarUrl ? (
            <Avatar.Image size={40} source={{ uri: item.avatarUrl }} />
          ) : (
            <Avatar.Text size={40} label={item.name.charAt(0)} />
          )
        }
        right={() => (
          <View style={styles.actions}>
            <IconButton
              icon='email'
              onPress={() => {
                console.log(`Enviar mensaje a ${item.name}`);
              }}
            />
            <IconButton
              icon='delete'
              onPress={() => {
                console.log(`Eliminar a ${item.name}`);
                openDialog(item);
              }}
            />
          </View>
        )}
        onPressIn={() => setPressedId(item.id)}
        onPressOut={() => setPressedId(null)}
      />
    );
  };
  return (
    <View style={styles.container}>
      <FlatList<User>
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString() + item.name}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        ListEmptyComponent={<List.Item title='No hay usuarios' />}
      />

      <Confirmacion
        visible={dialogVisible}
        title='Confirmar acción'
        message={`¿Seguro que deseas eliminar a ${selectedUser?.name}?`}
        onConfirm={confirmAction}
        onCancel={closeDialog}
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
  actions: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
});

export default UserList;
