import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from 'react';
import {
  clearAuth,
  SecureStoreItem,
  setItem,
  getItem,
} from '../utils/secure-store';

export enum Role {
  candidate = 'candidate',
  recruiter = 'recruiter',
}

interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

interface State {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

export enum AUTH_ACTIONS {
  RESTORE_TOKEN = 'RESTORE_TOKEN',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  LOGIN_ERROR = 'LOGIN_ERROR',
  SET_LOADING = 'SET_LOADING',
}

type Action =
  | {
      type: AUTH_ACTIONS.RESTORE_TOKEN;
      payload: {
        user: User | null;
        token: string | null;
        refreshToken: string | null;
      };
    }
  | {
      type: AUTH_ACTIONS.LOGIN;
      payload: { user: User; token: string; refreshToken: string };
    }
  | { type: AUTH_ACTIONS.LOGOUT }
  | { type: AUTH_ACTIONS.LOGIN_ERROR; payload: { error: string } }
  | { type: AUTH_ACTIONS.SET_LOADING; payload: { loading: boolean } };

type Dispatch = (action: Action) => void;

const initialState: State = {
  user: null,
  token: null,
  refreshToken: null,
  loading: true,
  error: null,
};

const authReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case AUTH_ACTIONS.RESTORE_TOKEN:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        loading: false,
      };
    case AUTH_ACTIONS.LOGIN:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        loading: false,
        error: null,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        loading: false,
      };
    case AUTH_ACTIONS.LOGIN_ERROR:
      return {
        ...state,
        error: action.payload.error,
        loading: false,
      };
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload.loading,
      };
    default:
      return state;
  }
};

type AuthContextType = {
  state: State;
  dispatch: React.Dispatch<Action>;
  logout: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const restoreToken = async () => {
      try {
        const token = await getItem<string>(SecureStoreItem.TOKEN);
        const refreshToken = await getItem<string>(
          SecureStoreItem.REFRESH_TOKEN,
        );
        const user = await getItem<User>(SecureStoreItem.USER);

        dispatch({
          type: AUTH_ACTIONS.RESTORE_TOKEN,
          payload: { user, token, refreshToken },
        });
      } catch (error) {
        console.error('Error al restaurar sesión:', error);
        dispatch({
          type: AUTH_ACTIONS.RESTORE_TOKEN,
          payload: { user: null, token: null, refreshToken: null },
        });
      }
    };

    restoreToken();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: { loading: true } });

    try {
      // TODO: Por ahora simular inicio de sesion a API con mocks, cambiar despues
      let user: User | null = null;

      if (email === 'dev@mail.com') {
        user = {
          id: 222,
          email: 'dev@mail.com',
          name: 'Dev',
          role: Role.candidate,
        };
      } else if (email === 'recruiter@mail.com') {
        user = {
          id: 111,
          email: 'recruiter@mail.com',
          name: 'Recruiter',
          role: Role.recruiter,
        };
      }

      if (!user) {
        throw new Error('Credenciales inválidas');
      }

      const token = 'fake-jwt-token';
      const refreshToken = 'fake-refresh-token';

      await setItem(SecureStoreItem.TOKEN, token);
      await setItem(SecureStoreItem.REFRESH_TOKEN, refreshToken);
      await setItem(SecureStoreItem.USER, user);

      dispatch({
        type: AUTH_ACTIONS.LOGIN,
        payload: { user, token, refreshToken },
      });
      return true;
    } catch (error: any) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_ERROR,
        payload: { error: error.message },
      });
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await clearAuth();
    } catch (error) {
      console.error('Error al limpiar almacenamiento:', error);
    } finally {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  }, []);

  // Esto es para disponibilizar las funciones cuando hacemos const { state, logout, login } = useAuth(); por ej
  const value = {
    state,
    dispatch,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
