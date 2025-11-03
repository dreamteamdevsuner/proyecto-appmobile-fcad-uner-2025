import { View, Image, Text, StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';
import Octicons from '@expo/vector-icons/Octicons';

interface ProfileHeaderProps {
  nombre: string;
  fotoperfil?: string;
  rol?: string;
  ciudad?: string;
  profileScreenType: ProfileScreenType;
}

export enum ProfileScreenType {
  RECRUITER_HOME_PROFILE = 'PerfilInicioReclutador',
  OTHER_PROFILE = 'PerfilAjeno',
  CANDIDATE_OWN_PROFILE = 'PerfilPropioCandidato',
  PREVIEW = 'VistaPrevia',
}

export const ProfileHeader = ({
  nombre,
  fotoperfil,
  rol,
  ciudad,
  profileScreenType,
}: ProfileHeaderProps) => {
  return (
    <Surface style={styles.surface} mode="flat" elevation={4}>
      <Image
        source={{ uri: fotoperfil }}
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
            <Text style={{ fontSize: 24, color: '#FFFFFF' }}>
              ¡Hola {nombre.trim()}!
            </Text>
            <Text
              style={{
                fontSize: 12,
                flexShrink: 1,
                fontWeight: 400,
                color: '#FFFFFF',
              }}
            >
              Nos alegra que volvieras.
            </Text>
          </View>
        )}
        {profileScreenType === ProfileScreenType.OTHER_PROFILE && (
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
            <View>
              <Text style={{ fontSize: 24, color: '#FFFFFF' }}>{nombre}</Text>
              <Text style={{ fontSize: 16, flexShrink: 1, color: '#FFFFFF' }}>
                {rol}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 4 }}>
              <Octicons name="location" size={20} color="#FFFFFF" />
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ color: '#FFFFFF' }}
              >
                {ciudad}
              </Text>
            </View>
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
    backgroundColor: '#1D1C21',
    alignSelf: 'center',
  },
  image: {
    width: 124,
    height: 124,
    borderRadius: 20,
    backgroundColor: 'gray',
  },
});
