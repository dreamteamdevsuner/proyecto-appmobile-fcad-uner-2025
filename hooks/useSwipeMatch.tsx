import React, { useState, useRef } from 'react';
import { ICarouselInstance } from 'react-native-reanimated-carousel';
import { supabase } from '../supabase/supabaseClient';
import uuid from 'react-native-uuid';
import { useAuth } from '../appContext/authContext';
import { sendPushNotification } from '@services/notifications/pushNotification.service';

const useSwipeMatch = ({
  ref,
  onMatchSuccess,
}: {
  ref: React.RefObject<ICarouselInstance | null>;
  onMatchSuccess?: (
    candidateName: string,
    candidateId: string,
    candidateFotoPerfil: string,
    idMatch: string,
  ) => void;
}) => {
  const [enabledScroll, setEnabledScroll] = useState(true);
  const {
    state: { user },
  } = useAuth();

  const profesionalIdRef = useRef<string | null>(null);
  const fetchingProfesionalRef = useRef<boolean>(false);

  const handleScrollEnabled = (val: boolean) => {
    setEnabledScroll(val);
  };

  const resolveProfesionalId = async (): Promise<string | null> => {
    if (profesionalIdRef.current) return profesionalIdRef.current;
    if (!user?.id) return null;
    if (fetchingProfesionalRef.current) {
      await new Promise((r) => setTimeout(r, 200));
      return profesionalIdRef.current;
    }
    try {
      fetchingProfesionalRef.current = true;
      const { data: profesional, error } = await supabase
        .from('profesional')
        .select('id')
        .eq('idusuario', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.warn('Error buscando profesional:', error);
      }

      const idProfesional = profesional?.id ?? null;
      profesionalIdRef.current = idProfesional;
      return idProfesional;
    } catch (err) {
      console.error('Error resolviendo profesional:', err);
      return null;
    } finally {
      fetchingProfesionalRef.current = false;
    }
  };

  const handleMatchSuccess = async (
    recruiterUserId: string,
    profesionalId: string,
    ofertaId: string,
    idMatch: string,
  ) => {
    try {
      const { data: profData } = await supabase
        .from('profesional')
        .select(
          'idusuario, usuario!inner(id, nombre, apellido, fotoperfil, expo_push_token)',
        )
        .eq('id', profesionalId)
        .single();

      const { data: offerData } = await supabase
        .from('ofertatrabajo')
        .select('titulo')
        .eq('id', ofertaId)
        .single();

      const usuarioPro = profData?.usuario as any;
      const tituloOferta = offerData?.titulo || 'una oferta';

      const idUserPro = usuarioPro?.id;
      const tokenPro = usuarioPro?.expo_push_token;
      const nombrePro =
        `${usuarioPro?.nombre || ''} ${usuarioPro?.apellido || ''}`.trim();

      const notificationsToInsert = [];
      const timestamp = new Date();

      if (idUserPro) {
        const msgPro = `¡Felicitaciones! Tu perfil interesó para el puesto: ${tituloOferta}`;

        notificationsToInsert.push({
          id: uuid.v4().toString(),
          idusuario: idUserPro,
          texto: msgPro,
          tipo: 'match',
          idestadonotificacion: 1,
          activo: true,
          idofertatrabajo: ofertaId,
          created_at: timestamp,
        });

        if (tokenPro) {
          console.log('🚀 Enviando push al Profesional:', tokenPro);
          await sendPushNotification(tokenPro, '¡Es un Match! 🎉', msgPro, {
            type: 'match',
            offerId: ofertaId,
          });
        }
      }

      if (recruiterUserId) {
        const msgRecruiter = `¡Hiciste Match con ${nombrePro || 'un candidato'}!`;

        notificationsToInsert.push({
          id: uuid.v4().toString(),
          idusuario: recruiterUserId,
          texto: msgRecruiter,
          tipo: 'match',
          idestadonotificacion: 1,
          activo: true,
          idofertatrabajo: ofertaId,
          created_at: timestamp,
        });
      }

      if (notificationsToInsert.length > 0) {
        const { error } = await supabase
          .from('notificacion')
          .insert(notificationsToInsert);

        if (error) console.error('Error creando notificaciones en BD');
        else console.log('✅ Notificaciones guardadas para ambos usuarios');
      }

      if (onMatchSuccess) {
        onMatchSuccess(
          nombrePro || 'el candidato',
          idUserPro,
          usuarioPro.fotopefil,
          idMatch,
        );
      }
    } catch (error) {
      console.error('Error en handleMatchSuccess:', error);
    }
  };

  const handleLike = async (
    like: boolean,
    currentOfferId?: string,
    targetProfesionalId?: string,
  ) => {
    if (!currentOfferId) return;

    if (targetProfesionalId) {
      console.log('🛠️ MODO RECLUTADOR DETECTADO...');

      try {
        const nuevoEstado = like ? 2 : 3;

        const { data, error } = await supabase
          .from('ofertatrabajomatch')
          .update({
            idestadomatch: nuevoEstado,
            activo: true,
          })
          .eq('idofertatrabajo', currentOfferId)
          .eq('idprofesional', targetProfesionalId)
          .select('id')
          .single();

        if (error) {
          console.error('❌ Error actualizando match (Reclutador)');
        } else {
          console.log('✅ Match actualizado por reclutador');

          if (like && user?.id) {
            await handleMatchSuccess(
              user.id,
              targetProfesionalId,
              currentOfferId,
              data.id,
            );
          }
        }
      } catch (err) {
        console.error('💥 Exception actualizando match:', err);
      }

      ref.current?.next();
      return;
    }

    if (!user?.id) return;

    const idProfesional = await resolveProfesionalId();
    if (!idProfesional) return;

    const { data: existing } = await supabase
      .from('ofertatrabajomatch')
      .select('id')
      .eq('idprofesional', idProfesional)
      .eq('idofertatrabajo', currentOfferId)
      .maybeSingle();

    if (existing) {
      ref.current?.next();
      return;
    }

    try {
      const { data, error } = await supabase
        .from('ofertatrabajomatch')
        .insert([
          {
            id: uuid.v4().toString(),
            idofertatrabajo: currentOfferId,
            idprofesional: idProfesional,
            idestadomatch: like ? 1 : 3,
            activo: true,
            fechacreacion: new Date(),
          },
        ])
        .select('*');

      if (error) console.error('❌ Error insertando match:', error);
    } catch (err) {
      console.error('💥 Exception insertando match:', err);
    }

    ref.current?.next();
  };

  return { enabledScroll, handleScrollEnabled, handleLike };
};

export default useSwipeMatch;

/* Código anterior
import React, { useState } from 'react';
import { ICarouselInstance } from 'react-native-reanimated-carousel';

const useSwipeMatch = ({
  ref,
}: {
  ref: React.RefObject<ICarouselInstance | null>;
}) => {
  const [enabledScroll, setEnabledScroll] = useState(true);
  const handleScrollEnabled = (val: boolean) => {
    setEnabledScroll(val);
  };

  const handleLike = (like: boolean) => {
    console.log('like res', like);
    ref.current?.next();
  };
  return { enabledScroll, handleScrollEnabled, handleLike };
};

export default useSwipeMatch;
*/
