import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { Idarea } from '../types/JobOfferFullDescription';
import { RealtimeChannel, User } from '@supabase/supabase-js';
import usePaginatedData from '../hooks/usePaginatedData';
import { DBJobPreview } from '@database/DBJobPreview';
import {
  getJobOfferPreview,
  getJobOffersPreview,
} from '@services/jobOffer/JobOfferPreview.service';
interface ProfessionContextProps {
  loadingJobOffers: boolean;
  offers: DBJobPreview[];
  setNextPage: () => Promise<void>;
}
export const ProfessionalContext = createContext<ProfessionContextProps>(
  {} as ProfessionContextProps,
);

interface ProfessionalContextProviderProps extends PropsWithChildren {}
export const ProfessionalContextProvider = (
  props: ProfessionalContextProviderProps,
) => {
  const [currentUserId, setCurrentUserId] = useState<string>();
  const [subscription, setSubscription] = useState<RealtimeChannel | null>(
    null,
  );
  const {
    data: { data: offers },
    loading,
    setNextPage,
    loadNewDataFromSubscription,
  } = usePaginatedData<DBJobPreview>(5, getJobOffersPreview);
  const getCurrentUser = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.log('error getting current user');
        throw Error('error getting current user');
      }
      if (!data) {
        console.log('user not foud');
        throw Error('user not foud');
      }
      setCurrentUserId(data.user.id);
    } catch (error) {
      console.log('error getting current user');
      throw Error('error getting current user');
    }
  };
  const subscribeToJobOffersUserArea = async (currentUserId: string) => {
    const { data: areaOfInterestUser, error: errorAreaOfInterestUser } =
      await supabase
        .from('profesional')
        .select('idarea')
        .eq('idusuario', currentUserId)
        .single();
    if (errorAreaOfInterestUser) {
      throw Error('error getting area of interest user');
    }

    console.log('area of interest', areaOfInterestUser);
    const channel = supabase
      .channel('ofertatrabajo')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ofertatrabajo',
          filter: `idarea=eq.${areaOfInterestUser.idarea}`,
        },
        async (payload) => {
          console.log('published new offer');
          const newJobOfferPreview: DBJobPreview = await getJobOfferPreview(
            payload.new.id,
          );
          console.log('new offer', newJobOfferPreview);
          loadNewDataFromSubscription(newJobOfferPreview);
        },
      )
      .subscribe((status) => console.log('subscription', status));
    setSubscription(channel);
  };
  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentUserId) {
      return;
    }
    subscribeToJobOffersUserArea(currentUserId);
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [currentUserId]);

  console.log('user', setCurrentUserId);
  return (
    <ProfessionalContext.Provider
      value={{ loadingJobOffers: loading, offers, setNextPage }}
    >
      {props.children}
    </ProfessionalContext.Provider>
  );
};
