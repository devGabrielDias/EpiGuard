import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Plus, 
  Play, 
  Pause, 
  Settings, 
  Trash2, 
  Eye,
  EyeOff,
  Wifi,
  WifiOff,
  Video,
  VideoOff,
  Upload,
  Download
} from 'lucide-react';
import { useSystem } from '../services/SystemContext';

const CamerasContent = () => {
  const { 
    cameras, 
    addCamera, 
    removeCamera, 
    updateCameraStatus, 
    toggleCameraRecording,
    detectFromWebcam,
    detectHelmet,
    getAvailableCameras,
    apiStatus
  } = useSystem();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionResult, setDetectionResult] = useState(null);
  const fileInputRef = useRef(null);

  const [newCamera, setNewCamera] = useState({
    name: '',
    location: '',
    rtspUrl: '',
    type: 'rtsp'
  });

  const handleAddCamera = async () => {
    if (!newCamera.name.trim()) return;

    const cameraData = {
      ...newCamera,
      status: 'offline',
      isRecording: false,
      detectionCount: 0
    };

    addCamera(cameraData);
    setNewCamera({ name: '', location: '', rtspUrl: '', type: 'rtsp' });
    setShowAddModal(false);
  };

  const handleDetectFromWebcam = async (cameraIndex = 0) => {
    if (!apiStatus.isConnected) {
      alert('API não está conectada. Verifique se a API FastAPI está rodando.');
      return;
    }

    setIsDetecting(true);
    setDetectionResult(null);

    try {
      const result = await detectFromWebcam(cameraIndex);
      setDetectionResult(result);
      
      // Simular atualização da câmera
      const webcamCamera = cameras.find(c => c.type === 'webcam' && c.deviceIndex === cameraIndex);
      if (webcamCamera) {
        updateCameraStatus(webcamCamera.id, 'online');
      }
    } catch (error) {
      console.error('Erro na detecção:', error);
      alert(`Erro na detecção: ${error.message}`);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!apiStatus.isConnected) {
      alert('API não está conectada. Verifique se a API FastAPI está rodando.');
      return;
    }

    setIsDetecting(true);
    setDetectionResult(null);

    try {
      const result = await detectHelmet(file);
      setDetectionResult(result);
    } catch (error) {
      console.error('Erro na detecção:', error);
      alert(`Erro na detecção: ${error.message}`);
    } finally {
      setIsDetecting(false);
    }
  };

  const handleDiscoverCameras = async () => {
    try {
      const devices = await getAvailableCameras();
      
      // Adicionar webcams descobertas automaticamente
      devices.forEach((device, index) => {
        const existingCamera = cameras.find(c => c.deviceId === device.deviceId);
        if (!existingCamera) {
          addCamera({
            name: device.label || `Webcam ${index + 1}`,
            location: 'Local',
            type: 'webcam',
            deviceId: device.deviceId,
            deviceIndex: index,
            status: 'offline'
          });
        }
      });

      alert(`${devices.length} câmeras descobertas e adicionadas.`);
    } catch (error) {
      console.error('Erro ao descobrir câmeras:', error);
      alert(`Erro ao descobrir câmeras: ${error.message}`);
    }
  };

  const CameraCard = ({ camera, index }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            camera.status === 'online' ? 'bg-green' : 'bg-red-500'
          }`}></div>
          <div>
            <h3 className="font-semibold text-primary">{camera.name}</h3>
            <p className="text-sm text-muted">{camera.location}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => removeCamera(camera.id)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview da câmera */}
      <div className="bg-gray-100 rounded-lg h-48 mb-4 flex items-center justify-center">
        {camera.status === 'online' ? (
          <div className="text-center">
            <Video className="w-12 h-12 text-green mx-auto mb-2" />
            <p className="text-sm text-muted">Stream ativo</p>
          </div>
        ) : (
          <div className="text-center">
            <VideoOff className="w-12 h-12 text-muted mx-auto mb-2" />
            <p className="text-sm text-muted">Câmera offline</p>
          </div>
        )}
      </div>

      {/* Informações da câmera */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Status:</span>
          <span className={`font-medium ${
            camera.status === 'online' ? 'text-green' : 'text-red-500'
          }`}>
            {camera.status === 'online' ? 'Online' : 'Offline'}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Detecções hoje:</span>
          <span className="font-medium text-primary">{camera.detectionCount || 0}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Última detecção:</span>
          <span className="text-muted">
            {camera.lastDetection 
              ? new Date(camera.lastDetection).toLocaleString('pt-BR')
              : 'Nunca'
            }
          </span>
        </div>
      </div>

      {/* Controles */}
      <div className="flex space-x-2">
        {camera.type === 'webcam' ? (
          <button
            onClick={() => handleDetectFromWebcam(camera.deviceIndex || 0)}
            disabled={isDetecting || !apiStatus.isConnected}
            className="flex-1 bg-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>{isDetecting ? 'Detectando...' : 'Detectar'}</span>
          </button>
        ) : (
          <button
            onClick={() => updateCameraStatus(camera.id, camera.status === 'online' ? 'offline' : 'online')}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
              camera.status === 'online'
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-green text-white hover:bg-green-600'
            }`}
          >
            {camera.status === 'online' ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Parar</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Iniciar</span>
              </>
            )}
          </button>
        )}
        
        <button
          onClick={() => toggleCameraRecording(camera.id)}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
            camera.isRecording
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>{camera.isRecording ? 'Gravando' : 'Gravar'}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-primary">Gerenciamento de Câmeras</h2>
          <p className="text-muted">Configure e monitore suas câmeras de segurança</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleDiscoverCameras}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
          >
            <Camera className="w-4 h-4" />
            <span>Descobrir Câmeras</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Câmera</span>
          </button>
        </div>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-light rounded-lg flex items-center justify-center">
              <Camera className="w-5 h-5 text-green" />
            </div>
            <div>
              <p className="text-lg font-bold text-primary">{cameras.length}</p>
              <p className="text-sm text-muted">Total de Câmeras</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-light rounded-lg flex items-center justify-center">
              <Wifi className="w-5 h-5 text-green" />
            </div>
            <div>
              <p className="text-lg font-bold text-primary">
                {cameras.filter(c => c.status === 'online').length}
              </p>
              <p className="text-sm text-muted">Online</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <WifiOff className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-primary">
                {cameras.filter(c => c.status === 'offline').length}
              </p>
              <p className="text-sm text-muted">Offline</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-primary">
                {cameras.filter(c => c.isRecording).length}
              </p>
              <p className="text-sm text-muted">Gravando</p>
            </div>
          </div>
        </div>
      </div>

      {/* Teste de detecção */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-primary mb-4">Teste de Detecção</h3>
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isDetecting || !apiStatus.isConnected}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Upload className="w-4 h-4" />
            <span>Upload de Imagem</span>
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          <button
            onClick={() => handleDetectFromWebcam(0)}
            disabled={isDetecting || !apiStatus.isConnected}
            className="bg-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Camera className="w-4 h-4" />
            <span>Capturar da Webcam</span>
          </button>
        </div>

        {!apiStatus.isConnected && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-yellow-800">
              API não está conectada. Inicie a API FastAPI para usar a detecção.
            </p>
          </div>
        )}

        {detectionResult && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-primary mb-2">Resultado da Detecção:</h4>
            <pre className="text-sm text-gray-700 overflow-auto">
              {JSON.stringify(detectionResult, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Grid de câmeras */}
      {cameras.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cameras.map((camera, index) => (
            <CameraCard key={camera.id} camera={camera} index={index} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
          <Camera className="w-16 h-16 text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-primary mb-2">Nenhuma câmera configurada</h3>
          <p className="text-muted mb-6">
            Adicione câmeras para começar o monitoramento de segurança
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-green text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            Adicionar Primeira Câmera
          </button>
        </div>
      )}

      {/* Modal de adicionar câmera */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-primary mb-4">Adicionar Nova Câmera</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Nome</label>
                <input
                  type="text"
                  value={newCamera.name}
                  onChange={(e) => setNewCamera({...newCamera, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
                  placeholder="Ex: Entrada Principal"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Localização</label>
                <input
                  type="text"
                  value={newCamera.location}
                  onChange={(e) => setNewCamera({...newCamera, location: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
                  placeholder="Ex: Portaria"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-primary mb-1">Tipo</label>
                <select
                  value={newCamera.type}
                  onChange={(e) => setNewCamera({...newCamera, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
                >
                  <option value="rtsp">RTSP</option>
                  <option value="webcam">Webcam</option>
                  <option value="ip">IP Camera</option>
                </select>
              </div>
              
              {newCamera.type === 'rtsp' && (
                <div>
                  <label className="block text-sm font-medium text-primary mb-1">URL RTSP</label>
                  <input
                    type="text"
                    value={newCamera.rtspUrl}
                    onChange={(e) => setNewCamera({...newCamera, rtspUrl: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
                    placeholder="rtsp://usuario:senha@ip:porta/stream"
                  />
                </div>
              )}
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddCamera}
                className="flex-1 bg-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CamerasContent;

