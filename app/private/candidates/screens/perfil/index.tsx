import { useState, useContext, useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import CustomProfileTabBar from '../../../../../components/profile/CustomProfileTabBar';
import { AboutMe } from '../../../../../components/profile/AboutMe';
import { WhatIDo } from '../../../../../components/profile/WhatIDo';
import {
  ProfileHeader,
  ProfileScreenType,
} from '../../../../../components/profile/ProfileHeader';
import { HorizontalChips } from '../../../../../components/ui/HorizontalChips';
import { Role, AuthContext } from '../../../../../appContext/authContext';
import { RouteProp } from '@react-navigation/native';
import { PrivateStackParamList } from '../../navigator/types';
import ROUTES from '../../navigator/routes';
import { ProfileUser } from '../../../../../types/ProfileUser';
import { fetchUserByEmailMock } from '../../../../../utils/mockUsers';
import OffersTab from '../../../../../components/profile/OffersTab';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<
  PrivateStackParamList,
  ROUTES.CANDIDATE_PROFILE
>;

const ProfileScreen: React.FC<Props> = ({ route }) => {
  // const { userId } = route.params;
  const { userState } = useContext(AuthContext);

  // TODO: usar route.params?.user para ver el perfil de otro usuario
  const paramUserId = route?.params?.userId as string | undefined;
  const [profileUser, setProfileUser] = useState<ProfileUser | undefined>(
    undefined,
  );

  const isOwnProfile = () => {
    return !paramUserId;
  };

  useEffect(() => {
    const load = async () => {
      // TODO: obtener usuario a mostrar, por ahora mockeado y obtenido por email
      const fetched = await fetchUserByEmailMock(userState.user.email);
      setProfileUser(fetched);
    };
    load();
  }, []);

  const layout = Dimensions.get('window');
  const [index, setIndex] = useState(0);

  //TODO: Revisar si las rutas funcionan cuando vemos el perfil de otro user
  const [routes] = useState(
    ((profileUser?.role ?? userState.user.role) as Role) === Role.candidate
      ? [
          { key: 'aboutMe', title: 'Quien soy' },
          { key: 'whatIDo', title: 'Lo que hago' },
        ]
      : [
          { key: 'activeOffers', title: 'Activas' },
          { key: 'pausedOffers', title: 'Pausadas' },
          { key: 'closedOffers', title: 'Cerradas' },
        ],
  );

  const renderScene =
    ((profileUser?.role ?? userState.user.role) as Role) === Role.candidate
      ? SceneMap({
          aboutMe: AboutMe.bind(null, profileUser ?? (userState.user as any)),
          whatIDo: WhatIDo.bind(null, profileUser ?? (userState.user as any)),
        })
      : SceneMap({
          activeOffers: OffersTab.bind(
            null,
            profileUser?.offers?.filter((item) => item.status === 'Activa'),
          ),
          closedOffers: OffersTab.bind(
            null,
            profileUser?.offers?.filter((item) => item.status === 'Pausada'),
          ),
          pausedOffers: OffersTab.bind(
            null,
            profileUser?.offers?.filter((item) => item.status === 'Cerrada'),
          ),
        });

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
        ></ProfileHeader>

        {((profileUser?.role ?? userState.user.role) as Role) ===
          Role.candidate && (
          <HorizontalChips skills={profileUser?.skills ?? []}></HorizontalChips>
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

export default ProfileScreen;
