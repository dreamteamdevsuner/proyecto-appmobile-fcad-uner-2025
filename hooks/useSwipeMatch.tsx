import React, { useState, useRef } from 'react';
import { ICarouselInstance } from 'react-native-reanimated-carousel';
import { supabase } from '../supabase/supabaseClient';
import uuid from 'react-native-uuid';
import { useAuth } from '../appContext/authContext';

const useSwipeMatch = ({
  ref,
}: {
  ref: React.RefObject<ICarouselInstance | null>;
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

  const handleLike = async (
    like: boolean,
    currentOfferId?: string,
    targetProfesionalId?: string,
  ) => {
    console.log('❤️ LIKE:', like);
    console.log('💾 currentOfferId:', currentOfferId);
    console.log(
      '👤 targetProfesionalId (Reclutador mode):',
      targetProfesionalId,
    );

    if (!currentOfferId) {
      console.warn('No hay oferta seleccionada — skip');
      return;
    }

    if (targetProfesionalId) {
      console.log(
        '🛠️ MODO RECLUTADOR DETECTADO: Actualizando match existente...',
      );

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
          .select();

        if (error) {
          console.error('❌ Error actualizando match.');
        } else {
          console.log('✅ Match actualizado correctamente.');
        }
      } catch (err) {
        console.error('💥 Exception actualizando match:');
      }

      ref.current?.next();
      return;
    }

    if (!user?.id) {
      console.warn('No hay usuario logueado');
      return;
    }

    const idProfesional = await resolveProfesionalId();

    if (!idProfesional) {
      console.warn(
        'Usuario no es profesional y no se pasó targetProfesionalId. Abortando.',
      );
      return;
    }

    const { data: existing } = await supabase
      .from('ofertatrabajomatch')
      .select('id')
      .eq('idprofesional', idProfesional)
      .eq('idofertatrabajo', currentOfferId)
      .maybeSingle();

    if (existing) {
      console.log('Esta oferta ya fue votada por este profesional.');
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

      if (error) {
        console.error('❌ Error insertando like.');
      } else {
        console.log('✅ Like insertado por profesional.');
      }
    } catch (err) {
      console.error('💥 Exception insertando like.');
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
