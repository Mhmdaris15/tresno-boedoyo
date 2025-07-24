import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

interface User {
  id: string;
  email: string;
  role: 'VOLUNTEER' | 'COORDINATOR' | 'ADMIN';
  volunteer?: any;
  coordinator?: any;
}

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_AUTH'; payload: { user: User; token: string } }
  | { type: 'CLEAR_AUTH' }
  | { type: 'UPDATE_USER'; payload: User };

const initialState: AuthState = {
  isLoading: true,
  isAuthenticated: false,
  user: null,
  token: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_AUTH':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case 'CLEAR_AUTH':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const user = await authService.getCurrentUser();
        dispatch({ type: 'SET_AUTH', payload: { user, token } });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
      dispatch({ type: 'CLEAR_AUTH' });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { user, token } = await authService.login(email, password);
      
      localStorage.setItem('auth_token', token);
      dispatch({ type: 'SET_AUTH', payload: { user, token } });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const register = async (email: string, password: string, role: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { user, token } = await authService.register(email, password, role);
      
      localStorage.setItem('auth_token', token);
      dispatch({ type: 'SET_AUTH', payload: { user, token } });
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false });
      throw error;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('auth_token');
      dispatch({ type: 'CLEAR_AUTH' });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const refreshUser = async () => {
    try {
      if (state.token) {
        const user = await authService.getCurrentUser();
        dispatch({ type: 'UPDATE_USER', payload: user });
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const updateUser = (user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshUser,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
