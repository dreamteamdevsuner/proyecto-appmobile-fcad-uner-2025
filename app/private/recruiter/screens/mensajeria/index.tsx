import { FlatList, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { UserItemInfo } from '@models/index';
import { PrivateStackParamList } from '../../navigator/types';
import { UserList } from '../../../../../components/listas';
import ROUTES from '../../navigator/routes';
import { useEffect, useState } from 'react';
import { useAuth } from '@appContext/authContext';
import { getOfertasUsuariosChat } from '@services/ChatService';
import { OfertasUsuariosChat } from '@models/OfertasUsuariosChat';

type Props = NativeStackScreenProps<
  PrivateStackParamList,
  ROUTES.RECRUITER_MENSAJERIA
>;

const Mensajeria: React.FC<Props> = ({ navigation }) => {
  const {
    state: { user: usuarioLogueado },
  } = useAuth();
  const [loading, setLoading] = useState(false);
  const [ofertasChats, setOfertasChats] = useState<OfertasUsuariosChat[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOfertasUsuariosChat = async () => {
    try {
      if (usuarioLogueado) {
        setLoading(true);
        const chatsData = await getOfertasUsuariosChat(usuarioLogueado.id);
        setOfertasChats(chatsData);
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
      navigation.navigate(ROUTES.RECRUITER_CONVERSACION, {
        title: user.name,
        myName: usuarioLogueado?.nombre,
        otherAvatarUrl: user.avatarUrl,
        myAvatarUrl: usuarioLogueado.fotoperfil || undefined,
        idOfertaTrabajoMatch: user.idOfertaTrabajoMatch,
        idUsuarioProfesional: user.idProfesional,
      });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={ofertasChats}
        keyExtractor={(item) => item.idOferta}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const profesionales = item.chats;

          return (
            <View style={styles.section}>
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
                <Text style={styles.title}>Oferta: {item.nombreOferta}</Text>
              </View>
              {profesionales.length > 0 ? (
                <UserList
                  users={profesionales}
                  showOferta={false}
                  showMessageIcon={false}
                  showDeleteIcon={false}
                  showChevronIcon={true}
                  onUserPress={handleSelectUser}
                />
              ) : (
                <Text style={styles.noUsers}>No hay postulantes aún</Text>
              )}
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
    padding: 10,
    flex: 1,
  },
  section: {
    backgroundColor: '#1D1C21',
    borderRadius: 15,
    padding: 0,
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
