import React from 'react';
import { FlatList, View, ListRenderItem, StyleSheet } from 'react-native';
import { Divider, List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import ROUTES from '../../app/private/recruiter/navigator/routes';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PrivateStackParamList } from '../../app/private/recruiter/navigator/types';
import {
  PROFILE_ROUTES,
  RecruiterTabScreenProps,
} from '@app/private/shared/perfil/types';
import { OfertaConDetalles } from '@services/profile/ProfileService';

type Props = RecruiterTabScreenProps<
  | PROFILE_ROUTES.ACTIVE_OFFERS
  | PROFILE_ROUTES.CLOSED_OFFERS
  | PROFILE_ROUTES.PAUSED_OFFERS
>;

const OffersTab = ({ route }: Props): React.JSX.Element => {
  const { offers } = route.params;

  const navigator =
    useNavigation<NativeStackNavigationProp<PrivateStackParamList>>();

  const renderItem: ListRenderItem<OfertaConDetalles> = ({ item }) => {
    return (
      <List.Item
        title={item.titulo}
        description={item.descripcion}
        right={(props) => <List.Icon {...props} icon={'chevron-right'} />}
        onPress={() => {
          console.log('Pressing: ', item.titulo);

          navigator.navigate(ROUTES.RECRUITER_FAVORITOS_OFERTA, {
            ofertaId: item.id.toString(),
            title: item.titulo,
          });
        }}
      />
    );
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={offers}
        renderItem={renderItem}
        keyExtractor={(item) => item.titulo.toString()}
        ListEmptyComponent={
          <List.Item
            title="No hay elementos."
            left={(props) => (
              <List.Icon {...props} icon="alert-circle-outline" />
            )}
          />
        }
        ItemSeparatorComponent={() => <Divider></Divider>}
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
