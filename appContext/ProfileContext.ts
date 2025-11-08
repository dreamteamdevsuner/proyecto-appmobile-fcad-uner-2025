import { PerfilView } from '@models/PerfilView';
import { OfertaConDetalles } from '@services/profile/ProfileService';
import { createContext, useContext } from 'react';

type ProfileContextType = {
  user: PerfilView | null;
  refreshing: boolean;
  onRefresh: () => Promise<void>;
  isOwnProfile: boolean;
  activeOffers: OfertaConDetalles[];
  pausedOffers: OfertaConDetalles[];
  closedOffers: OfertaConDetalles[];
};

export const ProfileContext = createContext<ProfileContextType>({
  user: null,
  refreshing: false,
  onRefresh: async () => {},
  isOwnProfile: false,
  activeOffers: [],
  pausedOffers: [],
  closedOffers: [],
});

export const useProfileContext = () => useContext(ProfileContext);
