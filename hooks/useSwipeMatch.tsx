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

  // ... (resolveProfesionalId queda igual, no hace falta tocarlo)
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
        .maybeSingle(); // Usar maybeSingle para evitar error si no encuentra filas (caso reclutador)

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

  // MODIFICAMOS LA FIRMA DE LA FUNCIÓN: Agregamos targetProfesionalId opcional
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

    // ==========================================
    // 🅰️ MODO RECLUTADOR (UPDATE)
    // ==========================================
    if (targetProfesionalId) {
      console.log(
        '🛠️ MODO RECLUTADOR DETECTADO: Actualizando match existente...',
      );

      try {
        // Buscamos el match existente entre esa oferta y ese profesional
        // y actualizamos el estado (2: Match/Aceptado, 3: Descartado por reclutador)
        // Nota: Si el reclutador da dislike, podrías poner 3 (descartado) o dejarlo en 1.
        // Asumo 3 para que no vuelva a aparecer.

        const nuevoEstado = like ? 2 : 3;

        const { data, error } = await supabase
          .from('ofertatrabajomatch')
          .update({
            idestadomatch: nuevoEstado,
            activo: true, // Aseguramos que siga activo
            // fechamatch: new Date() // Si tuvieras un campo fecha de match, iría aquí
          })
          .eq('idofertatrabajo', currentOfferId)
          .eq('idprofesional', targetProfesionalId)
          .select();

        if (error) {
          console.error('❌ Error actualizando match (Reclutador):', error);
        } else {
          console.log('✅ Match actualizado por reclutador:', data);
          // AQUÍ PODRÍAS DISPARAR LA NOTIFICACIÓN PUSH
        }
      } catch (err) {
        console.error('💥 Exception actualizando match:', err);
      }

      ref.current?.next();
      return; // 🛑 SALIMOS AQUÍ PARA NO EJECUTAR LÓGICA DE PROFESIONAL
    }

    // ==========================================
    // 🅱️ MODO PROFESIONAL (INSERT)
    // ==========================================

    // Si llegamos acá, es porque targetProfesionalId es undefined,
    // así que asumimos que soy un profesional dando like.

    if (!user?.id) {
      console.warn('No hay usuario logueado');
      return;
    }

    const idProfesional = await resolveProfesionalId();

    // Validación extra: Si no hay targetProfesionalId Y tampoco soy profesional, algo está mal
    if (!idProfesional) {
      console.warn(
        '⚠️ Usuario no es profesional y no se pasó targetProfesionalId. Abortando.',
      );
      return;
    }

    // Revisar si ya existe (Lógica original)
    const { data: existing } = await supabase
      .from('ofertatrabajomatch')
      .select('id')
      .eq('idprofesional', idProfesional)
      .eq('idofertatrabajo', currentOfferId)
      .maybeSingle();

    if (existing) {
      console.log(
        'Esta oferta ya fue votada por este profesional — skip insert',
      );
      ref.current?.next();
      return;
    }

    // Insertar el match (Lógica original)
    try {
      const { data, error } = await supabase
        .from('ofertatrabajomatch')
        .insert([
          {
            id: uuid.v4().toString(),
            idofertatrabajo: currentOfferId,
            idprofesional: idProfesional,
            idestadomatch: like ? 1 : 3, // 1: Esperando (si like), 3: Descartado (si dislike)
            activo: true,
            fechacreacion: new Date(),
          },
        ])
        .select('*');

      if (error) {
        console.error('❌ Error insertando match:', error);
      } else {
        console.log('✅ Match insertado por profesional:', data);
      }
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
