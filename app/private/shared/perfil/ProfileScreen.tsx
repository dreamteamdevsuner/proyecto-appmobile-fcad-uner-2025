import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { PrivateStackParamList as RecruiterStackParamList } from '../../recruiter/navigator/types';
import { PrivateStackParamList as CandidateStackParamList } from '../../candidates/navigator/types';
import { ProfileScreenType } from '../../../../components/profile/ProfileHeader';
import { HorizontalChips } from '../../../../components/ui/HorizontalChips';
import { Offer } from '../../../../types/ProfileUser';
import {
  AboutMe,
  OffersTab,
  ProfileHeader,
  WhatIDo,
} from '../../../../components/profile/index';
import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import ROUTES from '../../recruiter/navigator/routes';
import CAND_ROUTES from '../../candidates/navigator/routes';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {
  getUsuarioBase,
  getEnlaces,
  getProfesional,
  getEstudios,
  getExperiencia,
  getSkills,
  getReclutador,
  getOfertasReclutador,
  OfertaConDetalles,
} from '@services/profile/ProfileService';
import {
  PROFILE_ROUTES,
  ProfileStackParams,
  ProfileTopTabParamList,
} from './types';
import { FAB, Portal } from 'react-native-paper';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../../../appContext/authContext';
import { Role } from '@services/interfaces/TipoUsuario.interface';

type Props = NativeStackScreenProps<
  ProfileStackParams,
  CAND_ROUTES.CANDIDATE_PROFILE | ROUTES.RECRUITER_PROFILE
>;

const Tab = createMaterialTopTabNavigator<ProfileTopTabParamList>();

// TODO: extraer
export type PerfilView = {
  id: string;
  nombre?: string;
  apellido?: string;
  email?: string;
  bio?: string | null;
  fotoPerfil?: string;
  rol?: string;
  direccion?: { ciudad?: string } | null;
  tipoUsuario?: { nombre?: string } | null;
  enlaces?: any[];
  estudios?: {
    activo: boolean;
    fechafin: string | null;
    fechainicio: string | null;
    id: string;
    idprofesional: string;
    nombreinstitucion: string | null;
    titulo: string;
  }[];
  experiencia?: any[];
  skills?: {
    habilidades?: { nombre?: string }[];
    herramientas?: { nombre?: string }[];
    idiomas?: { nombre?: string }[];
    otras?: { nombre?: string }[];
  } | null;
  ofertasPublicadas?: OfertaConDetalles[];
};

