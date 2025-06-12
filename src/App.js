import React, { useState, useEffect } from 'react';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import { AuthProvider, useAuth } from './services/AuthContext';
import { SystemProvider } from './services/SystemContext';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-green rounded-full mx-auto mb-4"></div>
            <p className="text-lg font-medium text-primary">Carregando EPI Guard...</p>
          </div>
        </div>
      </div>
    );
  }

  return user ? (
    <SystemProvider>
      <DashboardView />
    </SystemProvider>
  ) : (
    <LoginView />
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="h-screen w-full overflow-hidden">
        <AppContent />
      </div>
    </AuthProvider>
  );
}

export default App;

