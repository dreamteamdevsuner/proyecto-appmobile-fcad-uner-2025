import { FlatList, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { OfertaItem } from '../../../../../types';
import { UserItemInfo } from '@models/index';
import { PrivateStackParamList } from '../../navigator/types';
import { UserList } from '../../../../../components/listas';
import ROUTES from '../../navigator/routes';

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

var users: UserItemInfo[] = [
  {
    id: '100',
    name: 'Ana Lopez Gonzales',
    role: 'UX/UI',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    ofertaId: 1,
  },
];

users.map(
  (user) =>
    (user.ofertaName = ofertas.find(
      (oferta) => oferta.id === user.ofertaId,
    )?.title),
);

type Props = NativeStackScreenProps<
  PrivateStackParamList,
  ROUTES.CANDIDATE_MENSAJERIA
>;

const Mensajeria: React.FC<Props> = ({ navigation }) => {
  const handleSelectUser = (user: UserItemInfo) => {
    navigation.navigate(ROUTES.CANDIDATE_CONVERSACION, {
      title: user.name,
      myName: 'Profesional',
      otherAvatarUrl: user.avatarUrl,
      myAvatarUrl: undefined,
    });
  };

  return (
    <View style={styles.container}>
      <View
        style={
          (styles.titleContainer,
          {
            backgroundColor: '#F1836A',
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
        <Text style={styles.title}>Todos mis chats</Text>
      </View>
      <UserList
        showOferta={true}
        users={users}
        showMessageIcon={false}
        onUserPress={handleSelectUser}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 0,
    flex: 1,
    backgroundColor: '#1D1C21',
    borderRadius: 15,
  },
  section: {
    backgroundColor: '#cdc7ceff',
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    color: '#1D1C21',
  },
  titleContainer: {
    fontSize: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderTopEndRadius: 15,
    borderTopStartRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: '100%',
    height: 48,
  },
  noUsers: {
    fontSize: 14,
    marginLeft: 15,
    fontStyle: 'italic',
    color: 'gray',
  },
});

export default Mensajeria;
