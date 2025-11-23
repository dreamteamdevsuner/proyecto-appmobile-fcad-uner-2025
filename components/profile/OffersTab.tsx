import React, { useMemo } from 'react';
import { FlatList, View, ListRenderItem, StyleSheet } from 'react-native';
import { Divider, IconButton, List } from 'react-native-paper';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import ROUTES from '../../app/private/recruiter/navigator/routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrivateStackParamList } from '../../app/private/recruiter/navigator/types';
import {
  PROFILE_ROUTES,
  ProfileTopTabParamList,
  RecruiterTabScreenProps,
} from '@app/private/shared/perfil/types';
import { OfertaConDetalles } from '@services/profile/ProfileService';
import { useProfileContext } from '@appContext/ProfileContext';

type OffersTabRouteProp = RouteProp<
  ProfileTopTabParamList,
  | PROFILE_ROUTES.ACTIVE_OFFERS
  | PROFILE_ROUTES.CLOSED_OFFERS
  | PROFILE_ROUTES.PAUSED_OFFERS
>;

const OffersTab = (): React.JSX.Element => {
  const route = useRoute<OffersTabRouteProp>();
  const { type } = route.params;

  const { activeOffers, pausedOffers, closedOffers, refreshing, onRefresh } =
    useProfileContext();

  const navigator =
    useNavigation<NativeStackNavigationProp<PrivateStackParamList>>();

  const offersToShow = useMemo(() => {
    switch (type) {
      case 'published':
        return activeOffers;
      case 'paused':
        return pausedOffers;
      case 'closed':
        return closedOffers;
      default:
        return [];
    }
  }, [type, activeOffers, pausedOffers, closedOffers]);

  const renderItem: ListRenderItem<OfertaConDetalles> = ({ item }) => {
    return (
      <List.Item
        title={item.titulo}
        description={item.descripcion}
        right={(props) => (
          <>
            <IconButton
              icon="pencil"
              onPress={() => {
                navigator.navigate(ROUTES.RECRUITER_EDITAR_OFERTA, {
                  ofertaId: item.id.toString(),
                });
              }}
            />
            <IconButton
              icon="eye"
              onPress={() => {
                navigator.navigate(ROUTES.RECRUITER_CREAR_OFERTA_PREVIEW, {
                  ofertaId: item.id.toString(),
                });
              }}
            />
            {/* <List.Icon {...props} icon={'chevron-right'} /> */}
          </>
        )}
        // onPress={() => {
        //   console.log('Pressing: ', item.titulo);

        //   navigator.navigate(ROUTES.RECRUITER_FAVORITOS_OFERTA, {
        //     ofertaId: item.id.toString(),
        //     title: item.titulo,
        //   });
        // }}
      />
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={offersToShow}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <List.Item
            title="No hay elementos."
            left={(props) => (
              <List.Icon {...props} icon="alert-circle-outline" />
            )}
          />
        }
        ItemSeparatorComponent={() => <Divider></Divider>}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1D1C21',
  },
  selectedTitle: {
    fontWeight: 'bold',
  },
  selectedItem: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});

export default OffersTab;
