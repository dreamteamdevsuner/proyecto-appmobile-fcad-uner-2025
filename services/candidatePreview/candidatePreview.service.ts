import { CandidatePreview } from '@database/DBCandidatePreview';
import { getEntityPreview } from '@services/shared/entityPreviewService';

export const getCandidatePreview = async (page = 1, itemsPerPage = 5) => {
  return getEntityPreview<CandidatePreview>(
    page,
    itemsPerPage,
    'usuario',
    '* ,  iddireccion(ciudad) ',
    { col: 'idtipousuario', value: '1' },
  );
};
