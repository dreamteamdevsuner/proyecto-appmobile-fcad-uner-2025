import React, { useState } from 'react';
import { View, FlatList, StyleSheet, ListRenderItem } from 'react-native';
import { List, Avatar, IconButton } from 'react-native-paper';
import Confirmacion from '../../confirmacion/Confirmacion';
import { UserItem } from '../../../types/UserItem';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrivateStackParamList } from '../../../app/private/recruiter/navigator/types';
import ROUTES from '../../../app/private/recruiter/navigator/routes';

type NavigationProp = NativeStackNavigationProp<
  PrivateStackParamList,
  ROUTES.RECRUITER_MENSAJERIA
>;

type Props = {
  showOferta?: boolean;
  users: UserItem[];
  showMessageIcon?: boolean;
  onUserPress?: (user: UserItem) => void;
  onMessagePress?: (user: UserItem) => void;
};

const UserList: React.FC<Props> = ({
  showOferta = false,
  users,
  showMessageIcon = true,
  onUserPress,
  onMessagePress,
}) => {
  const navigation = useNavigation<NavigationProp>();

  const [pressedId, setPressedId] = useState<number | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  const openDialog = (user: UserItem) => {
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
  const renderItem: ListRenderItem<UserItem> = ({ item }) => {
    return (
      <List.Item
        title={item.name}
        style={[
          { paddingRight: 0, paddingLeft: 10 },
          pressedId === item.id && styles.selectedItem,
        ]}
        contentStyle={{ paddingRight: 0 }}
        description={showOferta ? `De oferta ${item.ofertaName}` : item.role}
        titleStyle={pressedId === item.id ? styles.selectedTitle : undefined}
        left={() =>
          item.avatarUrl ? (
            <Avatar.Image size={40} source={{ uri: item.avatarUrl }} />
          ) : (
            <Avatar.Text size={40} label={item.name.charAt(0)} />
          )
        }
        onPress={() => {
          if (onUserPress) onUserPress(item);
        }}
        right={() => (
          <View style={styles.actions}>
            {showMessageIcon && (
              <IconButton
                icon="email"
                onPress={() => {
                  console.log(onMessagePress);

                  if (onMessagePress) onMessagePress(item);
                }}
              />
            )}
            <IconButton
              icon="delete"
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
      <FlatList<UserItem>
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString() + item.name}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        ListEmptyComponent={<List.Item title="No hay usuarios" />}
      />

      <Confirmacion
        visible={dialogVisible}
        title="Confirmar acción"
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
  selectedItem: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});

export default UserList;
