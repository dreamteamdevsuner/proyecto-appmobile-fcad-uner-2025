import { FlatList, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { UserList } from '../../../../components/listas';
import { useState } from 'react';
import { UserItem } from '../../../../types/UserItem';
import { OfertaItem } from '../../../../types/OfertaItem';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrivateStackParamList } from '../../../../navigator/types';

const ofertas: OfertaItem[] = [
  { id: 1, title: 'UX Santander' },
  { id: 2, title: 'Frontend Naranja' },
  { id: 3, title: 'Developer Shopify' },
  { id: 4, title: 'UI Desegner', subtitle: 'Subtítulo 4' },
  { id: 5, title: 'Full Stack Banco Provincia', subtitle: 'Subtítulo 5' },
  { id: 6, title: 'Backend Santender', subtitle: 'Subtítulo 6' },
  { id: 7, title: 'Backend Naranja', subtitle: 'Subtítulo 7' },
  { id: 8, title: 'DevOs Globant', subtitle: 'Subtítulo 8' },
  { id: 9, title: 'RRHH Santender', subtitle: 'Subtítulo 9' },
  { id: 10, title: 'RRHH Naranja', subtitle: 'Subtítulo 10' },
  { id: 11, title: 'RRHH Globant', subtitle: 'Subtítulo 11' },
];

const users: UserItem[] = [
  {
    id: 100,
    name: 'Ana Lopez Gonzales',
    role: 'UX/UI',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    ofertaId: 1,
  },
  {
    id: 2,
    name: 'Juan Rio Bravo',
    role: 'Frontend',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    ofertaId: 2,
  },
  {
    id: 3,
    name: 'Juana Costa',
    role: 'Developer',
    ofertaId: 3,
  },
  {
    id: 4,
    name: 'Martín Pérez',
    role: 'Frontend',
    ofertaId: 2,
  },
  {
    id: 5,
    name: 'Camilo Cuevas',
    role: 'UX /UI',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    ofertaId: 2,
  },
  {
    id: 6,
    name: 'Sofia Reyes',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    role: 'UX /UI',
    ofertaId: 5,
  },
  {
    id: 7,
    name: 'Rosa Ramos',
    role: 'UX /UI',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    ofertaId: 5,
  },
  { id: 8, name: 'John Doe', role: 'UX /UI', ofertaId: 1 },
  {
    id: 9,
    name: 'Jude Smith',
    role: 'UX /UI',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    ofertaId: 2,
  },
  {
    id: 10,
    name: 'Leonor Lewis',
    role: 'UX /UI',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    ofertaId: 3,
  },
  { id: 11, name: 'Luis García', role: 'UX /UI', ofertaId: 7 },
  { id: 12, name: 'Elba Gomez', role: 'UX /UI', ofertaId: 9 },
];

type MensajeriaNavigationProp = NativeStackNavigationProp<
  PrivateStackParamList,
  'Mensajería'
>;

type Props = {
  navigation: MensajeriaNavigationProp;
};

const Mensajeria: React.FC<Props> = ({ navigation }) => {
  const handleSelectUser = (user: UserItem) => {
    navigation.navigate('Conversación', {
      title: user.name,
      myName: 'Renata',
      otherAvatarUrl: user.avatarUrl,
      myAvatarUrl: undefined,
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={ofertas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          // Filtrar los usuarios que se postularon a esta oferta
          const postulantes = users.filter((u) => u.ofertaId === item.id);

          return (
            <View style={styles.section}>
              <Text style={styles.title}>{item.title}</Text>
              {postulantes.length > 0 ? (
                <UserList
                  users={postulantes}
                  showMessageIcon={false}
                  onUserPress={handleSelectUser}
                />
              ) : (
                <Text style={styles.noUsers}>No hay postulantes aún</Text>
              )}
            </View>
          );
        }}
      />
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
    fontWeight: 'bold',
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

export default Mensajeria;
