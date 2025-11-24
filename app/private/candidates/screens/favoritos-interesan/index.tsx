import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';

import ROUTES from '../../../candidates/navigator/routes';
import { PrivateStackParamList } from '../../../candidates/navigator/types';
import { OfertaItem } from '../../../../../types/OfertaItem';
import OfertasList3 from '../../../../../components/listas/ofertas-list/OfertasList3';

import { useAuth } from '../../../../../appContext/authContext';
import { getOfertasPorEstadoProfesional } from '../../../../../services/OfertaService';

type Props = NativeStackScreenProps<
  PrivateStackParamList,
  ROUTES.CANDIDATE_FAVORITOS_INTERESANTES
>;

const FavoritosInteresantesScreen: React.FC<Props> = ({ navigation }) => {
  const {
    state: { user },
  } = useAuth();
  const [ofertasInteresantes, setOfertasInteresantes] = useState<OfertaItem[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  const loadInteresan = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await getOfertasPorEstadoProfesional(user.id, 1);

      const formateados: OfertaItem[] = data.map((item) => ({
        id: Number(item.ofertaId),
        title: item.titulo,
        subtitle: `En ${item.empresa}`,
      }));

      setOfertasInteresantes(formateados);
    } catch (e) {
      console.error('Error cargando interesantes:', e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadInteresan();
    }, [user]),
  );

  const handleSelectOferta = (oferta: OfertaItem) => {
    console.log('Ver oferta pendiente:', oferta.id);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.listContainer, styles.section]}>
        <View style={[styles.titleContainer, { backgroundColor: '#76BBC0' }]}>
          <Text style={styles.title}>Me interesan</Text>
        </View>

        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#76BBC0" />
          </View>
        ) : ofertasInteresantes.length > 0 ? (
          <OfertasList3
            ofertas={ofertasInteresantes}
            onSelectOferta={handleSelectOferta}
          />
        ) : (
          <View style={styles.centerContent}>
            <Text style={styles.emptyText}>No tienes likes pendientes.</Text>
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

export default FavoritosInteresantesScreen;
