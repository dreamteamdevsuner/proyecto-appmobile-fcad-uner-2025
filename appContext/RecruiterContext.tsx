import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import useGetCurrentUser from '../hooks/useGetCurrentUser';

import { supabase } from '../supabase/supabaseClient';
import { getJobOfferIdsFromUser } from '@services/jobOffer/JobOffer.service';
import { RealtimeChannel } from '@supabase/supabase-js';
import { getProfesional } from '../services/profile/ProfileService';
import { getCandidatePreview } from '../services/candidatePreview/candidatePreview.service';

export const RecruiterContext = createContext<{}>({});
interface RecruiterContextProviderProps extends PropsWithChildren {}
export const RecruiterContextProvider = (
  props: RecruiterContextProviderProps,
) => {
  const { currentUserId } = useGetCurrentUser();
  const [subscription, setSubscription] = useState<RealtimeChannel>();
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

            console.log('PROF', profesional);
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

  return (
    <RecruiterContext.Provider value={{}}>
      {props.children}
    </RecruiterContext.Provider>
  );
};
