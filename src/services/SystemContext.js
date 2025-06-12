import React, { createContext, useContext, useState, useEffect } from 'react';
import ApiService from './ApiService';

const SystemContext = createContext();

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};

export const SystemProvider = ({ children }) => {
  console.log("SystemProvider sendo renderizado.");
  // Estados do sistema
  const [apiStatus, setApiStatus] = useState({
    isConnected: false,
    status: null,
    lastCheck: null
  });

  const [systemStats, setSystemStats] = useState({
    totalCameras: 0,
    activeCameras: 0,
    totalDetections: 0,
    violationsToday: 0,
    complianceRate: 0,
    lastUpdate: new Date().toLocaleTimeString('pt-BR')
  });

  const [cameras, setCameras] = useState([]);
  const [detections, setDetections] = useState([]);
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Administrador',
      email: 'admin@epi-guard.com',
      role: 'admin',
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      loginCount: 1,
      department: 'TI'
    },
    {
      id: 2,
      name: 'Técnico de Segurança',
      email: 'tecnico@epi-guard.com',
      role: 'tecnico',
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null,
      loginCount: 0,
      department: 'Segurança do Trabalho'
    }
  ]);

  const [settings, setSettings] = useState({
    api: {
      baseUrl: 'http://127.0.0.1:8000',
      timeout: 30000,
      retryAttempts: 3
    },
    detection: {
      confidenceThreshold: 0.5,
      autoDetection: false,
      detectionInterval: 5000,
      saveImages: true
    },
    notifications: {
      enabled: true,
      soundEnabled: true,
      emailEnabled: false,
      emailAddress: ''
    },
    storage: {
      maxStorageDays: 30,
      autoCleanup: true,
      compressionEnabled: true,
      backupEnabled: false
    },
    display: {
      theme: 'light',
      language: 'pt-BR',
      autoRefresh: true,
      refreshInterval: 30000
    }
  });

  // Verificar status da API periodicamente
  useEffect(() => {
    console.log("useEffect em SystemContext.js ativado.");
    const checkApiStatus = async () => {
      console.log("checkApiStatus executando...");
      try {
        const status = await ApiService.checkHealth();
        setApiStatus({
          isConnected: true,
          status,
          lastCheck: new Date()
        });
      } catch (error) {
        console.error("Erro ao verificar status da API:", error);
        setApiStatus({
          isConnected: false,
          status: null,
          lastCheck: new Date()
        });
      }
    };

    // Verificar imediatamente
    checkApiStatus();

    // Verificar a cada 30 segundos
    const interval = setInterval(checkApiStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  // Atualizar estatísticas do sistema
  useEffect(() => {
    const updateStats = () => {
      const activeCameras = cameras.filter(c => c.status === 'online').length;
      const totalDetections = detections.length;
      const violationsToday = detections.filter(d => {
        const today = new Date().toDateString();
        const detectionDate = new Date(d.timestamp).toDateString();
        return detectionDate === today && d.type === 'violation';
      }).length;
      
      const complianceDetections = detections.filter(d => {
        const today = new Date().toDateString();
        const detectionDate = new Date(d.timestamp).toDateString();
        return detectionDate === today && d.type === 'compliance';
      }).length;

      const todayTotal = violationsToday + complianceDetections;
      const complianceRate = todayTotal > 0 ? Math.round((complianceDetections / todayTotal) * 100) : 0;

      setSystemStats({
        totalCameras: cameras.length,
        activeCameras,
        totalDetections,
        violationsToday,
        complianceRate,
        lastUpdate: new Date().toLocaleTimeString('pt-BR')
      });
    };

    updateStats();
  }, [cameras, detections]);

  // Funções de gerenciamento de câmeras
  const addCamera = (cameraData) => {
    const newCamera = {
      ...cameraData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      detectionCount: 0,
      lastDetection: null
    };
    setCameras(prev => [...prev, newCamera]);
  };

  const removeCamera = (cameraId) => {
    setCameras(prev => prev.filter(c => c.id !== cameraId));
  };

  const updateCameraStatus = (cameraId, status) => {
    setCameras(prev => prev.map(c => 
      c.id === cameraId ? { ...c, status } : c
    ));
  };

  const toggleCameraRecording = (cameraId) => {
    setCameras(prev => prev.map(c => 
      c.id === cameraId ? { ...c, isRecording: !c.isRecording } : c
    ));
  };

  // Funções de detecção
  const detectFromWebcam = async (cameraIndex = 0) => {
    try {
      const result = await ApiService.detectFromWebcam(cameraIndex);
      
      // Adicionar detecção ao histórico
      const detection = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        source: 'webcam',
        cameraIndex,
        result,
        type: result.detections && result.detections.length > 0 ? 'violation' : 'compliance',
        status: 'pending'
      };
      
      setDetections(prev => [detection, ...prev]);
      
      return result;
    } catch (error) {
      console.error('Erro na detecção da webcam:', error);
      throw error;
    }
  };

  const detectHelmet = async (imageFile) => {
    try {
      const result = await ApiService.detectHelmet(imageFile);
      
      // Adicionar detecção ao histórico
      const detection = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        source: 'upload',
        result,
        type: result.detections && result.detections.length > 0 ? 'violation' : 'compliance',
        status: 'pending'
      };
      
      setDetections(prev => [detection, ...prev]);
      
      return result;
    } catch (error) {
      console.error('Erro na detecção de imagem:', error);
      throw error;
    }
  };

  const getAvailableCameras = async () => {
    try {
      // Simular descoberta de câmeras
      const devices = [
        { deviceId: 'default', label: 'Câmera Padrão' },
        { deviceId: 'webcam1', label: 'Webcam USB' }
      ];
      return devices;
    } catch (error) {
      console.error('Erro ao descobrir câmeras:', error);
      throw error;
    }
  };

  // Funções de usuários
  const addUser = (userData) => {
    const newUser = {
      ...userData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      lastLogin: null,
      loginCount: 0
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (userData) => {
    setUsers(prev => prev.map(u => 
      u.id === userData.id ? { ...u, ...userData } : u
    ));
  };

  const removeUser = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const toggleUserStatus = (userId) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, isActive: !u.isActive } : u
    ));
  };

  // Funções de configurações
  const updateSettings = async (newSettings) => {
    setSettings(newSettings);
    // Aqui você poderia salvar no localStorage ou enviar para uma API
    localStorage.setItem('epi-guard-settings', JSON.stringify(newSettings));
  };

  const testApiConnection = async (baseUrl) => {
    try {
      const result = await ApiService.testConnection(baseUrl);
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Funções de relatórios
  const generateReport = async (filters) => {
    try {
      // Simular geração de relatório
      console.log('Gerando relatório com filtros:', filters);
      
      // Aqui você implementaria a lógica real de geração de relatório
      // Por exemplo, usando uma biblioteca como jsPDF ou exportando para Excel
      
      return { success: true, message: 'Relatório gerado com sucesso' };
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      throw error;
    }
  };

  const exportData = async (format, data) => {
    try {
      // Simular exportação de dados
      console.log(`Exportando dados em formato ${format}:`, data);
      
      return { success: true, message: `Dados exportados em ${format}` };
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      throw error;
    }
  };

  const value = {
    // Estados
    apiStatus,
    systemStats,
    cameras,
    detections,
    users,
    settings,
    
    // Funções de câmeras
    addCamera,
    removeCamera,
    updateCameraStatus,
    toggleCameraRecording,
    
    // Funções de detecção
    detectFromWebcam,
    detectHelmet,
    getAvailableCameras,
    
    // Funções de usuários
    addUser,
    updateUser,
    removeUser,
    toggleUserStatus,
    
    // Funções de configurações
    updateSettings,
    testApiConnection,
    
    // Funções de relatórios
    generateReport,
    exportData
  };

  return (
    <SystemContext.Provider value={value}>
      {children}
    </SystemContext.Provider>
  );
};

