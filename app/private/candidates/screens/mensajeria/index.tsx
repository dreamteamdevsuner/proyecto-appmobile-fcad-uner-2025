import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UserItemInfo } from '@models/index';
import { PrivateStackParamList } from '../../navigator/types';
import { UserList } from '../../../../../components/listas';
import ROUTES from '../../navigator/routes';
import { useAuth } from '@appContext/authContext';
import { useEffect, useState } from 'react';
import { getProfesionalChat } from '@services/ChatService';
import { FlatList } from 'react-native';

type Props = NativeStackScreenProps<
  PrivateStackParamList,
  ROUTES.CANDIDATE_MENSAJERIA
>;

const Mensajeria: React.FC<Props> = ({ navigation }) => {
  const {
    state: { user: usuarioLogueado },
  } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [chats, setChats] = useState<UserItemInfo[]>([]);
  const fetchOfertasUsuariosChat = async () => {
    try {
      if (usuarioLogueado) {
        setLoading(true);
        const chatsData = await getProfesionalChat(usuarioLogueado.id);
        setChats(chatsData);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOfertasUsuariosChat();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOfertasUsuariosChat();
    setRefreshing(false);
  };
  const handleSelectUser = (user: UserItemInfo) => {
    if (usuarioLogueado) {
      navigation.navigate(ROUTES.CANDIDATE_CONVERSACION, {
        title: user.name,
        myName: usuarioLogueado?.nombre,
        otherAvatarUrl: user.avatarUrl,
        myAvatarUrl: usuarioLogueado.fotoperfil || undefined,
        idOfertaTrabajoMatch: user.idOfertaTrabajoMatch,
      });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={['chats']}
        keyExtractor={(item) => item}
        showsVerticalScrollIndicator={false}
        renderItem={() => {
          return (
            <View>
              <View
                style={[
                  styles.titleContainer,
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
                  },
                ]}
              >
                <Text style={styles.title}>Todos mis chats</Text>
              </View>
              <UserList
                showOferta={true}
                users={chats}
                showMessageIcon={false}
                onUserPress={handleSelectUser}
              />
            </View>
          );
        }}
        ListEmptyComponent={<Text>No hay chats aún</Text>}
        refreshing={refreshing}
        onRefresh={onRefresh}
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
