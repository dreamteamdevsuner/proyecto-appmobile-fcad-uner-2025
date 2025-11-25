import { CandidatePreview } from '@database/DBCandidatePreview';
import { supabase } from '../../supabase/supabaseClient';
import { Pagination } from '@services/shared/entityPreviewService';

interface CandidateWithOffer extends CandidatePreview {
  ofertaId: string;
  ofertaTitulo: string;
}

export const getCandidatesPreview = async (
  page = 1,
  itemsPerPage = 5,
  idUsuarioReclutador?: string,
): Promise<Pagination<CandidateWithOffer>> => {
  try {
    if (!idUsuarioReclutador) {
      console.warn('No se recibió idUsuarioReclutador');
      return {
        data: [],
        count: 0,
        next: false,
        prev: false,
        nextPage: null,
        prevPage: null,
      };
    }

    const { data: ofertas, error: ofertasError } = await supabase
      .from('ofertatrabajo')
      .select(
        'id, titulo, activo, idestadooferta, publicacion!inner(id, idusuario)',
      )
      .eq('activo', true)
      .eq('idestadooferta', 1)
      .eq('publicacion.idusuario', idUsuarioReclutador);
    if (ofertasError) {
      console.error('Error obteniendo ofertas');
      return {
        data: [],
        count: 0,
        next: false,
        prev: false,
        nextPage: null,
        prevPage: null,
      };
    }

    if (!ofertas || ofertas.length === 0) {
      return {
        data: [],
        count: 0,
        next: false,
        prev: false,
        nextPage: null,
        prevPage: null,
      };
    }

    const ofertaIds = ofertas.map((o) => o.id);

    const { data: matches, error: matchError } = await supabase
      .from('ofertatrabajomatch')
      .select('idprofesional, idofertatrabajo')
      .in('idofertatrabajo', ofertaIds)
      .eq('activo', true)
      .eq('idestadomatch', 1);

    if (matchError) {
      console.error('Error obteniendo matches');
      return {
        data: [],
        count: 0,
        next: false,
        prev: false,
        nextPage: null,
        prevPage: null,
      };
    }

    if (!matches || matches.length === 0) {
      return {
        data: [],
        count: 0,
        next: false,
        prev: false,
        nextPage: null,
        prevPage: null,
      };
    }

    const idsProfesionales = matches.map((m) => m.idprofesional);
    const { data: profesionalesDB, error: usuariosError } = await supabase
      .from('profesional')
      .select('idusuario, id')
      .in('id', idsProfesionales);

    if (usuariosError || !profesionalesDB || profesionalesDB.length === 0) {
      console.error(
        'Error obteniendo profesionales en tabla profesional',
        usuariosError,
      );
      return {
        data: [],
        count: 0,
        next: false,
        prev: false,
        nextPage: null,
        prevPage: null,
      };
    }

    const profesionalIdToUsuarioId = Object.fromEntries(
      profesionalesDB.map((p) => [p.id, p.idusuario]),
    );

    const idsUsuarios = [...new Set(profesionalesDB.map((p) => p.idusuario))];

    const { data: usuarios, error: usuariosInfoError } = await supabase
      .from('usuario')
      .select('id, nombre, apellido, fotoperfil, bio, iddireccion(ciudad)')
      .in('id', idsUsuarios);

    if (usuariosInfoError || !usuarios) {
      console.error('Error obteniendo info de usuarios');
      return {
        data: [],
        count: 0,
        next: false,
        prev: false,
        nextPage: null,
        prevPage: null,
      };
    }
    type SkillRow = {
      idprofesional: string;
      idskill: { nombre: string }; // single object, not array
    };
    const { data: skillsList, error: skillsListError } = (await supabase
      .from('profesionalskill')
      .select('idskill(nombre) , idprofesional')
      .in('idprofesional', idsProfesionales)) as {
      data: SkillRow[] | null;
      error: any;
    };

    if (skillsListError) {
      console.log(skillsListError);
      throw Error('error fetching skills list');
    }

    const parsedSkillLists = skillsList?.reduce(
      (
        acc: {
          [key: string]: { nombre: any }[];
        },
        curr,
      ) => {
        if (!acc?.[curr.idprofesional]) {
          acc[curr.idprofesional] = [curr.idskill];
        } else {
          acc[curr.idprofesional].push(curr.idskill);
        }
        return acc;
      },
      {},
    );

    const result: CandidateWithOffer[] = matches
      .map((m) => {
        const usuarioId = profesionalIdToUsuarioId[m.idprofesional];
        const usuario = usuarios.find((u) => u.id === usuarioId);
        const oferta = ofertas.find((o) => o.id === m.idofertatrabajo);

        if (!usuario || !oferta) {
          return null;
        }

        const fila = {
          ...usuario,
          skills: parsedSkillLists?.[m.idprofesional],
          profesionalId: m.idprofesional,
          ofertaId: oferta.id,
          ofertaTitulo: oferta.titulo || 'Oferta',
        };

        return fila;
      })
      .filter(Boolean) as unknown as CandidateWithOffer[];

    const totalCount = result.length;
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedData = result.slice(start, end);

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    return {
      data: paginatedData,
      count: totalCount,
      next: page < totalPages,
      prev: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    };
  } catch (err) {
    console.log('ERR', err);
    console.error('Error interno en getCandidatesPreview');
    return {
      data: [],
      count: 0,
      next: false,
      prev: false,
      nextPage: null,
      prevPage: null,
    };
  }
};

