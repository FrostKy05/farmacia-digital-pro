
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Datos de ejemplo (en producción esto vendría de una base de datos)
const DEMO_USERS: User[] = [
  {
    id: '1',
    name: 'Admin Principal',
    email: 'admin@farmacia.com',
    role: 'admin',
    createdAt: '2024-01-01',
    isActive: true,
  },
  {
    id: '2',
    name: 'María González',
    email: 'maria@farmacia.com',
    role: 'employee',
    createdAt: '2024-01-15',
    isActive: true,
  },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay una sesión guardada
    const savedUser = localStorage.getItem('pharmacy_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulación de autenticación
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = DEMO_USERS.find(u => u.email === email);
    
    // Credenciales de demo
    const validCredentials = 
      (email === 'admin@farmacia.com' && password === 'admin123') ||
      (email === 'maria@farmacia.com' && password === 'empleado123');
    
    if (foundUser && validCredentials) {
      setUser(foundUser);
      localStorage.setItem('pharmacy_user', JSON.stringify(foundUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pharmacy_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
