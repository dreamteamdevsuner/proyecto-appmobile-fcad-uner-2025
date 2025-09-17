import ROUTES from './routes';

export type PrivateStackParamList = {
  [ROUTES.RECRUITER_HOME]: undefined;
  [ROUTES.RECRUITER_TEST]: undefined;
  [ROUTES.RECRUITER_SWIPE_MATCH]: undefined;
  [ROUTES.RECRUITER_FAVORITOS]: undefined;
  [ROUTES.RECRUITER_MENSAJERIA]: undefined;
  [ROUTES.RECRUITER_FAVORITOS_OFERTA]: { title: string };
  [ROUTES.RECRUITER_CONVERSACION]: {
    title: string;
    myName: string;
    otherAvatarUrl?: string;
    myAvatarUrl?: string;
  };
  [ROUTES.PROFILE]: undefined;
};
