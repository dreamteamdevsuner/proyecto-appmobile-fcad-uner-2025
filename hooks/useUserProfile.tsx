import { useAuth } from '@appContext/authContext';
import { PerfilView } from '@models/PerfilView';
import { Role } from '@services/interfaces/TipoUsuario.interface';
import {
  getEnlaces,
  getEstudios,
  getExperiencia,
  getOfertasReclutador,
  getProfesional,
  getSkills,
  getUsuarioBase,
} from '@services/profile/ProfileService';
import { useCallback, useEffect, useState } from 'react';

export const useUserProfile = (userId?: string) => {
  const { state } = useAuth();

  const [profileUser, setProfileUser] = useState<PerfilView | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const isOwnProfile = userId === state.user?.id;

  const fetchProfile = useCallback(
    async (silent = false) => {
      console.log('USER ID', userId);
      if (!userId) {
        setNotFound(true);
        return;
      }

      if (!silent) setLoading(true);

      try {
        const usuarioBase = await getUsuarioBase(userId);
        if (!usuarioBase) {
          setNotFound(true);
          return;
        }

        const tipoUsuario = usuarioBase.tipousuario?.nombre;

        let normalized: PerfilView = {
          id: usuarioBase.id,
          nombre: usuarioBase.nombre,
          apellido: usuarioBase.apellido,
          email: usuarioBase.email,
          bio: usuarioBase.bio || null,
          fotoPerfil: usuarioBase.fotoperfil || undefined,
          rol: usuarioBase.rol || undefined,
          direccion: usuarioBase.direccion || null,
          tipoUsuario: usuarioBase.tipousuario || null,
          enlaces: [],
          estudios: [],
          experiencia: [],
          skills: { habilidades: [], herramientas: [], idiomas: [], otras: [] },
          ofertasPublicadas: [],
        };

        const [enlaces, experiencia] = await Promise.all([
          getEnlaces(userId),
          getExperiencia(userId),
        ]);
        normalized.enlaces = enlaces || [];
        normalized.experiencia = experiencia || [];

        if (tipoUsuario === Role.PROFESIONAL) {
          const profesional = await getProfesional(userId);
          if (profesional) {
            const [estudios, skillsRaw] = await Promise.all([
              getEstudios(profesional.id),
              getSkills(profesional.id),
            ]);

            const habilidades = (skillsRaw || []).map((s: any) => ({
              nombre: s.skill?.[0]?.nombre || s.skill?.nombre || '',
            }));

            normalized.estudios = estudios || [];
            normalized.skills = {
              habilidades,
              herramientas: [],
              idiomas: [],
              otras: [],
            };
          }
        } else if (tipoUsuario === Role.RECLUTADOR) {
          const [ofertas] = await Promise.all([
            getOfertasReclutador(userId),
            // getReclutador(userId) // no se usa - no hay data en la bd
          ]);
          normalized.ofertasPublicadas = ofertas || [];
        }
        setProfileUser((prev) => {
          const changed = JSON.stringify(prev) !== JSON.stringify(normalized);
          if (changed) console.log('Profile changed, updating state');
          return changed ? normalized : prev;
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        setNotFound(true);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [userId, refreshing === false],
  );

  useEffect(() => {
    console.log('RENDERING');
    fetchProfile();
  }, [refreshing === false]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await fetchProfile(true);
    } finally {
      setRefreshing(false);
    }
  }, [fetchProfile]);

  return {
    profileUser,
    loading,
    notFound,
    refreshing,
    onRefresh,
    isOwnProfile,
  };
};
