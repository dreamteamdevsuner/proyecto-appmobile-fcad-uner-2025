import React from 'react';
import ProfileScreenShared, {
  ProfileStackProps,
} from '../../../shared/perfil/ProfileScreen';

const CandidateProfileWrapper = (props: ProfileStackProps) => {
  return <ProfileScreenShared {...props} />;
};

export default CandidateProfileWrapper;
