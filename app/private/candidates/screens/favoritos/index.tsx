import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Text, Icon } from 'react-native-paper';
import { UserListHorizontal } from '../../../../../components/listas';
import OfertasList2 from '../../../../../components/listas/ofertas-list/OfertasList2';
import OfertasList3 from '../../../../../components/listas/ofertas-list/OfertasList3';
import { UserItem } from '../../../../../types';
import { OfertaItem } from '../../../../../types/OfertaItem';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ROUTES from '../../../candidates/navigator/routes';
import { PrivateStackParamList } from '../../../candidates/navigator/types';
import { useAuth } from '../../../../../appContext/authContext';
import { getOfertasPorEstadoProfesional } from '../../../../../services/OfertaService';
import { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<
  PrivateStackParamList,
  ROUTES.CANDIDATE_FAVORITOS
>;

const Favoritos: React.FC<Props> = ({ navigation }) => {
  const { state } = useAuth();
  const user = state?.user;

  const [loading, setLoading] = useState(false);
  const [matchsRecientes, setMatchsRecientes] = useState<UserItem[]>([]);
  const [misMatchs, setMisMatchs] = useState<OfertaItem[]>([]);
  const [meInteresan, setMeInteresan] = useState<OfertaItem[]>([]);

  const fetchDatos = async () => {
    console.log('LOG USER ID', user?.id);

    if (!user || !user.id) {
      console.log('Usuario no cargado aún, esperando...');
      return;
    }

    try {
      setLoading(true);

      const dataInteresan = await getOfertasPorEstadoProfesional(user.id, 1);

      const dataMatches = await getOfertasPorEstadoProfesional(user.id, 2);

      const matchesFormateados: OfertaItem[] = dataMatches.map((m) => ({
        id: Number(m.ofertaId),
        title: m.titulo,
        subtitle: `En ${m.empresa}`,
      }));
      setMisMatchs(matchesFormateados);

      const burbujasFormateadas: UserItem[] = dataMatches.map((m, index) => ({
        id: m.ofertaId.toString(),
        name:
          m.titulo.length > 10 ? m.titulo.substring(0, 10) + '...' : m.titulo,
        subtitle:
          m.empresa.length > 10
            ? m.empresa.substring(0, 10) + '...'
            : m.empresa,

        avatarBgColor: ['#F2766C', '#F2A25D', '#F1BA53', '#FFD482'][index % 4],
      }));
      setMatchsRecientes(burbujasFormateadas);

      const interesanFormateados: OfertaItem[] = dataInteresan.map((m) => ({
        id: Number(m.ofertaId),
        title: m.titulo,
        subtitle: `En ${m.empresa}`,
      }));
      setMeInteresan(interesanFormateados);
    } catch (error) {
      console.error('Error cargando favoritos candidato:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDatos();
    }, [user]),
  );

  const handleSelectOferta = (oferta: OfertaItem) => {
    console.log('Ver oferta', oferta.id);
  };

  const handleMessage = (oferta: OfertaItem) => {
    navigation.navigate(ROUTES.CANDIDATE_CONVERSACION, {
      title: oferta.title,
      myName: user?.nombre || 'Yo',
      otherAvatarUrl: undefined,
      myAvatarUrl: undefined,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Matchs recientes</Text>
        </View>
        <UserListHorizontal
          users={matchsRecientes}
          onSelectUser={(u) => console.log('Ver oferta')}
        />
      </View>

      <View style={[styles.listContainer, styles.section]}>
        <View style={[styles.titleContainer, { backgroundColor: '#A06FA6' }]}>
          <Text style={styles.title}>Mis matchs</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(ROUTES.CANDIDATE_FAVORITOS_MATCHS, {
                title: 'Mis matchs',
              })
            }
            style={styles.moreButton}
          >
            <Icon source="plus-circle" size={24} color="#1D1C21" />
          </TouchableOpacity>
        </View>

        {misMatchs.length > 0 ? (
          <OfertasList2
            ofertas={misMatchs}
            onSelectOferta={handleSelectOferta}
            onMessageOferta={handleMessage}
          />
        ) : (
          !loading && (
            <Text style={styles.emptyText}>
              Aún no tienes matches confirmados.
            </Text>
          )
        )}
      </View>

      <View style={[styles.listContainer, styles.section]}>
        <View style={[styles.titleContainer, { backgroundColor: '#76BBC0' }]}>
          <Text style={styles.title}>Me interesan</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(ROUTES.CANDIDATE_FAVORITOS_INTERESANTES, {
                title: 'Me interesan',
              })
            }
            style={styles.moreButton}
          >
            <Icon source="plus-circle" size={24} color="#1D1C21" />
          </TouchableOpacity>
        </View>
        {meInteresan.length > 0 ? (
          <OfertasList3
            ofertas={meInteresan}
            onSelectOferta={handleSelectOferta}
          />
        ) : (
          !loading && (
            <Text style={styles.emptyText}>
              No has dado like a ninguna oferta aún.
            </Text>
          )
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#1D1C21',
    borderRadius: 15,
    paddingBottom: 10,
    marginBottom: 10,
  },
  titleContainer: {
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
    backgroundColor: '#F294AC',
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
    backgroundColor: '#000',
  },
  listContainer: {
    flex: 1,
  },
  emptyText: {
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
    opacity: 0.7,
  },
  moreButton: {
    padding: 8,
    marginRight: 5,
  },
});

export default Favoritos;
