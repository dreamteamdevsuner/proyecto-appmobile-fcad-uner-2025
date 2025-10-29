import { SupabaseClient } from '@supabase/supabase-js';
import { AbstractUser } from '../interfaces/AbstractUser';
// import supabase from '../../supabase/supabase';

import { supabase } from '../../supabase/supabaseClient';
import { IUser } from '@services/interfaces/User.interface';

// import { Candidate } from '../../interfaces/Candidate';
// interface Test {
//   id: number;
//   name: 1;
// }

class CandidateService implements AbstractUser<IUser> {
  supabase: SupabaseClient<any, 'public', 'public', any, any>;
  constructor() {
    this.supabase = supabase;
  }
  create(user: Partial<IUser>) {
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
