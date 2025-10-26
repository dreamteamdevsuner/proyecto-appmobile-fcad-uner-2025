import { SupabaseClient } from '@supabase/supabase-js';

export interface AbstractUser<T> {
  supabase: SupabaseClient;
  create: (user: Partial<T>) => Partial<T> | void;
}
