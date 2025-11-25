import { Pagination } from '@services/shared/entityPreviewService';
import { useEffect, useRef, useState } from 'react';

const usePaginatedData = <T,>(
  itemsPerPage = 5,
  databaseFunc: (page: number, itemsPerPage: number) => Promise<Pagination<T>>,
) => {
  const [paginatedData, setPaginatedData] = useState<Pagination<T>>({
    data: [],
    count: 0,
    next: false,
    prev: false,
    nextPage: null,
    prevPage: null,
  });

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const firstRender = useRef(true);

  const loadPage = async (pageToLoad: number) => {
    const paginateResult = await databaseFunc(pageToLoad, itemsPerPage);
    if (paginateResult.data.length > 0) {
      setPaginatedData((prev) => ({
        ...paginateResult,
        data:
          pageToLoad === 1
            ? paginateResult.data // primera carga
            : [...prev.data, ...paginateResult.data], // append
      }));
    }
    return paginateResult;
  };

  const setNextPage = async () => {
    if (loading || !paginatedData.next) return; // Evita doble llamada
    const result = await loadPage(page + 1);
    if (result.nextPage) setPage(result.nextPage);
  };

  const loadNewDataFromSubscription = (newEntity: T) => {
    setPaginatedData((prev) => ({ ...prev, data: [newEntity, ...prev.data] }));
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await loadPage(page);
      setLoading(false);
      firstRender.current = false;
    };
    fetchData();
  }, [page]);

  return {
    data: paginatedData,
    loading,
    page,
    setNextPage,
    loadNewDataFromSubscription,
  };
};

export default usePaginatedData;
