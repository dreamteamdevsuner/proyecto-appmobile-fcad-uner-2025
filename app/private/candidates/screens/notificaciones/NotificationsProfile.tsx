import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { OfertaItem } from '../../../../../types/OfertaItem';
import { OfertasList } from '../../../../../components/listas';
import ROUTES from '../../navigator/routes';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrivateStackParamList } from '../../navigator/types';

const data: OfertaItem[] = [
  {
    id: 1,
    title: 'Diseñador UX/UI - Banco Santander',
    subtitle: '¡Felicitaciones tenés un nuevo match!',
  },
  {
    id: 2,
    title: 'Diseñador UX/UI Senior - Mercado Libre',
    subtitle: '¡Felicitaciones tenés un nuevo match!',
  },
  {
    id: 3,
    title: 'Diseñador UX/UI - Proyecto Freelance',
    subtitle: '¡Felicitaciones tenés un nuevo match!',
  },
  {
    id: 4,
    title: 'UI Designer - Globant Gut',
    subtitle: '¡Felicitaciones tenés un nuevo match!',
  },
];

const dato: OfertaItem[] = [
  {
    id: 1,
    title: 'Diseñador UX/UI - Banco Santander',
    subtitle: 'Renata Scheneider te ha enviado un mensaje.',
  },
  {
    id: 2,
    title: 'Diseñador UX/UI Senior - Mercado Libre',
    subtitle: 'Mayra Roa te ha enviado un mensaje.',
  },
];

const NotificacionesProfile = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<PrivateStackParamList>>();

  const handleSelectOferta = (oferta: OfertaItem) => {
    navigation.navigate(ROUTES.CANDIDATE_FAVORITOS_MATCHS, {
      title: oferta.title,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>Matchs</Text>
        <OfertasList ofertas={data} onSelectOferta={handleSelectOferta} />
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Mensajes</Text>
        <OfertasList ofertas={dato} onSelectOferta={handleSelectOferta} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  section: {
    backgroundColor: '#cdc7ceff',
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
  },
  title: {
    fontWeight: 'regular',
    fontSize: 22,
    marginBottom: 10,
  },
  noUsers: {
    fontSize: 14,
    marginLeft: 15,
    fontStyle: 'italic',
    color: 'gray',
  },
});

export default NotificacionesProfile;
