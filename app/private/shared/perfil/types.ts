import ROUTES from '../../recruiter/navigator/routes';
import CAND_ROUTES from '../../candidates/navigator/routes';
import { MaterialTopTabScreenProps } from '@react-navigation/material-top-tabs';
import { OfertaConDetalles } from '@services/profile/ProfileService';
import { PerfilView } from '@models/PerfilView';

export enum PROFILE_ROUTES {
  ACTIVE_OFFERS = 'ActiveOffers',
  PAUSED_OFFERS = 'PausedOffers',
  CLOSED_OFFERS = 'ClosedOffers',
  ABOUT_ME = 'AboutMe',
  WHAT_I_DO = 'WhatIDo',
}

export type ProfileStackParams = {
  [ROUTES.RECRUITER_PROFILE]: {
    userId?: string;
    title?: string;
    initialRouteName?: keyof ProfileTopTabParamList;
    profileUpdated?: boolean;
  };
  [CAND_ROUTES.CANDIDATE_PROFILE]: {
    userId?: string;
    title?: string;
    initialRouteName?: keyof ProfileTopTabParamList;
    profileUpdated?: boolean;
  };
  [ROUTES.RECRUITER_CANDIDATE_PROFILE]: {
    userId?: string;
    title?: string;
    initialRouteName?: keyof ProfileTopTabParamList;
    profileUpdated?: boolean;
  };
};

export type RecruiterTabScreenProps<T extends keyof ProfileTopTabParamList> =
  MaterialTopTabScreenProps<ProfileTopTabParamList, T>;

export type CandidateTabScreenProps<T extends keyof ProfileTopTabParamList> =
  MaterialTopTabScreenProps<ProfileTopTabParamList, T>;

export type ProfileTopTabParamList = {
  [PROFILE_ROUTES.ACTIVE_OFFERS]: TopTabScreenParams;
  [PROFILE_ROUTES.PAUSED_OFFERS]: TopTabScreenParams;
  [PROFILE_ROUTES.CLOSED_OFFERS]: TopTabScreenParams;
  [PROFILE_ROUTES.ABOUT_ME]: TopTabScreenParams;
  [PROFILE_ROUTES.WHAT_I_DO]: TopTabScreenParams;
};

export type TopTabScreenParams = {
  userId?: number;
  user?: PerfilView;
  offers?: OfertaConDetalles[];
  // Pull-to-refresh props (opcionales) que pueden ser pasados desde la pantalla contenedora
  refreshing?: boolean;
  type?: string;
  onRefresh?: () => void | Promise<void>;
};
