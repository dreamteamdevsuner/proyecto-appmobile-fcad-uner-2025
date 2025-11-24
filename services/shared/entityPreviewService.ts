import { supabase } from '../../supabase/supabaseClient';

export interface Pagination<T> {
  next: boolean;
  prev: boolean;
  nextPage: number | null;
  prevPage: number | null;
  data: Array<T>;
  count: number;
}

export async function getEntityPreview<T>(
  page: number,
  itemsPerPage: number,
  table: string,
  select: string,
  options?: { filters?: Record<string, any> },
): Promise<Pagination<T>> {
  let query = supabase
    .from(table)
    .select(select, { count: 'exact' })
    .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

  if (options?.filters) {
    for (const [key, value] of Object.entries(options.filters)) {
      query = query.eq(key, value);
    }
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error en getEntityPreview:', error);
    return {
      data: [],
      count: 0,
      next: false,
      prev: false,
      nextPage: null,
      prevPage: null,
    };
  }

  const totalPages = count ? Math.ceil(count / itemsPerPage) : 1;

  return {
    data: data as T[],
    count: count ?? 0,
    next: page < totalPages,
    prev: page > 1,
    nextPage: page < totalPages ? page + 1 : null,
    prevPage: page > 1 ? page - 1 : null,
  };
}

/*
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
*/
