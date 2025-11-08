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

export const sendPasswordResetEmail = async (email: string) => {
  console.log('Enviando email de reseteo para:', email);

  const { data, error } = await supabase.auth.resetPasswordForEmail(email);

  if (error) {
    console.log('Error al enviar email de reseteo: ', error.message);
    return { success: false, error };
  }
  return { success: true, data };
};

export const updatePassword = async (newPassword: string) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error('Error al actualizar la contraseña: ', error.message);
    return { success: false, error };
  }
  return { success: true, data };
};

export const resetPasswordWithToken = async (
  email: string,
  token: string,
  newPassword: string
) => {
  // 1. Verificar el token y el email.
  const { data: verifyData, error: verifyError } =
    await supabase.auth.verifyOtp({
      email: email,
      token: token,
      type: 'recovery', // ¡Importante que sea 'recovery'!
    });

  if (verifyError) {
    console.error('Error al verificar el token:', verifyError.message);
    return { success: false, error: verifyError };
  }

  // 2. Si el token es válido, actualizamos la contraseña del usuario.
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    console.error('Error al actualizar la contraseña:', error.message);
    return { success: false, error: error };
  }

  // ¡Éxito!
  return { success: true, data };
};
