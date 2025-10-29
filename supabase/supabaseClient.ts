import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';
import { Database } from './types';

export const supabase: SupabaseClient = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
);
