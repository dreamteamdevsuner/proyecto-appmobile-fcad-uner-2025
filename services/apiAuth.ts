import { AuthError, Session, User, WeakPassword } from '@supabase/supabase-js';
// import supabase from '../supabase/supabase';
import { UserDTO } from './interfaces/UserDTO';
import { supabase } from '../supabase/supabaseClient';

export const signIn = async (
  user: UserDTO,
): Promise<{
  data:
    | {
        user: User;
        session: Session;
        weakPassword?: WeakPassword;
      }
    | {
        user: null;
        session: null;
        weakPassword?: null | undefined;
      };
  error: AuthError | null;
}> => {
  const { data, error } = await supabase.auth.signInWithPassword(user);

  if (error) {
    console.error(error.message);
  }

  return { data, error };
};
export const signUp = async (user: UserDTO, extras: Record<string, any>) => {
  const { data, error } = await supabase.auth.signUp({
    email: user.email,
    password: user.password,

    options: {
      data: extras,
    },
  });
  if (error) {
    console.log(error);
    throw Error(error.message);
  }
  return data;
};
