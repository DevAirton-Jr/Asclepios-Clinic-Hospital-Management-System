import React, { createContext, useState, useContext, useEffect } from 'react';

// Contexto de autenticação: guarda usuário logado e utilitários
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carrega sessão do usuário a partir do localStorage, se existir
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // Simulação de login (substituir por chamada à API futuramente)
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };
  
  const updateUserProfile = (profileData) => {
    // Atualiza dados do perfil (ex.: avatar) e persiste na sessão
    const updatedUser = { ...user, ...profileData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const logout = () => {
    // Limpa sessão e estado de autenticação
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};