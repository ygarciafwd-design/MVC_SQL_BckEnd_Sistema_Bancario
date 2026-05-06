import { createContext, useContext, useState, useEffect } from 'react';
import { api } from './api';

const AuthContext = createContext(null);

/**
 * AuthProvider wraps the entire app and provides:
 *  - user: the currently authenticated user (or null)
 *  - loading: whether the initial auth check is still running
 *  - login(credentials): logs in and sets user state
 *  - logout(): clears cookie and user state
 *  - isAdmin: convenience boolean
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, attempt to load the user profile from the existing cookie
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const data = await api.auth.getProfile();
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const data = await api.auth.login(credentials);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await api.auth.logout();
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access the auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
