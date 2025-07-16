import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee' | 'user';
  avatar?: string;
  department?: string;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  updateLocation: (location: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Mock users database
  const mockUsers = {
    admin: {
      id: 'admin-1',
      name: 'System Administrator',
      email: 'admin@company.com',
      role: 'admin' as const,
      avatar: '👨‍💼'
    },
    employee: {
      id: 'emp-1',
      name: 'John Technician',
      email: 'john@company.com',
      role: 'employee' as const,
      avatar: '🔧',
      department: 'IT Support',
      location: {
        lat: 40.7128,
        lng: -74.0060,
        address: 'Building A, Floor 2'
      }
    },
    user: {
      id: 'user-1',
      name: 'Jane Customer',
      email: 'jane@company.com',
      role: 'user' as const,
      avatar: '👩‍💼'
    }
  };

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userData = mockUsers[role as keyof typeof mockUsers];
    if (userData && email === userData.email) {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const register = async (userData: any): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: 'user',
      avatar: '👤'
    };
    
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateLocation = (location: any) => {
    if (user) {
      const updatedUser = { ...user, location };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateLocation }}>
      {children}
    </AuthContext.Provider>
  );
};