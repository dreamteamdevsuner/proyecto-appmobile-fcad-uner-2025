import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import ROUTES from '../../../candidates/navigator/routes';
import { PrivateStackParamList } from '../../../candidates/navigator/types';
import { OfertaItem } from '../../../../../types/OfertaItem';
import OfertasList2 from '../../../../../components/listas/ofertas-list/OfertasList2';
import { useAuth } from '../../../../../appContext/authContext';
import { getOfertasPorEstadoProfesional } from '../../../../../services/OfertaService';

type Props = NativeStackScreenProps<
  PrivateStackParamList,
  ROUTES.CANDIDATE_FAVORITOS_MATCHS
>;

const FavoritosMatchsScreen: React.FC<Props> = ({ navigation }) => {
  const {
    state: { user },
  } = useAuth();
  const [allMatchs, setAllMatchs] = useState<OfertaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMatches = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await getOfertasPorEstadoProfesional(user.id, 2);
      const formateados: OfertaItem[] = data.map((item) => ({
        id: item.ofertaId.toString(),
        title: item.titulo,
        subtitle: `Match con ${item.empresa}`,
        idMatch: item.matchId,
      }));

      setAllMatchs(formateados);
    } catch (e) {
      console.error('Error cargando matchs:', e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadMatches();
    }, [user?.id]),
  );

  const handleSelectMatch = (match: OfertaItem) => {
    console.log('Ver oferta:', match.title);
    navigation.navigate(ROUTES.CANDIDATE_TAB_JOB_OFFER_SCREEN, {
      jobOfferId: match.id.toString(),
    });
  };

  const handleMessage = (oferta: OfertaItem) => {
    navigation.navigate(ROUTES.CANDIDATE_CONVERSACION, {
      title: oferta.title,
      myName: user?.nombre || 'Yo',
      otherAvatarUrl: undefined,
      myAvatarUrl: user?.fotoperfil || '',
      idOfertaTrabajoMatch: oferta.idMatch,
    });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.listContainer, styles.section]}>
        <View style={[styles.titleContainer, { backgroundColor: '#A06FA6' }]}>
          <Text style={styles.title}>Mis matchs </Text>
        </View>

        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#A06FA6" />
          </View>
        ) : allMatchs.length > 0 ? (
          <OfertasList2
            ofertas={allMatchs}
            onSelectOferta={handleSelectMatch}
            onMessageOferta={handleMessage}
          />
        ) : (
          <View style={styles.centerContent}>
            <Text style={styles.emptyText}>
              No tienes matches confirmados aún.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#1D1C21',
    borderRadius: 15,
    padding: 0,
    flex: 1,
    overflow: 'hidden',
  },
  container: {
    padding: 10,
    flex: 1,
    backgroundColor: '#000',
  },
  listContainer: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: '100%',
    backgroundColor: '#DA79AE',
  },
  title: { fontWeight: 'bold', fontSize: 18, color: '#1D1C21' },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: 'white',
    fontSize: 16,
    opacity: 0.7,
  },
});

export default FavoritosMatchsScreen;
