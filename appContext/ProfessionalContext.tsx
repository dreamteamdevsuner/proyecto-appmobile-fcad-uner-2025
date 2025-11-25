import {
  createContext,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react';
import { supabase } from '../supabase/supabaseClient';
import { Idarea } from '../types/JobOfferFullDescription';
import { RealtimeChannel, User } from '@supabase/supabase-js';
import usePaginatedData from '../hooks/usePaginatedData';
import { DBJobPreview } from '@database/DBJobPreview';
import {
  getJobOfferPreview,
  getJobOffersPreview,
} from '@services/jobOffer/JobOfferPreview.service';
import useGetCurrentUser from '../hooks/useGetCurrentUser';
interface ProfessionContextProps {
  loadingJobOffers: boolean;
  offers: DBJobPreview[];
  setNextPage: () => Promise<void>;
  updated: boolean;
  seenUpdate: () => void;
}
export const ProfessionalContext = createContext<ProfessionContextProps>(
  {} as ProfessionContextProps,
);

interface ProfessionalContextProviderProps extends PropsWithChildren {}
export const ProfessionalContextProvider = (
  props: ProfessionalContextProviderProps,
) => {
  const { currentUserId } = useGetCurrentUser();

  const {
    data: { data: offers },
    loading,
    setNextPage,
    loadNewDataFromSubscription,
  } = usePaginatedData<DBJobPreview>(5, getJobOffersPreview);
  const [updated, setUpdated] = useState<boolean>(false);
  const loadNewDataFromSubscriptionRef = useRef(loadNewDataFromSubscription);
  useEffect(() => {
    loadNewDataFromSubscriptionRef.current = loadNewDataFromSubscription;
  }, [loadNewDataFromSubscription]);
  const channelRef = useRef<RealtimeChannel | null>(null);
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
          const newJobOfferPreview: DBJobPreview = await getJobOfferPreview(
            payload.new.id,
          );
          setUpdated(true);
          loadNewDataFromSubscriptionRef.current(newJobOfferPreview);
          // loadNewDataFromSubscription(newJobOfferPreview);
        },
      )
      .subscribe((status) => console.log('subscription', status));
    channelRef.current = channel;
  };

  useEffect(() => {
    if (!currentUserId) {
      return;
    }
    subscribeToJobOffersUserArea(currentUserId);

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [currentUserId]);
  const seenUpdate = () => {
    return setUpdated(false);
  };
  return (
    <ProfessionalContext.Provider
      value={{
        loadingJobOffers: loading,
        offers,
        setNextPage,
        updated,
        seenUpdate,
      }}
    >
      {props.children}
    </ProfessionalContext.Provider>
  );
};
