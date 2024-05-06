import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  currentUser: User | null;
  login: (user: User) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const login = (user: User) => {
    setCurrentUser(user);
  };

  return (
    <AuthContext.Provider value={{currentUser, login}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};