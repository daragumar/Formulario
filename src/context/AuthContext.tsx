import { createContext, useState, useContext, useEffect, ReactNode, useMemo } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

interface User {
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'user_session';

const saveUser = async (user: User) => {
  const value = JSON.stringify(user);
  if (Platform.OS === 'web') {
    localStorage.setItem(STORAGE_KEY, value);
  } else {
    await SecureStore.setItemAsync(STORAGE_KEY, value);
  }
};

const getUser = async (): Promise<User | null> => {
  try {
    const data = Platform.OS === 'web'
      ? localStorage.getItem(STORAGE_KEY)
      : await SecureStore.getItemAsync(STORAGE_KEY);

    if (!data) return null;

    return JSON.parse(data);
  } catch (e) {
    // Si el JSON está pailas o hay error de lectura
    console.warn("Sesión corrupta detectada, limpiando.");
    await removeUser();
    return null;
  }
};

const removeUser = async () => {
  if (Platform.OS === 'web') {
    localStorage.removeItem(STORAGE_KEY);
  } else {
    await SecureStore.deleteItemAsync(STORAGE_KEY);
  }
};

// --- Provider ---
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = await getUser();
        if (storedUser) setUser(storedUser);
      } catch (error) {
        console.error('Error inicializando auth:', error);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (email === 'test@test.com' && password === '1234') {
      const userData = { email };
      await saveUser(userData);
      setUser(userData);
      return true;
    }
    return false;
  };

  const logout = async () => {
    await removeUser();
    setUser(null);
  };

  const authValue = useMemo(() => ({
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  }), [user, loading]);

  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};