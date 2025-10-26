import { Session, User, WeakPassword } from '@supabase/supabase-js';
import supabase from '../supabase/supabase';
import { UserDTO } from './interfaces/UserDTO';

export const signIn = async (
  user: UserDTO,
): Promise<
  | {
      user: User;
      session: Session;
      weakPassword?: WeakPassword;
    }
  | undefined
> => {
  const { data, error } = await supabase.auth.signInWithPassword(user);

  if (error) {
    throw Error(error.message);
  }

  return data;
};
export const signUp = async (user: UserDTO) => {
  const { data, error } = await supabase.auth.signUp(user);
  if (error) {
    throw Error(error.message);
  }
  return data;
};
