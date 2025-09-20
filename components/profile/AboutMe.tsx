import { Text, FlatList, ScrollView, Pressable, Linking } from 'react-native';
import { StyleSheet } from 'react-native';
import { Surface, Avatar } from 'react-native-paper';
import { User } from '../../app/private/recruiter/screens/perfil';

export const AboutMe = (user: User) => {
  return (
    <ScrollView contentContainerStyle={styles.tabContent}>
      <Surface mode="flat" elevation={2} style={styles.surfaceDescription}>
        <Text style={styles.title}>Sobre mí:</Text>
        <Text style={styles.textContent}>{user.bio}</Text>
      </Surface>

      <Surface mode="flat" elevation={2} style={styles.surfaceDescription}>
        <Text style={styles.title}>Estudios formales:</Text>
        {user.studies?.map((study, idx) => (
          <Text key={idx} style={styles.textContent}>
            {study}
          </Text>
        ))}
      </Surface>

      <Surface mode="flat" elevation={2} style={styles.surfaceDescription}>
        <Text style={styles.title}>Otros estudios:</Text>
        {user.otherStudies?.map((study, idx) => (
          <Text key={idx} style={styles.textContent}>
            {study}
          </Text>
        ))}
      </Surface>

      <Surface mode="flat" elevation={2} style={styles.surfaceDescription}>
        <Text style={styles.title}>Experiencia laboral:</Text>
        {user.experience?.map((exp, idx) => (
          <Text key={idx} style={styles.textContent}>
            {exp}
          </Text>
        ))}
      </Surface>

      <Surface mode="flat" elevation={2} style={styles.surfaceDescription}>
        <Text style={styles.title}>Contacto</Text>
        <FlatList
          data={user.socialLinks}
          keyExtractor={(item, index) => index.toString()}
          horizontal={true}
          renderItem={({ item, index }) => (
            <Pressable
              key={index}
              onPress={async () => {
                await Linking.openURL(item.url);
              }}
            >
              <Avatar.Image
                size={45}
                source={{ uri: '../../../assets/skeleton-view.png' }}
              />
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
    backgroundColor: '#FEF7FF',
  },
  title: {
    fontWeight: 500,
    fontSize: 11,
    marginBottom: 8,
    color: '#49454F',
  },
  tabContent: {
    flexGrow: 1,
    backgroundColor: 'transparent',
    gap: 2,
  },
  textContent: {
    color: '#1D1B20',
    fontSize: 14,
    lineHeight: 20,
  },
});
