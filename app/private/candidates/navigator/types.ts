import ROUTES from './routes';

export type PrivateStackParamList = {
  [ROUTES.CANDIDATE_HOME_TAB]: undefined;
  [ROUTES.CANDIDATE_SETTING]: undefined;
  [ROUTES.CANDIDATE_PROFILE_TAB]: undefined;

  [ROUTES.CANDIDATE_FAVORITOS]: undefined;
  [ROUTES.CANDIDATE_FAVORITOS_MATCHS]: { title: string };
  [ROUTES.CANDIDATE_FAVORITOS_INTERESANTES]: { title: string };
  [ROUTES.CANDIDATE_TEST]: {
    title: string;
    company: string;
  };

  [ROUTES.CANDIDATE_MENSAJERIA_TAB]: undefined;
  [ROUTES.CANDIDATE_MENSAJERIA]: undefined;
  [ROUTES.CANDIDATE_CONVERSACION]: {
    title: string;
    myName: string;
    otherAvatarUrl?: string;
    myAvatarUrl?: string;
  };
  [ROUTES.CANDIDATE_PROFILE]: { userId?: number; title?: string };
  [ROUTES.CANDIDATE_NOTIFICATIONS]: undefined;
};
