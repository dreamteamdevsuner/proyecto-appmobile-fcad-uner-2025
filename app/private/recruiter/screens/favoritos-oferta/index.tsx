import { StyleSheet, View } from 'react-native';
import { UserList } from '../../../../../components/listas';
import { UserItem } from '../../../../../types/UserItem';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrivateStackParamList as RecruiterStackParamList } from '../../navigator/types';
import { PrivateStackParamList as CandidateStackParamList } from '../../../candidates/navigator/types';
import ROUTES from '../../navigator/routes';
import CAND_ROUTES from '../../../candidates/navigator/routes';
import { CompositeNavigationProp } from '@react-navigation/native';
import { Text } from 'react-native-paper';

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
type PrivateNav = NativeStackNavigationProp<
  RecruiterStackParamList,
  ROUTES.RECRUITER_FAVORITOS
>;
type CandidateNav = NativeStackNavigationProp<
  CandidateStackParamList,
  CAND_ROUTES.CANDIDATE_PROFILE
>;
type Props = {
  navigation: CompositeNavigationProp<PrivateNav, CandidateNav>;
};

const FavoritosOferta: React.FC<Props> = ({ navigation }) => {
  const handleSelectUser = (user: UserItem) => {
    console.log(user);

    navigation.navigate(CAND_ROUTES.CANDIDATE_PROFILE, {
      userId: user.id,
      title: user.name,
    });
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
        <View
          style={
            (styles.titleContainer,
            {
              backgroundColor: '#76BBC0',
              height: 48,
              width: '100%',
              borderTopStartRadius: 15,
              borderTopEndRadius: 15,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
              paddingHorizontal: 10,
              paddingVertical: 5,
            })
          }
        >
          <Text style={styles.title}>Oferta:</Text>
        </View>
        <UserList
          users={users}
          showOferta={false}
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
    backgroundColor: '#1D1C21',
    borderRadius: 15,
    padding: 0,
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 15,
    color: '#1D1C21',
  },
});

export default FavoritosOferta;
