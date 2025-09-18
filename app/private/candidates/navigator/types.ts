import ROUTES from '../routes';

export type PrivateStackParamList = {
  [ROUTES.CANDIDATE_HOME]: undefined;
  [ROUTES.CANDIDATE_TEST]: undefined;

  [ROUTES.CANDIDATE_MENSAJERIA_TAB]: undefined;
  [ROUTES.CANDIDATE_MENSAJERIA]: undefined;

  [ROUTES.CANDIDATE_CONVERSACION]: {
    title: string;
    myName: string;
    otherAvatarUrl?: string;
    myAvatarUrl?: string;
  };
};
