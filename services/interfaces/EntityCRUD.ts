import { SupabaseClient } from '@supabase/supabase-js';

export interface EntityCRUD<T> {
  supabase: SupabaseClient;
  // get:   (user: Partial<T>) => Partial<T> | void;
}
