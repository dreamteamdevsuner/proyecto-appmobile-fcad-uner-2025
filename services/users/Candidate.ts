import { SupabaseClient } from '@supabase/supabase-js';
import { AbstractUser } from './AbstractUser';
// import supabase from '../../supabase/supabase';
import { User } from '../interfaces/User';
import { supabase } from '../../supabase/supabaseClient';

// import { Candidate } from '../../interfaces/Candidate';
// interface Test {
//   id: number;
//   name: 1;
// }
class CandidateService implements AbstractUser<User> {
  supabase: SupabaseClient<any, 'public', 'public', any, any>;
  constructor() {
    this.supabase = supabase;
  }
  create(user: Partial<User>) {
    // return {  };
  }
  async list() {
    const { data, error } = await supabase
      .from('usuario')
      .select('* , tipousuario(*)   ');
    if (error) {
      return error;
    }
    console.log('USERS LIST', data);
    return data;
  }
}
const candidateService = new CandidateService();
export default candidateService;
