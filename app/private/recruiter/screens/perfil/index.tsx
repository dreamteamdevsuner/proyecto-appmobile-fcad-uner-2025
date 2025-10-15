import React from 'react';
import ProfileScreenShared from '../../../shared/perfil/ProfileScreen';
import { RouteProp } from '@react-navigation/native';
import { PrivateStackParamList as RecruiterStackParamList } from '../../navigator/types';
import ROUTES from '../../navigator/routes';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = {
  route: RouteProp<RecruiterStackParamList, typeof ROUTES.RECRUITER_PROFILE>;
} & NativeStackScreenProps<any, any>;

const RecruiterProfileWrapper: React.FC<Props> = ({ route, navigation }) => {
  return <ProfileScreenShared route={route} navigation={navigation} />;
};

export default RecruiterProfileWrapper;
