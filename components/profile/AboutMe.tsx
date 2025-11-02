import {
  Text,
  FlatList,
  ScrollView,
  Pressable,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { StyleSheet } from 'react-native';
import { Surface, Avatar } from 'react-native-paper';
import {
  CandidateTabScreenProps,
  PROFILE_ROUTES,
} from '@app/private/shared/perfil/types';

type Props = CandidateTabScreenProps<PROFILE_ROUTES.ABOUT_ME>;

export const AboutMe = ({ route }: Props) => {
  const { user } = route.params;

  if (!user) {
    return <ActivityIndicator />;
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.tabContent}
    >
      <Surface mode="flat" elevation={2} style={styles.surfaceDescription}>
        <Text style={styles.title}>Sobre mí:</Text>
        <Text style={styles.textContent}>{user!.bio}</Text>
      </Surface>

      <Surface mode="flat" elevation={2} style={styles.surfaceDescription}>
        <Text style={styles.title}>Estudios formales:</Text>
        {user!.estudios?.map((study, idx) => (
          <Text key={idx} style={styles.textContent}>
            {study.titulo}
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

      <Surface mode="flat" elevation={2} style={styles.surfaceDescription}>
        <Text style={styles.title}>Experiencia laboral:</Text>
        {user!.experiencia?.map((exp, idx) => (
          <Text key={idx} style={styles.textContent}>
            {exp}
          </Text>
        ))}
      </Surface>

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
              <Avatar.Text size={45} label={item.name.slice(0, 1)} />
              <Text style={styles.textContent}>{item.name}</Text>
            </Pressable>
          )}
        />
      </Surface>
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
    backgroundColor: 'transparent',
    gap: 2,
  },
  textContent: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20,
  },
});
