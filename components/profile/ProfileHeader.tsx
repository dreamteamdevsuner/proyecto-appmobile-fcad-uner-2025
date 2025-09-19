import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';
import { User } from '../../app/private/recruiter/screens/perfil';
import Ionicons from '@expo/vector-icons/Ionicons';
import Octicons from '@expo/vector-icons/Octicons';

interface ProfileHeaderProps {
  name: string;
  avatarUrl?: string;
  ocupation?: string;
  city: string;
  profileScreenType: ProfileScreenType;
}

export enum ProfileScreenType {
  RECRUITER_HOME_PROFILE = 'PerfilInicioReclutador',
  OTHER_PROFILE = 'PerfilAjeno',
  CANDIDATE_OWN_PROFILE = 'PerfilPropioCandidato',
  PREVIEW = 'VistaPrevia',
}

export const ProfileHeader = ({
  name,
  avatarUrl,
  ocupation,
  city,
  profileScreenType,
}: ProfileHeaderProps) => {
  return (
    <Surface style={styles.surface} mode="flat" elevation={4}>
      <Image
        source={{ uri: avatarUrl }}
        style={styles.image}
        width={124}
        height={124}
      />
      <View
        style={{
          gap: 4,
          flexDirection: 'column',
          alignContent: 'space-evenly',
          justifyContent: 'space-between',
          paddingVertical: 8,
          height: '100%',
          width: '100%',
          maxWidth: 180,
        }}
      >
        {profileScreenType === ProfileScreenType.RECRUITER_HOME_PROFILE && (
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
              gap: 8,
            }}
          >
            <Text style={{ fontSize: 24 }}>¡Hola {name}!</Text>
            <Text
              style={{
                fontSize: 12,
                flexShrink: 1,
                fontWeight: 400,
                color: '#49454F',
              }}
            >
              Nos alegra que volvieras.
            </Text>
          </View>
        )}
        {profileScreenType ===
        ProfileScreenType.RECRUITER_HOME_PROFILE ? null : (
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              gap: 4,
            }}
          >
            <Octicons name="location" size={20} color="#49454F" />
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ fontWeight: 600, color: '#49454F' }}
            >
              {city}
            </Text>
          </View>
        )}
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  surface: {
    padding: 16,
    height: 151,
    width: '95%',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 30,
    marginVertical: 8,
    marginHorizontal: 16,
    gap: 32,
    backgroundColor: '#E6E0E9',
    alignSelf: 'center',
  },
  image: {
    width: 124,
    height: 124,
    borderRadius: 20,
    backgroundColor: 'gray',
  },
});
