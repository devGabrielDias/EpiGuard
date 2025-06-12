const { contextBridge, ipcRenderer } = require('electron');

// Expor APIs protegidas para o renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Informações do sistema
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPlatform: () => ipcRenderer.invoke('get-platform'),
  
  // Controles da janela
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  maximizeWindow: () => ipcRenderer.invoke('maximize-window'),
  closeWindow: () => ipcRenderer.invoke('close-window'),
  isMaximized: () => ipcRenderer.invoke('is-maximized'),
  
  // Eventos da janela
  onWindowStateChange: (callback) => {
    ipcRenderer.on('window-state-changed', callback);
  },
  
  // Remover listeners
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
});

// Expor APIs para comunicação com a API FastAPI
contextBridge.exposeInMainWorld('apiClient', {
  // Métodos HTTP básicos
  get: async (url, config) => {
    // Implementar chamadas HTTP via fetch ou axios
    return fetch(url, { method: 'GET', ...config });
  },
  
  post: async (url, data, config) => {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers
      },
      body: JSON.stringify(data),
      ...config
    });
  },
  
  // Upload de arquivos
  uploadFile: async (url, file, config) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return fetch(url, {
      method: 'POST',
      body: formData,
      ...config
    });
  }
});

// Expor utilitários para o sistema
contextBridge.exposeInMainWorld('systemUtils', {
  // Utilitários de data
  formatDate: (date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  },
  
  formatDateTime: (date) => {
    return new Date(date).toLocaleString('pt-BR');
  },
  
  // Utilitários de arquivo
  downloadFile: (data, filename, type = 'application/octet-stream') => {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
});

