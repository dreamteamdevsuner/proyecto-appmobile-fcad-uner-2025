import { PerfilView } from '@models/PerfilView';
import { OfertaConDetalles } from '@services/profile/ProfileService';
import { createContext, PropsWithChildren, useContext } from 'react';

// type ProfileContextType = {
//   user: PerfilView | null;
//   refreshing: boolean;
//   onRefresh: () => Promise<void>;
//   isOwnProfile: boolean;
//   activeOffers: OfertaConDetalles[];
//   pausedOffers: OfertaConDetalles[];
//   closedOffers: OfertaConDetalles[];
// };

// export const ProfileContext = createContext<ProfileContextType>({
//   user: null,
//   refreshing: false,
//   onRefresh: async () => {},
//   isOwnProfile: false,
//   activeOffers: [],
//   pausedOffers: [],
//   closedOffers: [],
// });

// export const useProfileContext = () => useContext(ProfileContext);

interface ProfileContextProps {}
export const ProfileContext = createContext<ProfileContextProps>(
  {} as ProfileContextProps,
);
interface ProfileContextProviderProps extends PropsWithChildren {}
export const ProfileContextProvider = (props: ProfileContextProviderProps) => {
  return (
    <ProfileContext.Provider value={{}}>
      {props.children}
    </ProfileContext.Provider>
  );
};
