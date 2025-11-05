import React, { useEffect, useRef, useState } from 'react';

const usePaginatedData = <T,>(
  itemsPerPage = 5,
  databaseFunc: (page: number, itemsPerPage: number) => Promise<Array<T>>,
) => {
  const [paginatedData, setPaginatedData] = useState<Array<T>>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const firstRender = useRef(true);
  const setNextPage = async function () {
    const paginateResult = await databaseFunc(page, itemsPerPage);
    console.log('paginate', paginateResult);
    if (paginateResult.length > 0) {
      setPaginatedData((prev) => [...prev, ...paginateResult]);
      if (!firstRender.current) {
        setPage(page + 1);
      }
    }
  };

  const getPaginatedData = async () => {
    try {
      setLoading(true);
      await setNextPage();
    } catch (error) {
      console.log('error getting pagination');
    } finally {
      firstRender.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('firing fetch');

    getPaginatedData();
    () => {
      console.log('unmount');
      return setPage(1);
    };
  }, [page]);
  return { data: paginatedData, loading, page, setNextPage };
};

export default usePaginatedData;
