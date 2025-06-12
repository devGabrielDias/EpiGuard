import React from 'react';
import { 
  LayoutDashboard, 
  Camera, 
  FileText, 
  Users, 
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../services/AuthContext';

const Sidebar = ({ activeTab, onTabChange, collapsed, onToggleCollapse }) => {
  const { user } = useAuth();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      available: true
    },
    {
      id: 'cameras',
      label: 'Câmeras',
      icon: Camera,
      available: true
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: FileText,
      available: true
    },
    {
      id: 'users',
      label: 'Usuários',
      icon: Users,
      available: user?.role === 'admin'
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: Settings,
      available: true
    }
  ];

  const availableItems = menuItems.filter(item => item.available);

  return (
    <div className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      {/* Header da sidebar */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-primary">EPI GUARD</h1>
              </div>
            </div>
          )}
          
          {collapsed && (
            <div className="w-8 h-8 bg-green rounded-lg flex items-center justify-center mx-auto">
              <Shield className="w-5 h-5 text-white" />
            </div>
          )}
          
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4 text-muted" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-muted" />
            )}
          </button>
        </div>
      </div>

      {/* Menu de navegação */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {availableItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-green text-white shadow-md'
                      : 'text-secondary hover:bg-gray-100 hover:text-primary'
                  }`}
                  title={collapsed ? item.label : ''}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Informações do usuário */}
      <div className="p-4 border-t border-gray-200">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'}`}>
          <div className="w-8 h-8 bg-green-light rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-green">
              {user?.fullName?.charAt(0) || 'U'}
            </span>
          </div>
          
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary truncate">
                {user?.fullName || 'Usuário'}
              </p>
              <p className="text-xs text-muted truncate">
                {user?.role === 'admin' ? 'Administrador' : 'Técnico'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

