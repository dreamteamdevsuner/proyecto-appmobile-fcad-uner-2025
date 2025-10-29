import { EntityCRUD } from '@services/interfaces/EntityCRUD';
import { IUser, IUserWithType } from '@services/interfaces/User.interface';
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
    const { data, error } = await this.supabase
      .from('usuario')
      .select('* ,tipousuario( id, nombre )')
      .eq('id', id);
    if (error) {
      throw error;
    }
    return data?.at(0) as IUserWithType | null;
  }
}

const userService = new UserService();
export default userService;
