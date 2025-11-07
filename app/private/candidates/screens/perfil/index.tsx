import React from 'react';
import ProfileScreenShared, {
  ProfileStackProps,
} from '../../../shared/perfil/ProfileScreen';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import CANDIDATE_ROUTES from '../../navigator/routes';
import { ProfileStackParams } from '@app/private/shared/perfil/types';
import RECRUITER_ROUTES from '@app/private/recruiter/navigator/routes';

const CandidateProfileWrapper = (props: ProfileStackProps) => {
  return <ProfileScreenShared {...props} />;
};

export default CandidateProfileWrapper;
