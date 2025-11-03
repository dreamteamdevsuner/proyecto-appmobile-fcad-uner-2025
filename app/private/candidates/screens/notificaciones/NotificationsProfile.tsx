import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import OfertasList3 from '../../../../../components/listas/ofertas-list/OfertasList3';
import { useAuth } from '../../../../../appContext/authContext';
import {
  getUserNotifications,
  markNotificationAsRead,
  AppNotification,
} from '../../../../../services/notifications/notifications.service';

export default function NotificationsProfile() {
  const { state } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    if (!state.user?.id) return;
    console.log('User ID:', state.user.id);
    const data = await getUserNotifications(state.user.id.toString());
    console.log('Notificaciones traídas:', data);
    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, [state.user?.id]);

  const handlePress = async (notif: any) => {
    await markNotificationAsRead(notif.id);
    loadNotifications();
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#BEB52C" />
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
          title:
            n.tipo === 'match'
              ? 'Tenés un nuevo match 💛'
              : 'Tenés un nuevo mensaje 💬',
          subtitle: n.texto,
        }))}
        onSelectOferta={handlePress}
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
