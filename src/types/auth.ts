
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  createdAt: string;
  isActive: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}
