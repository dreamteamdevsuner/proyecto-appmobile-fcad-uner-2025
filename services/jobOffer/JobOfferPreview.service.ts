import { supabase } from '../../supabase/supabaseClient';

export const getJobOffersPreview = async (page = 1, itemsPerPage = 5) => {
  const { data, error } = await supabase.from('ofertatrabajo').select('*');
  if (error) {
    console.error('Error getting job offers ');
    throw Error('Error getting job offers ');
  }
  return data;
};
