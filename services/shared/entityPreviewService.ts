import { supabase } from '../../supabase/supabaseClient';

export interface Pagination<T> {
  next: boolean;
  prev: boolean;
  nextPage: number | null;
  prevPage: number | null;
  data: Array<T>;
}

export const getEntityPreview = async <T>(
  page = 1,
  itemsPerPage = 5,
  tableName: string,
  query: string,
  where?: { col: string; value: any },
): Promise<Pagination<T>> => {
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage;
  let supabaseQuery = supabase
    .from(tableName)
    .select(query)
    .order('id', { ascending: true });

  if (where) {
    supabaseQuery = supabaseQuery.eq(where.col, '1');
  }
  supabaseQuery = supabaseQuery.range(from, to);
  const { data, error } = await supabaseQuery;
  if (error) {
    console.error(error);
    console.error('Error getting entity preview ');
    throw Error('Error getting  entity preview');
  }
  const isNext = data.pop();

  return {
    next: Boolean(isNext),
    prev: page != 1,
    nextPage: Boolean(isNext) ? page + 1 : null,
    prevPage: page !== 1 ? page - 1 : null,
    data: data as T[],
  };
};
