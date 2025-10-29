import React, { use, useState } from 'react';
import { supabase } from '../supabase/supabaseClient';
import {
  AuthError,
  Session,
  SupabaseClient,
  User,
  WeakPassword,
} from '@supabase/supabase-js';
import { signIn } from '../services/apiAuth';
import { UserDTO } from '@services/interfaces/UserDTO';
import { Message } from '../types/models/Message';

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [signedUser, setSignedUser] = useState<
    | {
        user: User;
        session: Session;
        weakPassword?: WeakPassword;
      }
    | {
        user: null;
        session: null;
        weakPassword?: null | undefined;
      }
  >();
  const [error, setError] = useState<string>();
  const handleSignIn = async (user: UserDTO) => {
    try {
      setLoading(true);
      const { data, error } = await signIn(user);
      if (error) {
        setError(error.message);
        throw error;
      }

      setSignedUser(data);
    } catch (error: unknown) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return { signedUser, loading, error, handleSignIn };
};

export default useAuth;
