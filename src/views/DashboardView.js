import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DashboardContent from '../components/DashboardContent';
import CamerasContent from '../components/CamerasContent';
import ReportsContent from '../components/ReportsContent';
import UsersContent from '../components/UsersContent';
import SettingsContent from '../components/SettingsContent';
import { useAuth } from '../services/AuthContext';

const DashboardView = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'cameras':
        return <CamerasContent />;
      case 'reports':
        return <ReportsContent />;
      case 'users':
        return user?.role === 'admin' ? <UsersContent /> : <DashboardContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="h-screen w-full flex bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          activeTab={activeTab}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        {/* Conteúdo da página */}
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardView;

