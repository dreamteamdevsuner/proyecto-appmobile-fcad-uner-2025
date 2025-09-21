import ROUTES from './routes';
export type PrivateStackParamList = {
  [ROUTES.RECRUITER_HOME]: undefined;
  [ROUTES.RECRUITER_PERFIL_TAB]: undefined;
  [ROUTES.RECRUITER_SWIPE_MATCH]: undefined;
  [ROUTES.RECRUITER_MENSAJERIA_TAB]: undefined;
  [ROUTES.RECRUITER_MENSAJERIA]: undefined;
  [ROUTES.RECRUITER_FAVORITOS_TAB]: undefined;
  [ROUTES.RECRUITER_FAVORITOS]: undefined;
  [ROUTES.RECRUITER_FAVORITOS_OFERTA]: { title: string };
  [ROUTES.RECRUITER_CONVERSACION]: {
    title: string;
    myName: string;
    otherAvatarUrl?: string;
    myAvatarUrl?: string;
  };
  [ROUTES.RECRUITER_PROFILE]: { userId?: string } | undefined;
  [ROUTES.RECRUITER_SETTINGS]: undefined;

  [ROUTES.RECRUITER_CREAR_OFERTA]: undefined;
  [ROUTES.RECRUITER_CREAR_OFERTA_PREVIEW]: undefined;
};
