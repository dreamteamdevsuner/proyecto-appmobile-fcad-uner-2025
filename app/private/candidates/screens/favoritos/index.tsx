import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Text, Icon } from 'react-native-paper';
import {
  UserListHorizontal,
  OfertasList,
} from '../../../../../components/listas';
import { UserItem } from '../../../../../types';
import { OfertaItem } from '../../../../../types/OfertaItem';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ROUTES from '../../../candidates/navigator/routes';
import { PrivateStackParamList } from '../../../candidates/navigator/types';

// Matchs recientes
const matchs: UserItem[] = [
  {
    id: 10, // id de la oferta
    name: 'Diseñador UX/UI',
    subtitle: 'Banco Santander',
  },
  {
    id: 9,
    name: 'Diseñador UX/UI Senior',
    subtitle: 'Mercado Libre',
  },
  {
    id: 8,
    name: 'Puesto en oferta',
    subtitle: 'Empresa',
  },
  {
    id: 7,
    name: 'Puesto en oferta',
    subtitle: 'Empresa',
  },
  {
    id: 6,
    name: 'Puesto en oferta',
    subtitle: 'Empresa',
  },
  {
    id: 5,
    name: 'Puesto en oferta',
    subtitle: 'Empresa',
  },
  {
    id: 4,
    name: 'Puesto en oferta',
    subtitle: 'Empresa',
  },
  {
    id: 3,
    name: 'Puesto en oferta',
    subtitle: 'Empresa',
  },
  {
    id: 2,
    name: 'Puesto en oferta',
    subtitle: 'Empresa',
  },
  {
    id: 1,
    name: 'Puesto en oferta',
    subtitle: 'Empresa',
  },
];

// Mis matchs
const ofertas: OfertaItem[] = [
  {
    id: 10, // id de la oferta
    title: 'Diseñador UX/UI - Banco Santander',
    subtitle: 'Publicado por Renata Schenider',
  },
  {
    id: 9,
    title: 'Diseñador UX/UI Senior - Mercado Libre',
    subtitle: 'Publicado por Mayra Roa',
  },
];

// Me interesa
const ofertasInteresantes: OfertaItem[] = [
  {
    id: 12, // id de la oferta
    title: 'UI Designer - Lovelace Agency',
    subtitle: 'Publicado por Ann Lynn Parker',
  }, 
  {
    id: 11,
    title: 'Visual Designer - Lovelace Agency',
    subtitle: 'Publicado por Ann Lynn Parker',
  },
];

type Props = NativeStackScreenProps<
  PrivateStackParamList,
  ROUTES.CANDIDATE_FAVORITOS
>;

const Favoritos: React.FC<Props> = ({ navigation }) => {
  const handleSelectUser = (user: UserItem) => {
    navigation.navigate(ROUTES.CANDIDATE_TEST, {
      title: user.name,
      company: user.subtitle || 'Empresa',
    });
  };
  const handleSelectOferta = (oferta: OfertaItem) => {
    navigation.navigate(ROUTES.CANDIDATE_TEST, {
      title: oferta.title,
      company: oferta.subtitle || 'Empresa',
    });
  };
  const handleSelectOfertaInteresante = (oferta: OfertaItem) => {
    navigation.navigate(ROUTES.CANDIDATE_TEST, {
      title: oferta.title,
      company: oferta.subtitle || 'Empresa',
    });
  };

  const handleViewAllMatchs = () => {
    navigation.navigate(ROUTES.CANDIDATE_FAVORITOS_MATCHS, {
      title: 'Mis matchs',
    });
  };

  const handleViewAllInteresantes = () => {
    navigation.navigate(ROUTES.CANDIDATE_FAVORITOS_INTERESANTES, {
      title: 'Me interesan',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Matchs recientes</Text>
        </View>
        <UserListHorizontal users={matchs} onSelectUser={handleSelectUser} />
      </View>

      <View style={[styles.listContainer, styles.section]}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Mis matchs</Text>
          <TouchableOpacity onPress={handleViewAllMatchs} style={styles.moreButton}>
            <Icon source="plus-circle" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        <OfertasList ofertas={ofertas} 
        onSelectOferta={handleSelectOferta} 
        />
      </View>

      <View style={[styles.listContainer, styles.section]}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Me interesan</Text>
          <TouchableOpacity onPress={handleViewAllInteresantes} style={styles.moreButton}>
            <Icon source="plus-circle" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        <OfertasList
          ofertas={ofertasInteresantes}
          onSelectOferta={handleSelectOfertaInteresante}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { backgroundColor: '#cdc7ceff', borderRadius: 15, padding: 10 },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: { fontWeight: 'bold', fontSize: 25, marginLeft: 15 },
  moreButton: {
    padding: 8,
    marginRight: 15,
  },
  container: { padding: 10, flex: 1, gap: 5 },
  listContainer: { flex: 1, gap: 5 },
});

export default Favoritos;
