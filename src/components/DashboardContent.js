import React from 'react';
import { 
  Shield, 
  Camera, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Activity,
  Users,
  Clock,
  Wifi,
  WifiOff
} from 'lucide-react';
import { useSystem } from '../services/SystemContext';

const DashboardContent = () => {
  const { systemStats, apiStatus, detections, cameras } = useSystem();

  const recentDetections = detections.slice(0, 5).map(detection => ({
    id: detection.id,
    camera: detection.source === 'webcam' ? `Webcam ${detection.cameraIndex}` : 'Câmera Desconhecida',
    type: detection.type === 'violation' ? 'sem_capacete' : 'com_capacete',
    confidence: detection.result?.detections?.[0]?.confidence || 0.85,
    timestamp: new Date(detection.timestamp).toLocaleString('pt-BR'),
    status: detection.type === 'violation' ? 'pending' : 'resolved'
  }));

  const StatCard = ({ title, value, subtitle, icon: Icon, color = 'green' }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted mb-1">{title}</p>
          <p className="text-2xl font-bold text-primary">{value}</p>
          {subtitle && (
            <p className="text-sm text-muted mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          color === 'green' ? 'bg-green-light' : 
          color === 'blue' ? 'bg-blue-100' :
          color === 'yellow' ? 'bg-yellow-100' :
          color === 'red' ? 'bg-red-100' : 'bg-gray-100'
        }`}>
          <Icon className={`w-6 h-6 ${
            color === 'green' ? 'text-green' : 
            color === 'blue' ? 'text-blue-600' :
            color === 'yellow' ? 'text-yellow-600' :
            color === 'red' ? 'text-red-600' : 'text-gray-600'
          }`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Status da API */}
      {!apiStatus.isConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <WifiOff className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-800">API Desconectada</p>
              <p className="text-xs text-yellow-700">
                Não foi possível conectar com a API FastAPI. Verifique se está rodando em http://127.0.0.1:8000
              </p>
            </div>
          </div>
        </div>
      )}

      {apiStatus.isConnected && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Wifi className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">API Conectada</p>
              <p className="text-xs text-green-700">
                Sistema funcionando normalmente. Modelo: {apiStatus.status?.model_loaded ? 'Carregado' : 'Não carregado'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Cabeçalho com resumo */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-primary">Visão Geral do Sistema</h2>
            <p className="text-muted">Monitoramento em tempo real da segurança</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted">
            <Clock className="w-4 h-4" />
            <span>Última atualização: {systemStats.lastUpdate}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Câmeras Ativas"
            value={`${systemStats.activeCameras}/${systemStats.totalCameras}`}
            subtitle={systemStats.totalCameras > 0 ? `${Math.round((systemStats.activeCameras / systemStats.totalCameras) * 100)}% operacionais` : 'Nenhuma câmera'}
            icon={Camera}
            color="green"
          />
          <StatCard
            title="Detecções Hoje"
            value={systemStats.totalDetections}
            subtitle="Tempo real"
            icon={Activity}
            color="blue"
          />
          <StatCard
            title="Violações Hoje"
            value={systemStats.violationsToday}
            subtitle={systemStats.violationsToday > 0 ? "Requer atenção" : "Tudo ok"}
            icon={AlertTriangle}
            color={systemStats.violationsToday > 0 ? "yellow" : "green"}
          />
          <StatCard
            title="Taxa de Conformidade"
            value={`${systemStats.complianceRate}%`}
            subtitle="Meta: 95%"
            icon={Shield}
            color="green"
          />
        </div>
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Atividade recente */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-primary">Detecções Recentes</h3>
            <button className="text-sm text-green hover:text-green-600 font-medium">
              Ver todas
            </button>
          </div>
          
          {recentDetections.length > 0 ? (
            <div className="space-y-3">
              {recentDetections.map((detection) => (
                <div key={detection.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      detection.type === 'sem_capacete' ? 'bg-red-500' : 'bg-green'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-primary">{detection.camera}</p>
                      <p className="text-xs text-muted">
                        {detection.type === 'sem_capacete' ? 'Sem capacete' : 'Com capacete'} • 
                        Confiança: {Math.round(detection.confidence * 100)}%
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted">{detection.timestamp}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      detection.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {detection.status === 'pending' ? 'Pendente' : 'Resolvido'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-muted mx-auto mb-2" />
              <p className="text-muted">Nenhuma detecção recente</p>
              <p className="text-sm text-muted">As detecções aparecerão aqui em tempo real</p>
            </div>
          )}
        </div>

        {/* Status das câmeras */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-primary mb-4">Status das Câmeras</h3>
          
          {cameras.length > 0 ? (
            <div className="space-y-3">
              {cameras.slice(0, 5).map((camera, index) => (
                <div key={camera.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      camera.status === 'online' ? 'bg-green' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <p className="text-sm font-medium text-primary">
                        {camera.label || camera.name || `Câmera ${index + 1}`}
                      </p>
                      <p className="text-xs text-muted">
                        {camera.status === 'online' ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-primary">{camera.detectionCount || 0}</p>
                    <p className="text-xs text-muted">detecções</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Camera className="w-12 h-12 text-muted mx-auto mb-2" />
              <p className="text-muted">Nenhuma câmera configurada</p>
              <p className="text-sm text-muted">Adicione câmeras na aba Câmeras</p>
            </div>
          )}
        </div>
      </div>

      {/* Gráfico de tendências */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary">Tendência de Conformidade</h3>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-green" />
            <span className="text-sm text-green font-medium">
              {systemStats.complianceRate}% hoje
            </span>
          </div>
        </div>
        
        {/* Placeholder para gráfico */}
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <Activity className="w-12 h-12 text-muted mx-auto mb-2" />
            <p className="text-muted">Gráfico de tendências</p>
            <p className="text-sm text-muted">Dados em tempo real da API integrada</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;

