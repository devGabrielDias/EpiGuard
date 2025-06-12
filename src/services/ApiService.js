import axios from 'axios';

class ApiService {
  constructor() {
    this.baseURL = 'http://127.0.0.1:8000/api/v1';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Interceptor para adicionar token de autenticação se necessário
    this.client.interceptors.request.use(
      (config) => {
        // Adicionar token de autenticação aqui se necessário
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para tratar respostas
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  // Verificar saúde da API
  async checkHealth() {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao verificar saúde da API: ${error.message}`);
    }
  }

  // Verificar status do sistema
  async getStatus() {
    try {
      const response = await this.client.get('/status');
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao obter status do sistema: ${error.message}`);
    }
  }

  // Detectar capacetes em uma imagem
  async detectHelmet(imageFile) {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await this.client.post('/detect', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(`Erro na detecção: ${error.message}`);
    }
  }

  // Detectar capacetes via base64
  async detectHelmetBase64(base64Image) {
    try {
      const response = await this.client.post('/detect', {
        image_base64: base64Image
      });

      return response.data;
    } catch (error) {
      throw new Error(`Erro na detecção via base64: ${error.message}`);
    }
  }

  // Testar detecção
  async testDetection() {
    try {
      const response = await this.client.get('/detect/test');
      return response.data;
    } catch (error) {
      throw new Error(`Erro no teste de detecção: ${error.message}`);
    }
  }

  // Capturar frame da webcam e detectar
  async detectFromWebcam(cameraIndex = 0) {
    try {
      // Esta função será implementada para capturar da webcam
      // e enviar para a API
      const canvas = document.createElement('canvas');
      const video = document.createElement('video');
      
      // Configurar stream da webcam
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: cameraIndex }
      });
      
      video.srcObject = stream;
      video.play();

      return new Promise((resolve, reject) => {
        video.onloadedmetadata = () => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0);
          
          // Converter para blob
          canvas.toBlob(async (blob) => {
            try {
              const result = await this.detectHelmet(blob);
              
              // Parar stream
              stream.getTracks().forEach(track => track.stop());
              
              resolve(result);
            } catch (error) {
              reject(error);
            }
          }, 'image/jpeg', 0.8);
        };
      });
    } catch (error) {
      throw new Error(`Erro ao capturar da webcam: ${error.message}`);
    }
  }

  // Obter lista de câmeras disponíveis
  async getAvailableCameras() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter(device => device.kind === 'videoinput');
    } catch (error) {
      throw new Error(`Erro ao obter câmeras: ${error.message}`);
    }
  }

  // Verificar se a API está acessível
  async isApiAvailable() {
    try {
      await this.checkHealth();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Obter configurações da API
  getApiConfig() {
    return {
      baseURL: this.baseURL,
      timeout: this.client.defaults.timeout
    };
  }

  // Atualizar URL base da API
  updateBaseURL(newBaseURL) {
    this.baseURL = newBaseURL;
    this.client.defaults.baseURL = newBaseURL;
  }
}

// Instância singleton
const apiService = new ApiService();

export default apiService;

