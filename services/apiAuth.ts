import { Session, User, WeakPassword } from '@supabase/supabase-js';
import supabase from '../supabase/supabase';
import { Message } from '../types/Message';

export interface LoginUser {
  email: string;
  password: string;
}
export const apiSignIn = async (
  user: LoginUser,
): Promise<
  | {
      user: User;
      session: Session;
      weakPassword?: WeakPassword;
    }
  | undefined
> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword(user);
    console.log('DATAAA', data);
    if (error) {
      throw Error(error.message);
    }
    return data;
  } catch (error) {
    const err: Error = error as Error;
    console.log('singIn error', err.message);
  }
};
