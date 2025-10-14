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
import OfertasList2 from '../../../../../components/listas/ofertas-list/OfertasList2';
import OfertasList3 from '../../../../../components/listas/ofertas-list/OfertasList3';
import JobsyHeader from '../../../../../components/ui/JobsyHeader';
import { blue } from 'react-native-reanimated/lib/typescript/Colors';
import { setStatusBarBackgroundColor } from 'expo-status-bar';

type NativeStackNavigationProp = NativeStackScreenProps<
  PrivateStackParamList,
  ROUTES.CANDIDATE_FAVORITOS
>;

// Matchs recientes
const matchs: UserItem[] = [
  {
    id: 10, // id de la oferta
    name: 'Diseñador UX/UI',
    subtitle: 'Banco Santander',
    avatarBgColor: '#F2766C',
  },
  {
    id: 9,
    name: 'Diseñador UX/UI',
    subtitle: 'Mercado Libre',
    avatarBgColor: '#F2A25D',
  },
  {
    id: 8,
    name: 'Puesto en oferta',
    subtitle: 'Empresa',
    avatarBgColor: '#F1BA53',
  },
  {
    id: 7,
    name: 'Puesto en oferta',
    subtitle: 'Empresa',
    avatarBgColor: '#FFD482',
  },
  {
    id: 6,
    name: 'Puesto en oferta',
    subtitle: 'Empresa',
    avatarBgColor: '#F2766C',
  },
  {
    id: 5,
    name: 'Puesto en oferta',
    subtitle: 'Empresa',
    avatarBgColor: '#F2A25D',
  },
  {
    id: 4,
    name: 'Puesto en oferta',
    subtitle: 'Empresa',
    avatarBgColor: '#F1BA53',
  },
  {
    id: 3,
    name: 'Puesto en oferta',
    subtitle: 'Empresa',
    avatarBgColor: '#FFD482',
  },
  {
    id: 2,
    name: 'Puesto en oferta',
    subtitle: 'Empresa',
    avatarBgColor: '#F2766C',
  },
  {
    id: 1,
    name: 'Puesto en oferta',
    subtitle: 'Empresa',
    avatarBgColor: '#F2A25D',
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

  const handleSelectOfertaInteresante = (oferta: OfertaItem) => {
    navigation.navigate(ROUTES.CANDIDATE_TEST, {
      title: oferta.title,
      company: oferta.subtitle || 'Empresa',
    });
  };

  const handleMessage = (oferta: OfertaItem) => {
    navigation.navigate(ROUTES.CANDIDATE_CONVERSACION, {
      title: oferta.title,
      myName: 'Juana',
      otherAvatarUrl: undefined,
      myAvatarUrl: undefined,
    });
  };

  const handleDeleteInteresante = (oferta: OfertaItem) => {
    // Aquí implementarías la lógica para eliminar de interesantes
    console.log('Eliminando de interesantes:', oferta.title);
    // TODO: Implementar eliminación de la lista de interesantes
  };

  return (
    <View style={styles.container}>
      <View style={(styles.listContainer, styles.section)}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Matchs recientes</Text>
        </View>
        <UserListHorizontal users={matchs} onSelectUser={handleSelectUser} />
      </View>

      <View style={[styles.listContainer, styles.section]}>
        <View
          style={
            (styles.titleContainer,
            {
              backgroundColor: '#A06FA6',
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
            onPress={handleViewAllMatchs}
            style={styles.moreButton}
          >
            <Icon source="plus-circle" size={24} color="#1D1C21" />
          </TouchableOpacity>
        </View>
        <OfertasList2
          ofertas={ofertas}
          onSelectOferta={handleSelectOferta}
          onMessageOferta={handleMessage}
        />
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
          <Text style={styles.title}>Me interesan</Text>
          <TouchableOpacity
            onPress={handleViewAllInteresantes}
            style={styles.moreButton}
          >
            <Icon source="plus-circle" size={24} color="#1D1C21" />
          </TouchableOpacity>
        </View>
        <OfertasList3
          ofertas={ofertasInteresantes}
          onSelectOferta={handleSelectOfertaInteresante}
          onDeleteOferta={handleDeleteInteresante}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#1D1C21',
    borderRadius: 15,
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
    backgroundColor: '#DA79AE',
  },
  title: { fontWeight: 'bold', fontSize: 18, marginLeft: 15, color: '#1D1C21' },
  moreButton: {
    padding: 8,
    marginRight: 15,
  },
  container: { padding: 10, flex: 1, gap: 20 },
  listContainer: { flex: 1, gap: 5 },
});

export default Favoritos;
