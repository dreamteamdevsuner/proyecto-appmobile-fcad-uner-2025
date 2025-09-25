import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ROUTES from '../../navigator/routes';
import { useNavigation } from '@react-navigation/native';
import { UserItem } from '../../../../../types/UserItem';
import { UserList } from '../../../../../components/listas';

const interesados: UserItem[] = [
  {
    id: 1,
    name: 'Juana Costa',
    subtitle: 'Le interesa tu oferta!',
    avatarUrl: '',
  },
  {
    id: 2,
    name: 'Martín Pérez',
    subtitle: 'Le interesa tu oferta!',
    avatarUrl: '',
  },
  {
    id: 3,
    name: 'Sofía Reyes',
    subtitle: 'Le interesa tu oferta!',
    avatarUrl: '',
  },
];

const respondieron: UserItem[] = [
  {
    id: 4,
    name: 'Juana Costa',
    subtitle: 'Ha respondido a tu mensaje.',
    avatarUrl: '',
  },
  {
    id: 5,
    name: 'Carolina Gómez',
    subtitle: 'Ha respondido a tu mensaje.',
    avatarUrl: '',
  },
];

const NotificacionesProfile = () => {
  const navigation = useNavigation();

  const handleSelectUser = (user: UserItem) => {
    navigation.navigate(ROUTES.RECRUITER_FAVORITOS_OFERTA, {
      userId: user.id,
      userName: user.name,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Mensajes</Text>
        <UserList users={respondieron} onUserPress={handleSelectUser} />
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Profesionales interesados</Text>
        <UserList users={interesados} onUserPress={handleSelectUser} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  section: {
    backgroundColor: '#cdc7ceff',
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
  },
  title: {
    fontWeight: 'regular',
    fontSize: 22,
    marginBottom: 10,
  },
  noUsers: {
    fontSize: 14,
    marginLeft: 15,
    fontStyle: 'italic',
    color: 'gray',
  },
});

export default NotificacionesProfile;
