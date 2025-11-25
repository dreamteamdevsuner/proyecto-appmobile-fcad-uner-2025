import { createContext, PropsWithChildren, useEffect, useState } from 'react';

export const RecruiterContext = createContext<{}>({});
interface RecruiterContextProviderProps extends PropsWithChildren {}
export const RecruiterContextProvider = (
  props: RecruiterContextProviderProps,
) => {
  const [currentUserId, setCurrentUserId] = useState<string>();
  const getCurrentUserId = useEffect(() => {
    console.log('fired');
  }, [currentUserId]);

  return (
    <RecruiterContext.Provider value={{}}>
      {props.children}
    </RecruiterContext.Provider>
  );
};
