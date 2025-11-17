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

  // Cacheamos el idProfesional para no consultarlo cada vez
  const profesionalIdRef = useRef<string | null>(null);
  const fetchingProfesionalRef = useRef<boolean>(false);

  const handleScrollEnabled = (val: boolean) => {
    setEnabledScroll(val);
  };

  // Obtiene (y cachea) el id de la fila `profesional` relacionada al user.id (idusuario)
  const resolveProfesionalId = async (): Promise<string | null> => {
    if (profesionalIdRef.current) return profesionalIdRef.current;
    if (!user?.id) return null;

    // Evitamos llamadas paralelas
    if (fetchingProfesionalRef.current) {
      // si ya se está pidiendo, esperamos un pequeño lapso y reintentamos (simple backoff)
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

      if (error) {
        console.warn('Error buscando profesional por idusuario:', error);
        return null;
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

  const handleLike = async (like: boolean, currentOfferId?: string) => {
    console.log('❤️ LIKE:', like);
    console.log('💾 currentOfferId:', currentOfferId);

    if (!currentOfferId) {
      console.warn('No hay oferta seleccionada — skip insert');
      return;
    }

    if (!user?.id) {
      console.warn('No hay usuario logueado — skip insert');
      // acá mostrar UI para pedir login
      return;
    }

    // Otener idProfesional asociado al user.id
    const idProfesional = await resolveProfesionalId();
    if (!idProfesional) {
      console.warn('Soy reclutador → NO busco tabla profesional');
    }

    // Revisar si ya existe
    const { data: existing, error: existError } = await supabase
      .from('ofertatrabajomatch')
      .select('id')
      .eq('idprofesional', idProfesional)
      .eq('idofertatrabajo', currentOfferId)
      .single();

    if (existing) {
      console.log(
        'Esta oferta ya fue votada por este profesional — skip insert',
      );
      ref.current?.next();
      return;
    }

    // Insertar el match
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
        console.error('❌ Error insertando match:', error);
      } else {
        console.log('✅ Match insertado correctamente:', data);
      }
    } catch (err) {
      console.error('💥Exception insertando match:', err);
    }

    // Avanzar el carrusel
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
