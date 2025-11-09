import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import OfertasList3 from '../../../../../components/listas/ofertas-list/OfertasList3';
import { useAuth } from '../../../../../appContext/authContext';
import {
  getUserNotifications,
  markNotificationAsRead,
  AppNotification,
} from '../../../../../services/notifications/notifications.service';
import { timeAgo } from '../../../../../utils/timeAgo';
import { supabase } from '../../../../../supabase/supabaseClient';

import { useNavigation } from '@react-navigation/native';
import ROUTES from '../../../candidates/navigator/routes';
import { PrivateStackParamList } from '../../../candidates/navigator/types';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export default function NotificationsProfile() {
  const { state } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<PrivateStackParamList>>();

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    if (!state.user?.id) return;
    const data = await getUserNotifications(state.user.id.toString());
    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, [state.user?.id]);

  const handlePress = async (notif: any) => {
    await markNotificationAsRead(notif.id);

    switch (notif.tipo) {
      case 'match':
        navigation.navigate(ROUTES.CANDIDATE_FAVORITOS_TAB, {
          screen: ROUTES.CANDIDATE_FAVORITOS_MATCHS,
          params: { title: 'Mis Matchs' },
        });
        break;

      case 'mensaje':
        navigation.navigate(ROUTES.CANDIDATE_MENSAJERIA_TAB);
        break;

      default:
        console.log('Tipo de notificación no manejado:', notif.tipo);
    }
  };

  const handleDelete = async (notif: any) => {
    const { error } = await supabase
      .from('notificacion')
      .delete()
      .eq('id', notif.id);

    if (error) {
      console.error('Error eliminando notificación:', error);
      return;
    }

    loadNotifications(); // recargar lista
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#A06FA6" />
      </View>
    );
  }

  if (!notifications.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.noUsers}>No tenés notificaciones aún.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <OfertasList3
        ofertas={notifications.map((n) => ({
          id: n.id,
          title: n.ofertatrabajo?.titulo || 'Nueva notificación 💬',
          subtitle: `${n.texto}`,
          time: timeAgo(n.created_at ?? ''),
          tipo: n.tipo, // 👈 lo necesitamos para saber a dónde navegar
        }))}
        onSelectOferta={handlePress}
        onDeleteOferta={handleDelete}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10, flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noUsers: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    color: 'gray',
  },
});
