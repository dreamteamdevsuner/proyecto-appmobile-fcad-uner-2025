import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ROUTES from '../../../candidates/navigator/routes';
import { PrivateStackParamList } from '../../../candidates/navigator/types';
import { OfertaItem } from '../../../../../types/OfertaItem';
import { OfertasList } from '../../../../../components/listas';
import OfertasList2 from '../../../../../components/listas/ofertas-list/OfertasList2';

type Props = NativeStackScreenProps<
  PrivateStackParamList,
  ROUTES.CANDIDATE_FAVORITOS_MATCHS
>;

// Datos de ejemplo para todos los matchs
const allMatchs: OfertaItem[] = [
  {
    id: 1,
    title: 'Diseñador UX/UI - Banco Santander',
    subtitle: 'Publicado por Renata Schenider',
  },
  {
    id: 2,
    title: 'Diseñador UX/UI Senior - Mercado Libre',
    subtitle: 'Publicado por Mayra Roa',
  },
  {
    id: 3,
    title: 'Frontend Developer - TechCorp',
    subtitle: 'Publicado por Carlos Mendoza',
  },
  {
    id: 4,
    title: 'React Native Developer - StartupXYZ',
    subtitle: 'Publicado por Ana García',
  },
  {
    id: 5,
    title: 'UI/UX Designer - DesignStudio',
    subtitle: 'Publicado por Luis Fernández',
  },
  {
    id: 6,
    title: 'Mobile Developer - AppCompany',
    subtitle: 'Publicado por María López',
  },
  {
    id: 7,
    title: 'Full Stack Developer - WebAgency',
    subtitle: 'Publicado por Pedro Rodríguez',
  },
  {
    id: 8,
    title: 'Product Designer - InnovationLab',
    subtitle: 'Publicado por Sofía Martínez',
  },
];

const FavoritosMatchsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { title } = route.params;

  const handleSelectMatch = (match: OfertaItem) => {
    navigation.navigate(ROUTES.CANDIDATE_TEST, {
      title: match.title,
      company: match.subtitle || 'Empresa',
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

  return (
    <View style={styles.container}>
      <View style={[styles.listContainer, styles.section]}>
        <OfertasList2
          ofertas={allMatchs}
          onSelectOferta={handleSelectMatch}
          onMessageOferta={handleMessage}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#cdc7ceff',
    borderRadius: 15,
    padding: 10,
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
});

export default FavoritosMatchsScreen;
