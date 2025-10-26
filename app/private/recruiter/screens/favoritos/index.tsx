import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { UserListHorizontal, ItemList } from '../../../../../components/listas';
import { UserItem, Item } from '@models/index';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrivateStackParamList as RecruiterStackParamList } from '../../navigator/types';
import { PrivateStackParamList as CandidateStackParamList } from '../../../candidates/navigator/types';
import ROUTES from '../../navigator/routes';
import CAND_ROUTES from '../../../candidates/navigator/routes';
import { CompositeNavigationProp } from '@react-navigation/native';
import { DBOfertaTrabajo } from '@database/DBOfertaTrabajo';
import { getOfertas } from '@services/OfertaService';
import { useEffect, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { matchs } from '@utils/mockOfertasMatch';

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
const Favoritos: React.FC<Props> = ({ navigation }) => {
  const [ofertas, setOfertas] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSelectOferta = (oferta: Item) => {
    navigation.navigate(ROUTES.RECRUITER_FAVORITOS_OFERTA, {
      title: oferta.titulo,
      ofertaId: oferta.id,
    });
  };
  const handleSelectUser = (user: UserItem) => {
    navigation.navigate(CAND_ROUTES.CANDIDATE_PROFILE, {
      userId: user.id,
      title: user.name,
    });
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const ofertasData: DBOfertaTrabajo[] = await getOfertas();
      const ofertasItem: Item[] = ofertasData.map((oferta) => ({
        id: oferta.id.toString(),
        titulo: oferta.titulo,
        subtitulo: `Postulantes: 11`,
      }));
      setOfertas(ofertasItem);
      console.log('Ofertas fetched:', ofertasData);
    } catch (error) {
      console.error('Error fetching ofertas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View
          style={
            (styles.titleContainer,
            {
              backgroundColor: '#F294AC',
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
          <Text style={styles.title}>Matchs recientes</Text>
        </View>
        <UserListHorizontal
          users={matchs}
          onSelectUser={handleSelectUser}
        ></UserListHorizontal>
      </View>
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
          <Text style={styles.title}>Mis matchs</Text>
          <TouchableOpacity
            onPress={fetchData}
            style={styles.refreshButton}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size={'small'} color="#6750A4" />
            ) : (
              <MaterialCommunityIcons
                name="refresh"
                size={28}
                color="#6750A4"
              />
            )}
          </TouchableOpacity>
        </View>
        <ItemList items={ofertas} onSelectItem={handleSelectOferta}></ItemList>
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 15,
    color: '#1D1C21',
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
  refreshButton: {
    marginRight: 20,
  },
});
export default Favoritos;
