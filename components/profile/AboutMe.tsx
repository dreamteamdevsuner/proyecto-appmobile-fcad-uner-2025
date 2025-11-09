import {
  Text,
  FlatList,
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

export const AboutMe = () => {
  const { user, refreshing, onRefresh } = useProfileContext();

  if (!user) {
    return <ActivityIndicator />;
  }

  console.log(user);
  console.log('Estudios: ', user.estudios);
  console.log('Exp: ', user.experiencia);

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
      <Surface mode="flat" elevation={2} style={styles.surfaceDescription}>
        <Text style={styles.title}>Sobre mí:</Text>
        <Text style={styles.textContent}>{user!.bio}</Text>
      </Surface>

      <CustomDivider />

      <Surface mode="flat" elevation={2} style={styles.surfaceDescription}>
        <Text style={styles.title}>Estudios formales:</Text>
        {user!.estudios?.map((study, idx) => (
          <Text key={idx} style={styles.textContent}>
            {study.fechainicio ? `${study.fechainicio} - ` : ''}
            {study.fechafin ?? 'Act.'}: {study.titulo} (
            {study.nombreinstitucion ?? ''})
          </Text>
        ))}
      </Surface>

      {/* Creo que otros estudios no está en bd */}
      {/* <Surface mode="flat" elevation={2} style={styles.surfaceDescription}>
        <Text style={styles.title}>Otros estudios:</Text>
        {user!.otherStudies?.map((study, idx) => (
          <Text key={idx} style={styles.textContent}>
            {study}
          </Text>
        ))}
      </Surface> */}

      {user!.experiencia && user.experiencia.length > 0 && (
        <>
          <CustomDivider />
          <Surface mode="flat" elevation={2} style={styles.surfaceDescription}>
            <Text style={styles.title}>Experiencia laboral:</Text>
            {user!.experiencia?.map((exp, idx) => (
              <Text key={idx} style={styles.textContent}>
                {exp}
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
              renderItem={({ item, index }) => (
                <Pressable
                  key={index}
                  onPress={async () => {
                    await Linking.openURL(item.url);
                  }}
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
});

function CustomDivider() {
  return <Divider bold style={styles.divider} />;
}
