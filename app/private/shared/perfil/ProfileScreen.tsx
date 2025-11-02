import React, { useState, useEffect } from 'react';
import {
  View,
  Dimensions,
  Text,
  ActivityIndicator,
  Button,
} from 'react-native';
import { TabView } from 'react-native-tab-view';
import { RouteProp } from '@react-navigation/native';
import { PrivateStackParamList as RecruiterStackParamList } from '../../recruiter/navigator/types';
import { PrivateStackParamList as CandidateStackParamList } from '../../candidates/navigator/types';
import { ProfileScreenType } from '../../../../components/profile/ProfileHeader';
import { HorizontalChips } from '../../../../components/ui/HorizontalChips';
import { useAuth } from '../../../../appContext/authContext';
import { ProfileUser } from '../../../../types/ProfileUser';
import { fetchUserByIdMock } from '../../../../utils/mockUsers';
import {
  AboutMe,
  CustomProfileTabBar,
  OffersTab,
  ProfileHeader,
  WhatIDo,
} from '../../../../components/profile/index';
import { RootStackParams } from '../../recruiter/navigator/SwipeStack';
import { RootStackParamList } from './ajustes/types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ROUTES from '../../recruiter/navigator/routes';
import { Role } from '@services/interfaces/TipoUsuario.interface';
import { supabase } from '../../../../supabase/supabaseClient';

export type CombinedParamList = RecruiterStackParamList &
  CandidateStackParamList;

// type Props = {
//   route: RouteProp<CombinedParamList, keyof CombinedParamList>;
// };
// type Props = NativeStackScreenProps<RootStackParams | CombinedParamList>;
type Props = NativeStackScreenProps<any, any>;

const ProfileScreenShared: React.FC<Props> = ({ route }) => {
  // const { logout } = useAuth();

  return (
    <View>
      <Text>Perfil shared component</Text>
      <Button title="logout" onPress={() => supabase.auth.signOut()}></Button>
    </View>
  );
};

//TODO USAR ESTE COMPONENTE CON DATA DINAMICA
/* const ProfileScreenShared: React.FC<Props> = ({ route }) => {
  console.log('route', route);
  const { state } = useAuth();
  const userId =
    route?.params &&
    typeof route.params === 'object' &&
    'userId' in route.params
      ? (route.params as { userId?: number }).userId
      : state.user!.id;
  console.log('userId', userId);
  const [profileUser, setProfileUser] = useState<ProfileUser | undefined>();
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    const load = async () => {
      try {
        const fetched = await fetchUserByIdMock(userId);
        setProfileUser(fetched);
        setNotFound(!fetched);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const layout = Dimensions.get('window');
  const [index, setIndex] = useState(0);

  const routes = React.useMemo(() => {
    const role = profileUser?.role as Role;
    if (role === Role.candidate) {
      return [
        { key: 'aboutMe', title: 'Quien soy' },
        { key: 'whatIDo', title: 'Lo que hago' },
      ];
    }
    return [
      { key: 'activeOffers', title: 'Activas' },
      { key: 'pausedOffers', title: 'Pausadas' },
      { key: 'closedOffers', title: 'Cerradas' },
    ];
  }, [profileUser?.role]);

  React.useEffect(() => {
    setIndex(0);
  }, [routes.length]);

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case 'aboutMe':
        return AboutMe(profileUser ?? (state.user! as any));
      case 'whatIDo':
        return WhatIDo(profileUser ?? (state.user! as any));
      case 'activeOffers':
        return OffersTab(
          profileUser?.offers?.filter((item) => item.status === 'Activa'),
        );
      case 'closedOffers':
        return OffersTab(
          profileUser?.offers?.filter((item) => item.status === 'Pausada'),
        );
      case 'pausedOffers':
        return OffersTab(
          profileUser?.offers?.filter((item) => item.status === 'Cerrada'),
        );
      default:
        return null;
    }
  };

  const isOwnProfile = () => userId === state.user?.id;

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (notFound) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>No se encontró el usuario.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0A090F' }}>
      <View style={{ paddingVertical: 8 }}>
        <ProfileHeader
          name={profileUser?.name ?? (state.user! as any).name}
          ocupation={profileUser?.ocupation ?? ''}
          avatarUrl={profileUser?.avatarUrl ?? ''}
          city={profileUser?.city ?? ''}
          profileScreenType={
            isOwnProfile()
              ? ProfileScreenType.RECRUITER_HOME_PROFILE
              : ProfileScreenType.OTHER_PROFILE
          }
        />

        {(profileUser?.role ?? state.user?.tipousuario.nombre) ===
          Role.PROFESIONAL && (
          <HorizontalChips skills={profileUser?.skills ?? []} />
        )}
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        style={{
          marginHorizontal: 8,
          borderRadius: 30,
        }}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => <CustomProfileTabBar {...props} />}
      />
    </View>
  );
}; */
/* const ProfileScreenShared: React.FC<Props> = ({ route }) => {
  console.log('route', route);
  const {
    state: { user: profileUser },
  } = useAuth();
  if (!profileUser) {
    return (
      <View>
        {' '}
        <Text>Error obteniendo perfil</Text>{' '}
      </View>
    );
  }
  const layout = Dimensions.get('window');
  const [index, setIndex] = useState(0);

  const routes = React.useMemo(() => {
    const role = profileUser.tipousuario.nombre;
    if (role === Role.PROFESIONAL) {
      return [
        { key: 'aboutMe', title: 'Quien soy' },
        { key: 'whatIDo', title: 'Lo que hago' },
      ];
    }
    return [
      { key: 'activeOffers', title: 'Activas' },
      { key: 'pausedOffers', title: 'Pausadas' },
      { key: 'closedOffers', title: 'Cerradas' },
    ];
  }, [profileUser.tipousuario.nombre]);

  React.useEffect(() => {
    setIndex(0);
  }, [routes.length]);

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case 'aboutMe':
        return AboutMe(profileUser ?? (state.user! as any));
      case 'whatIDo':
        return WhatIDo(profileUser ?? (state.user! as any));
      case 'activeOffers':
        return OffersTab(
          profileUser?.offers?.filter((item) => item.status === 'Activa'),
        );
      case 'closedOffers':
        return OffersTab(
          profileUser?.offers?.filter((item) => item.status === 'Pausada'),
        );
      case 'pausedOffers':
        return OffersTab(
          profileUser?.offers?.filter((item) => item.status === 'Cerrada'),
        );
      default:
        return null;
    }
  };

  const isOwnProfile = () => userId === state.user?.id;

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (notFound) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>No se encontró el usuario.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0A090F' }}>
      <View style={{ paddingVertical: 8 }}>
        <ProfileHeader
          name={profileUser?.name ?? (state.user! as any).name}
          ocupation={profileUser?.ocupation ?? ''}
          avatarUrl={profileUser?.avatarUrl ?? ''}
          city={profileUser?.city ?? ''}
          profileScreenType={
            isOwnProfile()
              ? ProfileScreenType.RECRUITER_HOME_PROFILE
              : ProfileScreenType.OTHER_PROFILE
          }
        />

        {(profileUser?.role ?? state.user?.tipousuario.nombre) ===
          Role.PROFESIONAL && (
          <HorizontalChips skills={profileUser?.skills ?? []} />
        )}
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        style={{
          marginHorizontal: 8,
          borderRadius: 30,
        }}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => <CustomProfileTabBar {...props} />}
      />
    </View>
  );
}; */
//TODO USAR ESTE COMPONENTE CON DATA DINAMICA
export default ProfileScreenShared;
