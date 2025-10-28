import { Session, User, WeakPassword } from '@supabase/supabase-js';
// import supabase from '../supabase/supabase';
import { UserDTO } from './interfaces/UserDTO';
import { supabase } from '../supabase/supabaseClient';

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
