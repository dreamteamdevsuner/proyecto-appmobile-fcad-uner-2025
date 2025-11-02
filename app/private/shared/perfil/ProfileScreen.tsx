import React, { useState, useEffect, useMemo } from 'react';
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

// helper - extraer o eliminar despues
const mapOfferForTab = (offer: any): Offer => {
  return {
    id: offer.id,
    name: offer.titulo,
    status:
      (offer.estadooferta &&
        (offer.estadooferta[0]?.nombre || offer.estadooferta.nombre)) ||
      (offer.activo ? 'Activa' : 'Pausada'),
    description: offer.descripcion || '',
  };
};

const ProfileScreenShared: React.FC<Props> = ({ route, navigation }) => {
  const { state } = useAuth();
  console.log('STATE USER: ', state.user);

  const isFocused = useIsFocused();

  const paramsUserId = route.params ? route.params.userId : undefined;
  console.log(paramsUserId);

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

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const searchId = paramsUserId || state.user!.id;

        if (!searchId) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        setIsOwnProfile(searchId === state.user?.id);

        const usuarioBase = await getUsuarioBase(searchId);
        if (!usuarioBase) {
          setNotFound(true);
          return;
        }

        const tipoUsuario = usuarioBase.tipousuario?.nombre;

        console.log('Tipo usuario', usuarioBase.tipousuario);

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

        // TODO: verificar si enlaces son solo para profesional o ambos
        const enlaces = await getEnlaces(searchId.toString());
        if (enlaces) normalized.enlaces = enlaces;

        if (tipoUsuario === Role.PROFESIONAL) {
          // profesional: obtener profesional, estudios, skills y experiencia
          const profesional = await getProfesional(searchId.toString());
          if (profesional) {
            const estudios = (await getEstudios(profesional.id)) || [];
            const skillsRaw = (await getSkills(profesional.id)) || [];
            // Mapear skills a las categorías esperadas (mínimo: poner todo en 'habilidades')
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
            // No tiene perfil profesional (pero usuario existe)
            normalized.experiencia =
              (await getExperiencia(searchId.toString())) || [];
          }
        } else if (tipoUsuario === Role.RECLUTADOR) {
          // reclutador: obtener reclutador, experiencia y ofertas
          const reclutador = await getReclutador(searchId.toString());
          normalized.experiencia =
            (await getExperiencia(searchId.toString())) || [];
          const ofertas =
            (await getOfertasReclutador(searchId.toString())) || [];
          normalized.ofertasPublicadas = ofertas;
        } else {
          // usuario sin tipo claro: intentar tomar experiencia y enlaces
          normalized.experiencia =
            (await getExperiencia(searchId.toString())) || [];
        }

        setProfileUser(normalized);
        console.log('PERFIL NORMALIZADO: ', normalized);
        setNotFound(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [paramsUserId]); // recargar si el userId en params cambia?

  console.log('NotFound: ', notFound);

  const [fabState, setFabState] = useState({ open: false });
  const onStateChange = ({ open }: any) => setFabState({ open });
  const { open } = fabState;

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

  // offers del recruiter
  const { activeOffers, pausedOffers, closedOffers } = useMemo(() => {
    if (!profileUser || !isReclutador(profileUser)) {
      return { activeOffers: [], pausedOffers: [], closedOffers: [] };
    }

    const allOffers = profileUser.ofertasPublicadas || [];

    return {
      activeOffers: allOffers.filter(
        (o) => o.estadooferta?.nombre === 'activa',
      ),
      pausedOffers: allOffers.filter(
        (o) => o.estadooferta?.nombre === 'pausada',
      ),
      closedOffers: allOffers.filter(
        (o) => o.estadooferta?.nombre === 'cerrada',
      ),
    };
  }, [profileUser]);

  const fabActions = useMemo(() => {
    if (isReclutador(profileUser)) {
      return [
        {
          icon: 'briefcase-plus-outline',
          label: 'Crear Oferta',
          onPress: () => {
            navigator.navigate(ROUTES.RECRUITER_CREAR_OFERTA);
          },
          style: { backgroundColor: 'white' },
        },
      ];
    }

    if (isProfesional(profileUser)) {
      return [
        {
          icon: 'pencil-outline',
          label: 'Editar Perfil',
          onPress: () => console.log('Pressed Editar Perfil'),
          style: { backgroundColor: 'white' },
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

        {isProfesional(profileUser) && (
          <HorizontalChips skills={horizontalChipsSkills} />
        )}
      </View>

      <Tab.Navigator
        style={{
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
              component={AboutMe}
              initialParams={{ user: profileUser }}
            />
            <Tab.Screen
              name={PROFILE_ROUTES.WHAT_I_DO}
              component={WhatIDo}
              initialParams={{ user: profileUser }}
            />
          </>
        ) : (
          <>
            <Tab.Screen
              name={PROFILE_ROUTES.ACTIVE_OFFERS}
              component={OffersTab}
              initialParams={{
                offers: activeOffers,
              }}
              options={{
                title: 'Activas',
              }}
            />
            <Tab.Screen
              name={PROFILE_ROUTES.PAUSED_OFFERS}
              component={OffersTab}
              initialParams={{
                offers: pausedOffers,
              }}
              options={{
                title: 'Pausadas',
              }}
            />
            <Tab.Screen
              name={PROFILE_ROUTES.CLOSED_OFFERS}
              component={OffersTab}
              initialParams={{
                offers: closedOffers,
              }}
              options={{
                title: 'Cerradas',
              }}
            />
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
                <MaterialCommunityIcons name="close" size={22} color="white" />
              ) : (
                <MaterialCommunityIcons name="plus" size={22} color="white" />
              )
            }
            backdropColor="#1c1c29a2"
            variant="tertiary"
            style={{
              paddingBottom: 100,
            }}
            fabStyle={{
              backgroundColor: '#A06FA6',
              borderRadius: 16,
            }}
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
