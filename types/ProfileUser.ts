export type OfferStatus = 'Activa' | 'Cerrada' | 'Pausada';

export type Offer = {
  id: number | string;
  name: string;
  status: string;
  description: string;
};

export type ProfileUser = {
  id: number | string;
  name: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string;
  ocupation?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  bio?: string;
  skills?: string[];
  socialLinks?: { name: string; url: string }[];
  studies?: string[];
  otherStudies?: string[];
  experience?: string[];
  role?: string;
  offers?: Offer[];
};

export default ProfileUser;
