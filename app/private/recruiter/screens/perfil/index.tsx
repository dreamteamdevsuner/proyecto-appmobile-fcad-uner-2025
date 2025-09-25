import React from 'react';
import ProfileScreenShared from '../../../shared/perfil/ProfileScreen';
import { RouteProp } from '@react-navigation/native';
import { PrivateStackParamList as RecruiterStackParamList } from '../../navigator/types';
import ROUTES from '../../navigator/routes';

type Props = {
  route: RouteProp<RecruiterStackParamList, typeof ROUTES.RECRUITER_PROFILE>;
};

const RecruiterProfileWrapper: React.FC<Props> = ({ route }) => {
  return <ProfileScreenShared route={route} />;
};

export default RecruiterProfileWrapper;
