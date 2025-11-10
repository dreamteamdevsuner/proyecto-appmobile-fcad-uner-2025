import { EntityCRUD } from '@services/interfaces/EntityCRUD';
import { IUser } from '@services/interfaces/User.interface';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../../supabase/supabaseClient';

class UserService implements EntityCRUD<IUser> {
  supabase: SupabaseClient<any, 'public', 'public', any, any>;

  constructor() {
    this.supabase = supabase;
  }
  private executeQuery(query: string) {
    return query;
  }
  async getOne(id: string) {
    try {
      const { data, error } = await this.supabase

        .from('usuario')
        .select('* ,tipousuario( id, nombre ) ')
        .eq('id', '21500e90-f8f4-45f0-8bbd-04910fe4c91a')
        .maybeSingle();

      if (error) {
        console.log('error in getOne', error);
        throw error;
      }

      return (data && (data as unknown as IUser)) || null;
    } catch (error) {
      console.log('ERR', error);
    }
  }
}

const userService = new UserService();
export default userService;