const ProfileScreenShared: React.FC<Props> = ({ route, navigation }) => {
  const { state } = useAuth();

  const isFocused = useIsFocused();

  const paramsUserId = route.params ? route.params.userId : undefined;
  const initialRouteName = route.params?.initialRouteName ?? undefined;

  const navigator =
    useNavigation<
      NativeStackNavigationProp<
        RecruiterStackParamList & CandidateStackParamList
      >
    >();

  const [profileUser, setProfileUser] = useState<PerfilView | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState<boolean>(false);
  const [isOwnProfile, setIsOwnProfile] = useState<boolean>(false);

  const fetchProfile = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const searchId = paramsUserId || state.user?.id;

        if (!searchId) {
          setNotFound(true);
          return;
        }

        setIsOwnProfile(searchId === state.user?.id);

        const usuarioBase = await getUsuarioBase(searchId);
        if (!usuarioBase) {
          setNotFound(true);
          return;
        }

        const tipoUsuario = usuarioBase.tipousuario?.nombre;

        // vista normalizada
        let normalized: PerfilView = {
          id: usuarioBase.id,
          nombre: usuarioBase.nombre,
          apellido: usuarioBase.apellido,
          email: usuarioBase.email,
          bio: usuarioBase.bio || null,
          fotoPerfil: usuarioBase.fotoperfil || undefined,
          rol: usuarioBase.rol || undefined,
          direccion: usuarioBase.direccion || null,
          tipoUsuario: usuarioBase.tipousuario || null,
          enlaces: [],
          estudios: [],
          experiencia: [],
          skills: { habilidades: [], herramientas: [], idiomas: [], otras: [] },
          ofertasPublicadas: [],
        };

        const enlaces = await getEnlaces(searchId.toString());
        if (enlaces) normalized.enlaces = enlaces;

        if (tipoUsuario === Role.PROFESIONAL) {
          const profesional = await getProfesional(searchId.toString());
          if (profesional) {
            const estudios = (await getEstudios(profesional.id)) || [];
            const skillsRaw = (await getSkills(profesional.id)) || [];
            const habilidades = skillsRaw.map((s: any) => ({
              nombre: s.skill?.[0]?.nombre || s.skill?.nombre || '',
            }));
            normalized.estudios = estudios;
            normalized.skills = {
              habilidades,
              herramientas: [],
              idiomas: [],
              otras: [],
            };
            normalized.experiencia =
              (await getExperiencia(searchId.toString())) || [];
          } else {
            normalized.experiencia =
              (await getExperiencia(searchId.toString())) || [];
          }
        } else if (tipoUsuario === Role.RECLUTADOR) {
          const reclutador = await getReclutador(searchId.toString());
          normalized.experiencia =
            (await getExperiencia(searchId.toString())) || [];
          const ofertas =
            (await getOfertasReclutador(searchId.toString())) || [];
          normalized.ofertasPublicadas = ofertas;
        } else {
          normalized.experiencia =
            (await getExperiencia(searchId.toString())) || [];
        }

        setProfileUser(normalized);
        setNotFound(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setNotFound(true);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [paramsUserId, state.user],
  );

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const [fabState, setFabState] = useState({ open: false });
  const onStateChange = ({ open }: any) => setFabState({ open });
  const { open } = fabState;

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchProfile(true);
    } finally {
      setRefreshing(false);
    }
  }, [fetchProfile]);

  // Mostrar FAB sólo si es el perfil propio y además se está en la
  // pantalla de perfil (Recruiter o Candidate). En otras rutas no debe verse.
  const showFab = Boolean(
    isOwnProfile &&
      isFocused &&
      (route.name === ROUTES.RECRUITER_PROFILE ||
        route.name === CAND_ROUTES.CANDIDATE_PROFILE),
  );

  const isProfesional = (p?: PerfilView | null): boolean =>
    Boolean(p && p.tipoUsuario?.nombre === Role.PROFESIONAL);

  const isReclutador = (p?: PerfilView | null): boolean =>
    Boolean(p && p.tipoUsuario?.nombre === Role.RECLUTADOR);

  const horizontalChipsSkills: string[] = isProfesional(profileUser)
    ? ([
        ...(profileUser?.skills?.habilidades?.map((s) => s.nombre) || []),
        ...(profileUser?.skills?.herramientas?.map((s) => s.nombre) || []),
        ...(profileUser?.skills?.idiomas?.map((s) => s.nombre) || []),
        ...(profileUser?.skills?.otras?.map((s) => s.nombre) || []),
      ].filter(Boolean) as string[])
    : [];

  // offers del recruiter (TODO: cambiar estados por enum)
  const { activeOffers, pausedOffers, closedOffers } = useMemo(() => {
    if (!profileUser || !isReclutador(profileUser)) {
      return { activeOffers: [], pausedOffers: [], closedOffers: [] };
    }

    const allOffers = profileUser.ofertasPublicadas || [];

    return {
      activeOffers: allOffers.filter(
        (o) => o.estadooferta?.nombre === 'publicada',
      ),
      pausedOffers: allOffers.filter(
        (o) => o.estadooferta?.nombre === 'pausada',
      ),
      closedOffers: allOffers.filter(
        (o) => o.estadooferta?.nombre === 'cerrada',
      ),
    };
  }, [profileUser?.ofertasPublicadas]);

  const fabActions = useMemo<
    React.ComponentProps<typeof FAB.Group>['actions']
  >(() => {
    if (isReclutador(profileUser)) {
      return [
        {
          icon: 'briefcase-plus-outline',
          label: 'Crear Oferta',
          onPress: () => {
            navigator.navigate(ROUTES.RECRUITER_CREAR_OFERTA);
          },
          style: { backgroundColor: '#A06FA6' },
          color: '#1D1C21',
          size: 'medium',
        },
      ];
    }

    if (isProfesional(profileUser)) {
      return [
        {
          icon: 'image-outline',
          label: 'Publicar foto',
          onPress: () => console.log('Pressed Editar Perfil'),
          style: { backgroundColor: '#A06FA6' },
          color: '#1D1C21',
          size: 'medium',
        },
      ];
    }
    return [];
  }, [profileUser, navigator]);

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  if (notFound) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: 'white' }}>No se encontró el usuario.</Text>
      </View>
    );
  }

  if (!profileUser) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: 'white' }}>Ocurrió un error.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={{ paddingVertical: 8 }}>
        <ProfileHeader
          nombre={profileUser.nombre ?? ''}
          rol={profileUser.rol ?? ''}
          fotoperfil={profileUser.fotoPerfil ?? ''}
          ciudad={profileUser.direccion?.ciudad ?? ''}
          profileScreenType={
            isOwnProfile
              ? ProfileScreenType.RECRUITER_HOME_PROFILE // Asume un tipo, ajustar si es necesario
              : ProfileScreenType.OTHER_PROFILE
          }
        />

        {isProfesional(profileUser) && horizontalChipsSkills.length > 0 && (
          <HorizontalChips skills={horizontalChipsSkills} />
        )}
      </View>

      <Tab.Navigator
        style={{
          flex: 1,
          marginHorizontal: 8,
          marginBottom: 16,
          borderRadius: 30,
        }}
        initialRouteName={initialRouteName}
        screenOptions={{
          tabBarIndicatorStyle: {
            height: 0,
            backgroundColor: 'transparent',
          },
          tabBarLabel: ({ focused, children, color }) => (
            <View style={{ position: 'relative', alignItems: 'center' }}>
              <Text style={{ color }}>{children}</Text>
              {focused && <View style={styles.customTabIndicator} />}
            </View>
          ),
        }}
      >
        {isProfesional(profileUser) ? (
          <>
            <Tab.Screen
              name={PROFILE_ROUTES.ABOUT_ME}
              options={{ title: 'Quien soy' }}
            >
              {(props) => (
                <AboutMe
                  {...props}
                  // Override route.params so child always receives latest profileUser and refresh handlers
                  route={{
                    ...props.route,
                    params: {
                      ...(props.route.params || {}),
                      user: profileUser,
                      refreshing,
                      onRefresh,
                    },
                  }}
                />
              )}
            </Tab.Screen>
            <Tab.Screen
              name={PROFILE_ROUTES.WHAT_I_DO}
              options={{ title: 'Lo que hago' }}
            >
              {(props) => (
                <WhatIDo
                  {...props}
                  route={{
                    ...props.route,
                    params: {
                      ...(props.route.params || {}),
                      user: profileUser,
                      refreshing,
                      onRefresh,
                    },
                  }}
                />
              )}
            </Tab.Screen>
          </>
        ) : (
          <>
            <Tab.Screen
              name={PROFILE_ROUTES.ACTIVE_OFFERS}
              options={{ title: 'Activas' }}
            >
              {(props) => (
                <OffersTab
                  {...props}
                  route={{
                    ...props.route,
                    params: {
                      ...(props.route.params || {}),
                      offers: activeOffers,
                      refreshing,
                      onRefresh,
                    },
                  }}
                />
              )}
            </Tab.Screen>
            <Tab.Screen
              name={PROFILE_ROUTES.PAUSED_OFFERS}
              options={{ title: 'Pausadas' }}
            >
              {(props) => (
                <OffersTab
                  {...props}
                  route={{
                    ...props.route,
                    params: {
                      ...(props.route.params || {}),
                      offers: pausedOffers,
                      refreshing,
                      onRefresh,
                    },
                  }}
                />
              )}
            </Tab.Screen>
            <Tab.Screen
              name={PROFILE_ROUTES.CLOSED_OFFERS}
              options={{ title: 'Cerradas' }}
            >
              {(props) => (
                <OffersTab
                  {...props}
                  route={{
                    ...props.route,
                    params: {
                      ...(props.route.params || {}),
                      offers: closedOffers,
                      refreshing,
                      onRefresh,
                    },
                  }}
                />
              )}
            </Tab.Screen>
          </>
        )}
      </Tab.Navigator>

      {showFab && (
        <Portal>
          <FAB.Group
            open={open}
            visible
            icon={({ size, color }) =>
              open ? (
                <MaterialCommunityIcons
                  name="close"
                  size={22}
                  color="#A06FA6"
                />
              ) : (
                <MaterialCommunityIcons name="plus" size={22} color="#1D1C21" />
              )
            }
            backdropColor="#00000056"
            variant="tertiary"
            style={{
              paddingBottom: 100,
            }}
            fabStyle={
              open
                ? {
                    backgroundColor: '#1D1C21',
                    borderRadius: 36,
                  }
                : {
                    backgroundColor: '#A06FA6',
                    borderRadius: 16,
                  }
            }
            actions={fabActions}
            onStateChange={onStateChange}
            onPress={() => {
              if (open) {
                // do something if the speed dial is open
              }
            }}
          />
        </Portal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A090F',
  },
  customTabIndicator: {
    position: 'absolute',
    bottom: -12,
    height: 3,
    borderTopRightRadius: 3,
    borderTopLeftRadius: 3,
    backgroundColor: 'white',
    left: 0,
    right: 0,
  },
});

export default ProfileScreenShared;
