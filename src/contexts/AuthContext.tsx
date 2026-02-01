import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (name: string) => void;
  signOut: () => void;
}

const AUTH_STORAGE_KEY = 'weather_app_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const signIn = (name: string) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@local.user`,
      name: name,
      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff`,
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
  };

  const signOut = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
