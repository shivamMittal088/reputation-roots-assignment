import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../api';

type AuthUser = {
  id: string;
  name: string;
  email: string;
  favorites: string[];
};

type AuthContextValue = {
  token: string;
  user: AuthUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setFavorites: (favorites: string[]) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'marketplace_token';
const USER_KEY = 'marketplace_user';

export function AuthProvider({ children }) {
  const [token, setToken] = useState('');
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function bootstrap() {
      const [storedToken, storedUser] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY)
      ]);

      if (storedToken) {
        setToken(storedToken);
      }

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      setReady(true);
    }

    bootstrap();
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    apiRequest('/users/me', { token })
      .then(async (me) => {
        setUser(me);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(me));
      })
      .catch(async () => {
        setToken('');
        setUser(null);
        await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
      });
  }, [token]);

  const login = async (email, password) => {
    const data = await apiRequest('/auth/login', { method: 'POST', body: { email, password } });
    setToken(data.token);
    setUser(data.user);
    await AsyncStorage.setItem(TOKEN_KEY, data.token);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(data.user));
  };

  const logout = async () => {
    setToken('');
    setUser(null);
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  };

  const setFavorites = async (favorites) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, favorites };
      AsyncStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  };

  const value = useMemo(() => ({ token, user, ready, login, logout, setFavorites }), [token, user, ready]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
