import React, { useState, useContext, useEffect } from 'react';
import { View, Dimensions, Text, ActivityIndicator } from 'react-native';
import { TabView } from 'react-native-tab-view';
import { RouteProp } from '@react-navigation/native';
import { PrivateStackParamList as RecruiterStackParamList } from '../recruiter/navigator/types';
import { PrivateStackParamList as CandidateStackParamList } from '../candidates/navigator/types';
import CustomProfileTabBar from '../../../components/profile/CustomProfileTabBar';
import { AboutMe } from '../../../components/profile/AboutMe';
import { WhatIDo } from '../../../components/profile/WhatIDo';
import {
  ProfileHeader,
  ProfileScreenType,
} from '../../../components/profile/ProfileHeader';
import { HorizontalChips } from '../../../components/ui/HorizontalChips';
import { Role, AuthContext } from '../../../appContext/authContext';
import { ProfileUser } from '../../../types/ProfileUser';
import { fetchUserByIdMock } from '../../../utils/mockUsers';
import OffersTab from '../../../components/profile/OffersTab';

type CombinedParamList = RecruiterStackParamList & CandidateStackParamList;

type Props = {
  route: RouteProp<CombinedParamList, keyof CombinedParamList>;
};

const ProfileScreenShared: React.FC<Props> = ({ route }) => {
  const { userState } = useContext(AuthContext);
  const userId =
    route?.params &&
    typeof route.params === 'object' &&
    'userId' in route.params
      ? (route.params as { userId?: number }).userId
      : userState.user.id;

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
    const role = (profileUser?.role ?? userState.user.role) as Role;
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
  }, [profileUser?.role, userState.user.role]);

  React.useEffect(() => {
    setIndex(0);
  }, [routes.length]);

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case 'aboutMe':
        return AboutMe(profileUser ?? (userState.user as any));
      case 'whatIDo':
        return WhatIDo(profileUser ?? (userState.user as any));
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

  const isOwnProfile = () => !userId;

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
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ paddingVertical: 8 }}>
        <ProfileHeader
          name={profileUser?.name ?? (userState.user as any).name}
          ocupation={profileUser?.ocupation ?? ''}
          avatarUrl={profileUser?.avatarUrl ?? ''}
          city={profileUser?.city ?? ''}
          profileScreenType={
            isOwnProfile()
              ? ProfileScreenType.RECRUITER_HOME_PROFILE
              : ProfileScreenType.OTHER_PROFILE
          }
        />

        {((profileUser?.role ?? userState.user.role) as Role) ===
          Role.candidate && (
          <HorizontalChips skills={profileUser?.skills ?? []} />
        )}
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        style={{ marginHorizontal: 8, borderRadius: 30 }}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => <CustomProfileTabBar {...props} />}
      />
    </View>
  );
};

export default ProfileScreenShared;
