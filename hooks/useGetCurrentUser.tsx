import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabaseClient';

const useGetCurrentUser = () => {
  const [currentUserId, setCurrentUserId] = useState<string>();
  const getCurrentUser = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.log('error getting current user');
        throw Error('error getting current user');
      }
      if (!data) {
        console.log('user not foud');
        throw Error('user not foud');
      }
      setCurrentUserId(data.user.id);
    } catch (error) {
      console.log('error getting current user');
      throw Error('error getting current user');
    }
  };
  useEffect(() => {
    getCurrentUser();
  }, []);
  return { currentUserId };
};

export default useGetCurrentUser;
