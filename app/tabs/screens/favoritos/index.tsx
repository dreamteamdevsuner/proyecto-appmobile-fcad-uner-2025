import { StyleSheet, View } from 'react-native';
import { useState } from 'react';
import { Button, Text } from 'react-native-paper';
import {
  UserList,
  UserListHorizontal,
  OfertasList,
} from '../../../../components/listas';
import { UserItem } from '../../../../types/UserItem';
import { OfertaItem } from '../../../../types/OfertaItem';

const ofertas: OfertaItem[] = [
  { id: 1, title: 'UX Santender', subtitle: 'Subtítulo 1' },
  { id: 2, title: 'Frontend Naranja', subtitle: 'Subtítulo 2' },
  { id: 3, title: 'Developer Shopify ', subtitle: 'Subtítulo 3' },
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
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    role: 'UX /UI',
  },
  {
    id: 2,
    name: 'Juan Rio Bravo',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    role: 'UX /UI',
  },
  { id: 3, name: 'Juana Costa', role: 'UX /UI' }, // sin avatar
  {
    id: 4,
    name: 'Martín Peréz',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    role: 'UX /UI',
  },
  {
    id: 5,
    name: 'Camilo Cuevas',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    role: 'UX /UI',
  },
  {
    id: 6,
    name: 'Sofia Reyes',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    role: 'UX /UI',
  },
  {
    id: 7,
    name: 'Rosa Ramos',
    role: 'UX /UI',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
  },
  { id: 8, name: 'John Doe', role: 'UX /UI' },
  {
    id: 9,
    name: 'Jude Smith',
    role: 'UX /UI',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 10,
    name: 'Leonor Lewis',
    role: 'UX /UI',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
  },
  { id: 11, name: 'Luis García', role: 'UX /UI' },
  { id: 12, name: 'Elba Gomez', role: 'UX /UI' },
];

const matchs: UserItem[] = [
  {
    id: 100,
    name: 'Ana Lopez Gonzales',
    subtitle: 'Frontend Naranja',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 2,
    name: 'Juan Rio Bravo',
    subtitle: 'UX Santender',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
  },
  { id: 3, name: 'Juana Costa', subtitle: 'RRHH Globant' }, // sin avatar
  {
    id: 4,
    name: 'Martín Peréz',
    subtitle: 'Developer Shopify',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 5,
    name: 'Camilo Cuevas',
    subtitle: 'UI Desegner',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: 6,
    name: 'Sofia Reyes',
    subtitle: 'RRHH Santender',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 7,
    name: 'Rosa Ramos',
    subtitle: 'UX Santender',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
  },
  { id: 8, name: 'John Doe', subtitle: 'Frontend Naranja' },
  {
    id: 9,
    name: 'Jude Smith',
    subtitle: 'UX Santender',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 10,
    name: 'Leonor Lewis',
    subtitle: 'Frontend Naranja',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
  },
];

export default function Favoritos() {
  const [selectedOfertaId, setSelectedOfertaId] = useState<number | null>(null);

  return (
    <View style={styles.container}>
      {selectedOfertaId ? (
        <>
          <View style={styles.titleContainer}>
            <Button onPress={() => setSelectedOfertaId(null)}>Volver</Button>
            <Text style={styles.title}>
              {ofertas.find((x) => x.id === selectedOfertaId)?.title}
            </Text>
          </View>
          <View style={[styles.listContainer, styles.section]}>
            <UserList users={users} showMessageIcon />
          </View>
        </>
      ) : (
        <>
          <View style={styles.section}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Matchs recientes</Text>
            </View>
            <UserListHorizontal users={matchs}></UserListHorizontal>
          </View>
          <View style={[styles.listContainer, styles.section]}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Mis matchs</Text>
            </View>
            <OfertasList
              ofertas={ofertas}
              setSelectedId={setSelectedOfertaId}
            ></OfertasList>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#cdc7ceff',
    borderRadius: 15,
    padding: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 25,
    marginLeft: 15,
  },
  container: {
    padding: 10,
    flex: 1,
    gap: 5,
  },
  listContainer: {
    flex: 1,
    gap: 5,
  },
});
