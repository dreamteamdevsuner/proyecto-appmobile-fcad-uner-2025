import { Pagination } from '@services/shared/entityPreviewService';
import React, { useEffect, useRef, useState } from 'react';

const usePaginatedData = <T,>(
  itemsPerPage = 5,
  databaseFunc: (page: number, itemsPerPage: number) => Promise<Pagination<T>>,
) => {
  const [paginatedData, setPaginatedData] = useState<Pagination<T>>({
    data: [],
    next: false,
    nextPage: 0,
    prev: false,
    prevPage: null,
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const firstRender = useRef(true);
  const setNextPage = async function () {
    const paginateResult = await databaseFunc(page, itemsPerPage);

    if (paginateResult.data.length > 0) {
      setPaginatedData((prev) => ({
        ...prev,
        ...paginateResult,
        data: [...prev.data, ...paginateResult.data],
      }));
      if (paginateResult.nextPage && !firstRender.current) {
        setPage(paginateResult.nextPage);
      }
    }
  };

  const getPaginatedData = async () => {
    try {
      setLoading(true);
      await setNextPage();
      firstRender.current = false;
    } catch (error) {
      throw Error('error getting pagination');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPaginatedData();
  }, [page]);
  return { data: paginatedData as Pagination<T>, loading, page, setNextPage };
};

export default usePaginatedData;