export const getCandidatePreview = async (
  page = 1,
  itemsPerPage = 5,
  idUsuarioReclutador?: string,
) =>
  // : Promise<CandidateWithOffer>
  {
    try {
      if (!idUsuarioReclutador) {
        console.warn('No se recibió idUsuarioReclutador');
        return {
          data: [],
          count: 0,
          next: false,
          prev: false,
          nextPage: null,
          prevPage: null,
        };
      }

      const { data: ofertas, error: ofertasError } = await supabase
        .from('ofertatrabajo')
        .select(
          'id, titulo, activo, idestadooferta, publicacion!inner(id, idusuario)',
        )
        .eq('activo', true)
        .eq('idestadooferta', 1)
        .eq('publicacion.idusuario', idUsuarioReclutador);
      if (ofertasError) {
        console.error('Error obteniendo ofertas');
        return {
          data: [],
          count: 0,
          next: false,
          prev: false,
          nextPage: null,
          prevPage: null,
        };
      }

      if (!ofertas || ofertas.length === 0) {
        return {
          data: [],
          count: 0,
          next: false,
          prev: false,
          nextPage: null,
          prevPage: null,
        };
      }

      const ofertaIds = ofertas.map((o) => o.id);

      const { data: matches, error: matchError } = await supabase
        .from('ofertatrabajomatch')
        .select('idprofesional, idofertatrabajo')
        .in('idofertatrabajo', ofertaIds)
        .eq('activo', true)
        .eq('idestadomatch', 1);

      if (matchError) {
        console.error('Error obteniendo matches');
        return {
          data: [],
          count: 0,
          next: false,
          prev: false,
          nextPage: null,
          prevPage: null,
        };
      }

      if (!matches || matches.length === 0) {
        return {
          data: [],
          count: 0,
          next: false,
          prev: false,
          nextPage: null,
          prevPage: null,
        };
      }

      const idsProfesionales = matches.map((m) => m.idprofesional);
      const { data: profesionalesDB, error: usuariosError } = await supabase
        .from('profesional')
        .select('idusuario, id')
        .in('id', idsProfesionales);

      if (usuariosError || !profesionalesDB || profesionalesDB.length === 0) {
        console.error(
          'Error obteniendo profesionales en tabla profesional',
          usuariosError,
        );
        return {
          data: [],
          count: 0,
          next: false,
          prev: false,
          nextPage: null,
          prevPage: null,
        };
      }

      const profesionalIdToUsuarioId = Object.fromEntries(
        profesionalesDB.map((p) => [p.id, p.idusuario]),
      );

      const idsUsuarios = [...new Set(profesionalesDB.map((p) => p.idusuario))];

      const { data: usuarios, error: usuariosInfoError } = await supabase
        .from('usuario')
        .select('id, nombre, apellido, fotoperfil, bio, iddireccion(ciudad)')
        .in('id', idsUsuarios);

      if (usuariosInfoError || !usuarios) {
        console.error('Error obteniendo info de usuarios');
        return {
          data: [],
          count: 0,
          next: false,
          prev: false,
          nextPage: null,
          prevPage: null,
        };
      }
      type SkillRow = {
        idprofesional: string;
        idskill: { nombre: string }; // single object, not array
      };
      const { data: skillsList, error: skillsListError } = (await supabase
        .from('profesionalskill')
        .select('idskill(nombre) , idprofesional')
        .in('idprofesional', idsProfesionales)) as {
        data: SkillRow[] | null;
        error: any;
      };

      if (skillsListError) {
        console.log(skillsListError);
        throw Error('error fetching skills list');
      }

      const parsedSkillLists = skillsList?.reduce(
        (
          acc: {
            [key: string]: { nombre: any }[];
          },
          curr,
        ) => {
          if (!acc?.[curr.idprofesional]) {
            acc[curr.idprofesional] = [curr.idskill];
          } else {
            acc[curr.idprofesional].push(curr.idskill);
          }
          return acc;
        },
        {},
      );

      const result: CandidateWithOffer[] = matches
        .map((m) => {
          const usuarioId = profesionalIdToUsuarioId[m.idprofesional];
          const usuario = usuarios.find((u) => u.id === usuarioId);
          const oferta = ofertas.find((o) => o.id === m.idofertatrabajo);

          if (!usuario || !oferta) {
            return null;
          }

          const fila = {
            ...usuario,
            skills: parsedSkillLists?.[m.idprofesional],
            profesionalId: m.idprofesional,
            ofertaId: oferta.id,
            ofertaTitulo: oferta.titulo || 'Oferta',
          };

          return fila;
        })
        .filter(Boolean) as unknown as CandidateWithOffer[];

      const totalCount = result.length;
      const start = (page - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginatedData = result.slice(start, end);

      const totalPages = Math.ceil(totalCount / itemsPerPage);

      return {
        data: paginatedData,
        count: totalCount,
        next: page < totalPages,
        prev: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        prevPage: page > 1 ? page - 1 : null,
      };
    } catch (err) {
      console.log('ERR', err);
      console.error('Error interno en getCandidatesPreview');
      return {
        data: [],
        count: 0,
        next: false,
        prev: false,
        nextPage: null,
        prevPage: null,
      };
    }
  };

/* Código anterior
import { CandidatePreview } from '@database/DBCandidatePreview';
import { getEntityPreview } from '@services/shared/entityPreviewService';

export const getCandidatesPreview = async (page = 1, itemsPerPage = 5) => {
  return getEntityPreview<CandidatePreview>(
    page,
    itemsPerPage,
    'usuario',
    '* ,  iddireccion(ciudad) ',
    { col: 'idtipousuario', value: '1' },
  );
};
*/
