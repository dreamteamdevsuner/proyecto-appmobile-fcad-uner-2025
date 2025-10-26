import { StyleSheet, View } from 'react-native';
import { UserList } from '../../../../../components/listas';
import { UserItem } from '@models/index';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrivateStackParamList as RecruiterStackParamList } from '../../navigator/types';
import { PrivateStackParamList as CandidateStackParamList } from '../../../candidates/navigator/types';
import ROUTES from '../../navigator/routes';
import CAND_ROUTES from '../../../candidates/navigator/routes';
import { Text } from 'react-native-paper';
import {
  CompositeNavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import React, { useEffect } from 'react';
import { DBUsuario } from '@database/DBUsuario';
import { getUsuariosMatchOferta } from '@services/UsuarioMatchService';

type PrivateNav = NativeStackNavigationProp<
  RecruiterStackParamList,
  ROUTES.RECRUITER_FAVORITOS_OFERTA
>;

type CandidateNav = NativeStackNavigationProp<
  CandidateStackParamList,
  CAND_ROUTES.CANDIDATE_PROFILE
>;

type RouteProps = RouteProp<
  RecruiterStackParamList,
  ROUTES.RECRUITER_FAVORITOS_OFERTA
>;

const FavoritosOferta: React.FC = () => {
  const navigation =
    useNavigation<CompositeNavigationProp<PrivateNav, CandidateNav>>();
  const route = useRoute<RouteProps>();
  const [loading, setLoading] = React.useState(false);
  const [usuarios, setUsuarios] = React.useState<UserItem[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const usuariosData: DBUsuario[] = await getUsuariosMatchOferta(
        route.params.ofertaId,
      );
      const usuariosItem: UserItem[] = usuariosData.map((usuario) => ({
        id: usuario.id,
        name: `${usuario.nombre} ${usuario.apellido}`,
        role: usuario.rol,
        subtitulo: `Postulantes: 11`,
        avatarUrl: usuario.fotoperfil || undefined,
      }));
      setUsuarios(usuariosItem);
    } catch (error) {
      console.error('Error fetching usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          users={usuarios}
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
