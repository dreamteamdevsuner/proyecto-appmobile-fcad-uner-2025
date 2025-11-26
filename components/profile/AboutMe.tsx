import {
  Text,
  FlatList,
  View,
  ScrollView,
  Pressable,
  Linking,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { StyleSheet } from 'react-native';
import { Surface, Avatar, Divider } from 'react-native-paper';
import { useProfileContext } from '@appContext/ProfileContext';
import { toTitleCase } from '@utils/titleCase';
import { getMonthName } from '@utils/getMonthName';

export const AboutMe = () => {
  const { user, refreshing, onRefresh, isOwnProfile } = useProfileContext();

  /**
   * Formatea una fecha en formato AAAA-MM-DD a "Mes. AAAA"
   * @param dateString fecha en formato AAAA-MM-DD o similar
   * @returns string formateado como "Sep. 2023" o cadena vacía si es inválida
   */
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const month = getMonthName(date.getMonth());
      const year = date.getFullYear();
      return `${month} ${year}`;
    } catch {
      return dateString;
    }
  };

  if (!user) {
    return <ActivityIndicator />;
  }

  const hasAnyData =
    (user.bio && user.bio.trim().length > 0) ||
    (user.estudios && user.estudios.length > 0) ||
    (user.experiencia && user.experiencia.length > 0) ||
    (user.enlaces && user.enlaces.length > 0);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.tabContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#A06FA6']}
          tintColor="#fff"
        />
      }
    >
      {!hasAnyData && isOwnProfile && (
        <>
          <Surface mode="flat" elevation={2} style={styles.surfaceDescription}>
            <Text style={[styles.textContent, styles.noDataText]}>
              ¡Agrega información para que los reclutadores conozcan más sobre
              ti!
            </Text>
          </Surface>
        </>
      )}

      {!hasAnyData && !isOwnProfile && (
        <>
          <Surface mode="flat" elevation={2} style={styles.surfaceDescription}>
            <Text style={[styles.textContent, styles.noDataText]}>
              Aún no hay información para mostrar. Vuelve pronto ;)
            </Text>
          </Surface>
        </>
      )}

      {user!.bio && user.bio.trim().length > 0 && (
        <>
          <Surface mode="flat" elevation={2} style={styles.surfaceDescription}>
            <Text style={styles.title}>Sobre mí:</Text>
            <Text style={styles.textContent}>{user!.bio}</Text>
          </Surface>
          <CustomDivider />
        </>
      )}

      {user!.estudios && user.estudios.length > 0 && (
        <Surface mode="flat" elevation={2} style={styles.surfaceDescription}>
          <Text style={styles.title}>Estudios formales:</Text>
          {user!.estudios?.map((study, idx) => (
            <Text key={idx} style={styles.textContent}>
              {study.fechainicio ? `${formatDate(study.fechainicio)} - ` : ''}
              {study.fechafin ? formatDate(study.fechafin) : 'Act.'}:{' '}
              {study.titulo} ({study.nombreinstitucion ?? ''})
            </Text>
          ))}
        </Surface>
      )}

      {user!.experiencia && user.experiencia.length > 0 && (
        <>
          <CustomDivider />
          <Surface mode="flat" elevation={2} style={styles.surfaceDescription}>
            <Text style={styles.title}>Experiencia laboral:</Text>
            {user!.experiencia?.map((exp, idx) => (
              <Text key={idx} style={styles.textContent}>
                {exp.fechainicio ? `${formatDate(exp.fechainicio)} - ` : ''}
                {exp.fechafin ? formatDate(exp.fechafin) : 'Act.'}:{' '}
                {exp.posicion} en
                {exp.nombreempresa ? ` ${exp.nombreempresa}` : ''}
              </Text>
            ))}
          </Surface>
        </>
      )}

      {user!.enlaces && user.enlaces.length > 0 && (
        <>
          <CustomDivider />
          <Surface mode="flat" elevation={2} style={styles.surfaceDescription}>
            <Text style={styles.title}>Contacto</Text>
            <FlatList
              data={user!.enlaces}
              keyExtractor={(item, index) => index.toString()}
              horizontal={true}
              ItemSeparatorComponent={() => <View style={{ width: 12 }}></View>}
              renderItem={({ item, index }) => (
                <Pressable
                  key={index}
                  onPress={async () => {
                    await Linking.openURL(item.url);
                  }}
                  style={{ alignItems: 'center', gap: 4 }}
                >
                  <Avatar.Text
                    size={45}
                    label={item.tipoenlace.nombre?.charAt(0).toUpperCase()}
                  />
                  <Text style={styles.textContent}>
                    {toTitleCase(item.tipoenlace.nombre || '')}
                  </Text>
                </Pressable>
              )}
            />
          </Surface>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  surfaceDescription: {
    paddingTop: 16,
    paddingHorizontal: 32,
    paddingBottom: 32,
    backgroundColor: '#1D1C21',
  },
  title: {
    fontWeight: 500,
    fontSize: 11,
    marginBottom: 8,
    color: '#ffffff',
  },
  tabContent: {
    flexGrow: 1,
    backgroundColor: '#1D1C21',
    gap: 2,
  },
  textContent: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20,
  },
  divider: {
    backgroundColor: '#0A090F',
  },
  noDataText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});

function CustomDivider() {
  return <Divider bold style={styles.divider} />;
}
