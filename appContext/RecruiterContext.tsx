import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import useGetCurrentUser from '../hooks/useGetCurrentUser';

import { supabase } from '../supabase/supabaseClient';
import { getJobOfferIdsFromUser } from '@services/jobOffer/JobOffer.service';
import { RealtimeChannel } from '@supabase/supabase-js';
import { getProfesional } from '../services/profile/ProfileService';
import {
  getCandidatePreview,
  getCandidatesPreview,
} from '../services/candidatePreview/candidatePreview.service';
import usePaginatedData from '../hooks/usePaginatedData';
import { CandidatePreview } from '@database/DBCandidatePreview';
import { useAuth } from './authContext';
interface RecruiterContextProps {
  loadingProfessionals: boolean;
  professionals: CandidatePreview[];
  setNextPage: () => Promise<void>;
  updated: boolean;
  seenUpdate: () => void;
}
export const RecruiterContext = createContext<RecruiterContextProps>(
  {} as RecruiterContextProps,
);
interface RecruiterContextProviderProps extends PropsWithChildren {}
export const RecruiterContextProvider = (
  props: RecruiterContextProviderProps,
) => {
  const { currentUserId } = useGetCurrentUser();
  const [subscription, setSubscription] = useState<RealtimeChannel>();

  const {
    state: { user },
  } = useAuth();
  const {
    data: { data: professionals },
    loading,
    setNextPage,
    loadNewDataFromSubscription,
  } = usePaginatedData<CandidatePreview>(5, (page, itemsPerPage) =>
    getCandidatesPreview(page, itemsPerPage, user?.id),
  );
  const [updated, setUpdated] = useState<boolean>(false);

  const subscribeToMatches = async (currentUserId: string) => {
    const jobOffersIds = await getJobOfferIdsFromUser(currentUserId);

    const channel = supabase
      .channel('ofertatrabajomatch')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ofertatrabajomatch',
          filter: `idofertatrabajo=in.(${jobOffersIds.map((id) => `"${id}"`).join(',')})`,
        },
        async (payload) => {
          try {
            console.log('PAYLOAD');
            console.log('PAYLOAD', payload);
            const profesional = await getCandidatePreview(
              payload.new.idprofesional,
              payload.new.idofertatrabajo,
            );
            if (profesional) {
              loadNewDataFromSubscription(profesional);
              setUpdated(true);
            }
          } catch (error) {
            console.log(error);
            console.log(' error obteniendo profesional');
          }
        },
      )
      .subscribe((status) => {
        console.log('subs on', status);
      });
    setSubscription(channel);
  };
  useEffect(() => {
    if (!currentUserId) {
      return;
    }
    subscribeToMatches(currentUserId);
    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [currentUserId]);
  const seenUpdate = () => {
    return setUpdated(false);
  };
  return (
    <RecruiterContext.Provider
      value={{
        loadingProfessionals: loading,
        professionals,
        setNextPage,
        updated,
        seenUpdate,
      }}
    >
      {props.children}
    </RecruiterContext.Provider>
  );
};
