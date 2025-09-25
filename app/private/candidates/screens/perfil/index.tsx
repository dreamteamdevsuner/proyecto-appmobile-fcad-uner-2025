import React from 'react';
import ProfileScreenShared from '../../../shared/perfil/ProfileScreen';
import { RouteProp } from '@react-navigation/native';
import { PrivateStackParamList as CandidateStackParamList } from '../../navigator/types';
import ROUTES from '../../navigator/routes';

type Props = {
  route: RouteProp<CandidateStackParamList, typeof ROUTES.CANDIDATE_PROFILE>;
};

const CandidateProfileWrapper: React.FC<Props> = ({ route }) => {
  return <ProfileScreenShared route={route} />;
};

export default CandidateProfileWrapper;
