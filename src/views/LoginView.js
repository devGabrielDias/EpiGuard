import React, { useState } from 'react';
import { Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../services/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';

const LoginView = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpar erro quando usuário começar a digitar
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log("Chamando a função de login com:", formData.username);
      const result = await login(formData.username, formData.password);
      
      if (!result.success) {
        setError(result.error);
      }
    } catch (error) {
      setError('Erro interno. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const fillAdminCredentials = () => {
    setFormData({
      username: 'admin',
      password: 'admin123'
    });
    setError('');
  };

  const fillTecnicoCredentials = () => {
    setFormData({
      username: 'tecnico',
      password: 'tecnico123'
    });
    setError('');
  };

  return (
    <div className="h-screen w-full flex">
      {/* Lado esquerdo - Branding */}
      <div className="flex-1 bg-green flex flex-col items-center justify-center p-8 relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border-4 border-white rounded-full"></div>
          <div className="absolute bottom-32 right-16 w-24 h-24 border-4 border-white rounded-full"></div>
          <div className="absolute top-1/2 right-1/3 w-16 h-16 border-4 border-white rounded-full"></div>
        </div>
        
        <div className="relative z-10 text-center text-white">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center">
                <Shield className="w-12 h-12 text-green" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">EPI GUARD</h1>
            <div className="w-24 h-1 bg-white mx-auto rounded-full"></div>
          </div>
          
          {/* Slogan */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Veja além.</h2>
            <h3 className="text-xl font-medium">Proteja com precisão.</h3>
          </div>
          
          {/* Descrição */}
          <p className="text-lg opacity-90 max-w-md mx-auto leading-relaxed">
            Sistema inteligente de detecção automática de equipamentos de proteção individual 
            em ambientes de trabalho.
          </p>
        </div>
      </div>

      {/* Lado direito - Formulário de login */}
      <div className="flex-1 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary mb-2">Bem-vindo</h2>
            <p className="text-secondary">Faça login para acessar o sistema</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo de usuário */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-primary mb-2">
                Usuário
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Digite seu usuário"
                disabled={loading}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-green focus:border-green-500"
              />
            </div>

            {/* Campo de senha */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-primary mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Digite sua senha"
                  disabled={loading}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-green focus:border-green-500 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted hover:text-secondary transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mensagem de erro */}
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Botão de login */}
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed bg-green hover:bg-green-600 text-white focus:ring-green shadow-md hover:shadow-lg px-6 py-3 text-lg"
              disabled={loading}
              onClick={() => console.log("Botão Entrar clicado!")}
            >
              {loading && (
                <span className="w-4 h-4 mr-2 animate-spin">🔄</span>
              )}
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Credenciais de teste */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-muted mb-3 text-center">Credenciais de teste:</p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={fillAdminCredentials}
                className="w-full text-left p-2 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                <span className="font-medium">Admin:</span> admin / admin123
              </button>
              <button
                type="button"
                onClick={fillTecnicoCredentials}
                className="w-full text-left p-2 text-sm bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                <span className="font-medium">Técnico:</span> tecnico / tecnico123
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;

