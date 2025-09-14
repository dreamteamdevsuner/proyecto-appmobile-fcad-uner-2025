export type PrivateStackParamList = {
  HomeScreen: undefined;
  Favoritos: undefined;
  Mensajería: undefined;
  Conversación: {
    title: string;
    myName: string;
    otherAvatarUrl?: string;
    myAvatarUrl?: string;
  };
};
