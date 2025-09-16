import { StyleSheet, View } from 'react-native';
import { UserList } from '../../../../../components/listas';
import { UserItem } from '../../../../../types/UserItem';
import ROUTES from '../../navigator/routes';
import { PrivateStackParamList } from '../../navigator/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

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

type Props = NativeStackScreenProps<
  PrivateStackParamList,
  ROUTES.RECRUITER_FAVORITOS_OFERTA
>;

const FavoritosOferta: React.FC<Props> = ({ navigation }) => {
  const handleSelectUser = () => {
    console.log('Navegar a perfil de usuario');
    // Navegar a perfil de usuario
  };

  const handleSelectConversation = (user: UserItem) => {
    navigation.navigate(ROUTES.RECRUITER_CONVERSACION, {
      title: user.name,
      myName: 'Renata',
      otherAvatarUrl: user.avatarUrl,
      myAvatarUrl: undefined,
    });
  };
  return (
    <View style={styles.container}>
      <View style={[styles.listContainer, styles.section]}>
        <UserList
          users={users}
          showMessageIcon
          onUserPress={handleSelectUser}
          onMessagePress={handleSelectConversation}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#cdc7ceff',
    borderRadius: 15,
    padding: 10,
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

export default FavoritosOferta;
