import { useCallback, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../api';
import { AuthContext } from './auth-context';

const TOKEN_KEY = 'marketplace_token';
const USER_KEY = 'marketplace_user';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || '');
  const [favoriteLoadingIds, setFavoriteLoadingIds] = useState<string[]>([]);
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [authReady, setAuthReady] = useState(() => !localStorage.getItem(TOKEN_KEY));

  useEffect(() => {
    if (!token) {
      return;
    }

    apiRequest('/users/me', { token })
      .then((me) => {
        setUser(me);
        localStorage.setItem(USER_KEY, JSON.stringify(me));
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken('');
        setUser(null);
        setAuthReady(true);
      })
      .finally(() => setAuthReady(true));
  }, [token]);

  const login = async (email, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password }
    });

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  };

  const register = async (name, email, password) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: { name, email, password }
    });

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const setFavorites = useCallback((favorites) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, favorites };
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const toggleFavorite = useCallback(async (productId: string, currentlyFavorite: boolean) => {
    if (!token) {
      throw new Error('Authentication required');
    }

    const prevFavorites = user?.favorites || [];
    const optimisticFavorites = currentlyFavorite
      ? prevFavorites.filter((id) => id !== productId)
      : [...prevFavorites, productId];

    setFavoriteLoadingIds((prev) => [...prev, productId]);
    setFavorites(optimisticFavorites);

    try {
      const result = await apiRequest(`/products/${productId}/favorite`, {
        method: currentlyFavorite ? 'DELETE' : 'POST',
        token
      });
      setFavorites((result.favorites || []).map((id: string) => id.toString()));
    } catch (error) {
      setFavorites(prevFavorites);
      throw error;
    } finally {
      setFavoriteLoadingIds((prev) => prev.filter((id) => id !== productId));
    }
  }, [setFavorites, token, user?.favorites]);

  const favoriteIds = useMemo(() => user?.favorites || [], [user?.favorites]);

  const value = useMemo(
    () => ({
      token,
      user,
      authReady,
      favoriteIds,
      favoriteLoadingIds,
      login,
      register,
      logout,
      setFavorites,
      toggleFavorite
    }),
    [token, user, authReady, favoriteIds, favoriteLoadingIds, setFavorites, toggleFavorite]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

