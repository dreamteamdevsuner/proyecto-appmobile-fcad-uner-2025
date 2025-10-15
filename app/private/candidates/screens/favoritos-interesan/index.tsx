import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ROUTES from '../../../candidates/navigator/routes';
import { PrivateStackParamList } from '../../../candidates/navigator/types';
import { OfertaItem } from '../../../../../types/OfertaItem';
import { OfertasList } from '../../../../../components/listas';
import OfertasList2 from '../../../../../components/listas/ofertas-list/OfertasList2';
import OfertasList3 from '../../../../../components/listas/ofertas-list/OfertasList3';

type Props = NativeStackScreenProps<
  PrivateStackParamList,
  ROUTES.CANDIDATE_FAVORITOS_INTERESANTES
>;

// Datos de ejemplo para ofertas interesantes
const ofertasInteresantes: OfertaItem[] = [
  {
    id: 1,
    title: 'UI Designer - Lovelace Agency',
    subtitle: 'Publicado por Ann Lynn Parker',
  },
  {
    id: 2,
    title: 'Visual Designer - Lovelace Agency',
    subtitle: 'Publicado por Ann Lynn Parker',
  },
  {
    id: 3,
    title: 'Product Designer - Creative Studio',
    subtitle: 'Publicado por María González',
  },
  {
    id: 4,
    title: 'UX Researcher - TechStart',
    subtitle: 'Publicado por Carlos Ruiz',
  },
  {
    id: 5,
    title: 'Graphic Designer - Brand Agency',
    subtitle: 'Publicado por Laura Martínez',
  },
  {
    id: 6,
    title: 'Frontend Designer - WebStudio',
    subtitle: 'Publicado por Diego López',
  },
  {
    id: 7,
    title: 'Digital Designer - MediaCorp',
    subtitle: 'Publicado por Ana Fernández',
  },
  {
    id: 8,
    title: 'Brand Designer - DesignLab',
    subtitle: 'Publicado por Roberto Silva',
  },
];

const FavoritosInteresantesScreen: React.FC<Props> = ({
  route,
  navigation,
}) => {
  const { title } = route.params;

  const handleSelectOferta = (oferta: OfertaItem) => {
    navigation.navigate(ROUTES.CANDIDATE_TEST, {
      title: oferta.title,
      company: oferta.subtitle || 'Empresa',
    });
  };

  const handleDeleteOferta = (oferta: OfertaItem) => {
    console.log('Eliminar oferta:', oferta);
    // Aquí podrías implementar la lógica para eliminar la oferta de favoritos
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
          <Text style={styles.title}>Me interesan</Text>
        </View>
        <OfertasList3
          ofertas={ofertasInteresantes}
          onSelectOferta={handleSelectOferta}
          onDeleteOferta={handleDeleteOferta}
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
});

export default FavoritosInteresantesScreen;
