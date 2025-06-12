import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from './ApiService'; // Importar ApiService

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const savedUser = localStorage.getItem('epi-guard-user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Erro ao carregar usuário salvo:', error);
        localStorage.removeItem('epi-guard-user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await ApiService.client.post('/auth/login', { username, password });
      const userData = response.data.user; // Assumindo que a API retorna um objeto com 'user'
      
      setUser(userData);
      localStorage.setItem('epi-guard-user', JSON.stringify(userData));
      return { success: true };
    } catch (error) {
      console.error('Erro no login da API:', error);
      let errorMessage = 'Erro ao fazer login. Credenciais inválidas ou erro interno.';
      if (error.response && error.response.data && error.response.data.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message === 'Network Error') {
        errorMessage = 'Erro de rede: Verifique a conexão com a API.';
      }
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('epi-guard-user');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('epi-guard-user', JSON.stringify(userData));
  };

  const value = {
    user,
    login,
    logout,
    updateUser,
    loading,
    isAdmin: user?.role === 'admin',
    isTecnico: user?.role === 'tecnico'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

