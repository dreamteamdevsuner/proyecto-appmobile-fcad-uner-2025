import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { PrivateStackParamList as RecruiterStackParamList } from '../../recruiter/navigator/types';
import { PrivateStackParamList as CandidateStackParamList } from '../../candidates/navigator/types';
import { ProfileScreenType } from '../../../../components/profile/ProfileHeader';
import { HorizontalChips } from '../../../../components/ui/HorizontalChips';
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
import { OfertaConDetalles } from '@services/profile/ProfileService';
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
import { useUserProfile } from '../../../../hooks/useUserProfile';
import { ProfileContext } from '@appContext/ProfileContext';
import { PerfilView } from '@models/PerfilView';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../../../../supabase/supabaseClient';

type Props = NativeStackScreenProps<
  ProfileStackParams,
  CAND_ROUTES.CANDIDATE_PROFILE | ROUTES.RECRUITER_PROFILE
>;

const Tab = createMaterialTopTabNavigator<ProfileTopTabParamList>();

const ProfileScreenShared: React.FC<Props> = ({ route, navigation }) => {
  const { state } = useAuth();
  const navigator =
    useNavigation<
      NativeStackNavigationProp<
        RecruiterStackParamList & CandidateStackParamList
      >
    >();
  const isFocused = useIsFocused();

  const paramsUserId = route.params ? route.params.userId : undefined;
  const initialRouteName = route.params?.initialRouteName ?? undefined;
  const searchId = paramsUserId || state.user?.id;

  const {
    profileUser,
    loading,
    notFound,
    isOwnProfile,
    onRefresh,
    refreshing,
  } = useUserProfile(searchId);
  useEffect(() => {
    console.log('profileUser updated in screen:', profileUser);
  }, [profileUser]);

  const onRefreshRef = useRef(onRefresh);
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  useEffect(() => {
    let loggedUserUpdatesListener: RealtimeChannel;
    if (state.user) {
      console.log('listening');

      // Assuming a 'profiles' table with user-specific data
      loggedUserUpdatesListener = supabase
        .channel('public:usuario')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'usuario',
            filter: `id=eq.${state.user.id}`,
          },
          async (payload) => {
            console.log('Profile updated:', payload.new);
            console.log('UPDATING ');
            await onRefreshRef.current();
            // Update UI or application state with new profile data
          },
        )
        .subscribe();
    }
    return () => {
      console.log('LISTENDER', loggedUserUpdatesListener);
      if (loggedUserUpdatesListener) {
        console.log('LISTENDER', loggedUserUpdatesListener);
        loggedUserUpdatesListener.unsubscribe();
      }
    };
  }, [state.user?.id]);
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

  // offers del recruiter (TODO: cambiar estados por enum)
  const { activeOffers, pausedOffers, closedOffers } = useMemo(() => {
    if (!profileUser || !isReclutador(profileUser)) {
      return { activeOffers: [], pausedOffers: [], closedOffers: [] };
    }
    const allOffers = profileUser.ofertasPublicadas || [];

    return allOffers.reduce(
      (acc, offer) => {
        const state = offer.estadooferta?.nombre;
        if (state === 'publicada') {
          acc.activeOffers.push(offer);
        } else if (state === 'pausada') {
          acc.pausedOffers.push(offer);
        } else if (state === 'cerrada') {
          acc.closedOffers.push(offer);
        }
        return acc;
      },
      {
        activeOffers: [] as OfertaConDetalles[],
        pausedOffers: [] as OfertaConDetalles[],
        closedOffers: [] as OfertaConDetalles[],
      },
    );
  }, [profileUser]);

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

  const contextValue = useMemo(
    () => ({
      user: profileUser,
      refreshing,
      onRefresh,
      isOwnProfile,
      activeOffers,
      pausedOffers,
      closedOffers,
    }),
    [
      profileUser,
      refreshing,
      onRefresh,
      isOwnProfile,
      activeOffers,
      pausedOffers,
      closedOffers,
    ],
  );
  console.log('RENDERINGGGGG');

  useEffect(() => {
    let loggedUserUpdatesListener: RealtimeChannel;
    if (state.user) {
      console.log('listening');

      // Assuming a 'profiles' table with user-specific data
      loggedUserUpdatesListener = supabase
        .channel('public:usuario')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'usuario',
            filter: `id=eq.${state.user.id}`,
          },
          async (payload) => {
            console.log('Profile updated:', payload.new);
            await onRefresh();
            // Update UI or application state with new profile data
          },
        )
        .subscribe();
    }
    return () => {
      if (loggedUserUpdatesListener) {
        loggedUserUpdatesListener.unsubscribe();
      }
    };
  }, []);
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
    <ProfileContext.Provider value={contextValue}>
      <View style={styles.container}>
        <View style={{ paddingVertical: 8 }}>
          <ProfileHeader
            key={profileUser.id + refreshing}
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
                component={AboutMe}
                options={{ title: 'Quien soy' }}
              ></Tab.Screen>
              <Tab.Screen
                name={PROFILE_ROUTES.WHAT_I_DO}
                component={WhatIDo}
                options={{ title: 'Lo que hago' }}
              ></Tab.Screen>
            </>
          ) : (
            <>
              <Tab.Screen
                name={PROFILE_ROUTES.ACTIVE_OFFERS}
                options={{ title: 'Activas' }}
                component={OffersTab}
                initialParams={{ type: 'published' }}
              ></Tab.Screen>
              <Tab.Screen
                name={PROFILE_ROUTES.PAUSED_OFFERS}
                options={{ title: 'Pausadas' }}
                component={OffersTab}
                initialParams={{ type: 'paused' }}
              ></Tab.Screen>
              <Tab.Screen
                name={PROFILE_ROUTES.CLOSED_OFFERS}
                options={{ title: 'Cerradas' }}
                component={OffersTab}
                initialParams={{ type: 'closed' }}
              ></Tab.Screen>
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
                  <MaterialCommunityIcons
                    name="plus"
                    size={22}
                    color="#1D1C21"
                  />
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
            />
          </Portal>
        )}
      </View>
    </ProfileContext.Provider>
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
