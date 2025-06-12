import React from 'react';
import { 
  Menu, 
  Bell, 
  Search, 
  LogOut,
  Minimize2,
  Maximize2,
  X
} from 'lucide-react';
import { useAuth } from '../services/AuthContext';
import Button from './Button';

const Header = ({ activeTab, onToggleSidebar }) => {
  const { user, logout } = useAuth();

  const getPageTitle = () => {
    const titles = {
      dashboard: 'Dashboard',
      cameras: 'Gerenciamento de Câmeras',
      reports: 'Relatórios',
      users: 'Gerenciamento de Usuários',
      settings: 'Configurações'
    };
    return titles[activeTab] || 'Dashboard';
  };

  const handleMinimize = async () => {
    if (window.electronAPI) {
      await window.electronAPI.minimizeWindow();
    }
  };

  const handleMaximize = async () => {
    if (window.electronAPI) {
      await window.electronAPI.maximizeWindow();
    }
  };

  const handleClose = async () => {
    if (window.electronAPI) {
      await window.electronAPI.closeWindow();
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Lado esquerdo */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors lg:hidden"
          >
            <Menu className="w-5 h-5 text-muted" />
          </button>
          
          <div>
            <h1 className="text-xl font-semibold text-primary">{getPageTitle()}</h1>
            <p className="text-sm text-muted">
              {new Date().toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Centro - Barra de pesquisa */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Pesquisar..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green focus:border-transparent"
            />
          </div>
        </div>

        {/* Lado direito */}
        <div className="flex items-center space-x-4">
          {/* Notificações */}
          <button className="relative p-2 rounded-md hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-muted" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Informações do usuário */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-primary">{user?.fullName}</p>
              <p className="text-xs text-muted">
                {user?.role === 'admin' ? 'Administrador' : 'Técnico'}
              </p>
            </div>
            
            <div className="w-8 h-8 bg-green-light rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-green">
                {user?.fullName?.charAt(0) || 'U'}
              </span>
            </div>
          </div>

          {/* Botão de logout */}
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-muted hover:text-red-600"
          >
            <LogOut className="w-4 h-4" />
          </Button>

          {/* Controles da janela (apenas no Electron) */}
          {window.electronAPI && (
            <div className="flex items-center space-x-1 ml-4 pl-4 border-l border-gray-200">
              <button
                onClick={handleMinimize}
                className="p-1.5 rounded hover:bg-gray-100 transition-colors"
              >
                <Minimize2 className="w-4 h-4 text-muted" />
              </button>
              <button
                onClick={handleMaximize}
                className="p-1.5 rounded hover:bg-gray-100 transition-colors"
              >
                <Maximize2 className="w-4 h-4 text-muted" />
              </button>
              <button
                onClick={handleClose}
                className="p-1.5 rounded hover:bg-red-100 hover:text-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

