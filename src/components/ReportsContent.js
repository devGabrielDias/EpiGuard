import React, { useState, useRef } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter,
  Search,
  BarChart3,
  PieChart,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Camera,
  User
} from 'lucide-react';
import { useSystem } from '../services/SystemContext';

const ReportsContent = () => {
  const { detections, cameras, generateReport, exportData } = useSystem();
  const [reportType, setReportType] = useState('violations');
  const [dateRange, setDateRange] = useState('today');
  const [selectedCamera, setSelectedCamera] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async (format) => {
    setIsGenerating(true);
    try {
      const filters = {
        type: reportType,
        dateRange,
        camera: selectedCamera,
        format
      };
      
      await generateReport(filters);
      alert(`Relatório ${format.toUpperCase()} gerado com sucesso!`);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      alert(`Erro ao gerar relatório: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const getFilteredDetections = () => {
    let filtered = [...detections];

    // Filtrar por tipo
    if (reportType === 'violations') {
      filtered = filtered.filter(d => d.type === 'violation');
    } else if (reportType === 'compliance') {
      filtered = filtered.filter(d => d.type === 'compliance');
    }

    // Filtrar por data
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (dateRange) {
      case 'today':
        filtered = filtered.filter(d => new Date(d.timestamp) >= today);
        break;
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(d => new Date(d.timestamp) >= weekAgo);
        break;
      case 'month':
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(d => new Date(d.timestamp) >= monthAgo);
        break;
    }

    // Filtrar por câmera
    if (selectedCamera !== 'all') {
      filtered = filtered.filter(d => d.cameraId === selectedCamera);
    }

    return filtered;
  };

  const filteredDetections = getFilteredDetections();
  const violationsCount = filteredDetections.filter(d => d.type === 'violation').length;
  const complianceCount = filteredDetections.filter(d => d.type === 'compliance').length;
  const totalDetections = filteredDetections.length;
  const complianceRate = totalDetections > 0 ? Math.round((complianceCount / totalDetections) * 100) : 0;

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
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-primary">Relatórios e Análises</h2>
          <p className="text-muted">Gere relatórios detalhados sobre detecções e conformidade</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-primary mb-4">Filtros de Relatório</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Tipo de Relatório</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
            >
              <option value="all">Todas as Detecções</option>
              <option value="violations">Apenas Violações</option>
              <option value="compliance">Apenas Conformidade</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">Período</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
            >
              <option value="today">Hoje</option>
              <option value="week">Última Semana</option>
              <option value="month">Último Mês</option>
              <option value="custom">Período Personalizado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">Câmera</label>
            <select
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
            >
              <option value="all">Todas as Câmeras</option>
              {cameras.map((camera) => (
                <option key={camera.id} value={camera.id}>
                  {camera.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => handleGenerateReport('pdf')}
              disabled={isGenerating}
              className="w-full bg-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>{isGenerating ? 'Gerando...' : 'Gerar PDF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Estatísticas do período */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total de Detecções"
          value={totalDetections}
          subtitle="No período selecionado"
          icon={BarChart3}
          color="blue"
        />
        <StatCard
          title="Violações"
          value={violationsCount}
          subtitle="Pessoas sem capacete"
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Conformidade"
          value={complianceCount}
          subtitle="Pessoas com capacete"
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Taxa de Conformidade"
          value={`${complianceRate}%`}
          subtitle="Meta: 95%"
          icon={TrendingUp}
          color={complianceRate >= 95 ? "green" : complianceRate >= 80 ? "yellow" : "red"}
        />
      </div>

      {/* Ações de exportação */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-primary mb-4">Exportar Dados</h3>
        
        <div className="flex space-x-4">
          <button
            onClick={() => handleGenerateReport('pdf')}
            disabled={isGenerating}
            className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <FileText className="w-5 h-5" />
            <span>Relatório PDF</span>
          </button>

          <button
            onClick={() => handleGenerateReport('excel')}
            disabled={isGenerating}
            className="bg-green text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Planilha Excel</span>
          </button>

          <button
            onClick={() => handleGenerateReport('csv')}
            disabled={isGenerating}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Download className="w-5 h-5" />
            <span>Arquivo CSV</span>
          </button>
        </div>
      </div>

      {/* Lista de detecções */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-primary">Detecções do Período</h3>
          <div className="flex items-center space-x-2 text-sm text-muted">
            <span>{filteredDetections.length} registros encontrados</span>
          </div>
        </div>

        {filteredDetections.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-primary">Data/Hora</th>
                  <th className="text-left py-3 px-4 font-medium text-primary">Câmera</th>
                  <th className="text-left py-3 px-4 font-medium text-primary">Tipo</th>
                  <th className="text-left py-3 px-4 font-medium text-primary">Confiança</th>
                  <th className="text-left py-3 px-4 font-medium text-primary">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredDetections.slice(0, 50).map((detection, index) => (
                  <tr key={detection.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-primary">
                      {new Date(detection.timestamp).toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3 px-4 text-sm text-muted">
                      <div className="flex items-center space-x-2">
                        <Camera className="w-4 h-4" />
                        <span>
                          {detection.source === 'webcam' 
                            ? `Webcam ${detection.cameraIndex || 0}` 
                            : cameras.find(c => c.id === detection.cameraId)?.name || 'Câmera Desconhecida'
                          }
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        detection.type === 'violation' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {detection.type === 'violation' ? 'Sem Capacete' : 'Com Capacete'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted">
                      {Math.round((detection.result?.detections?.[0]?.confidence || 0.85) * 100)}%
                    </td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        detection.status === 'resolved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {detection.status === 'resolved' ? 'Resolvido' : 'Pendente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredDetections.length > 50 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-muted">
                  Mostrando 50 de {filteredDetections.length} registros. 
                  Use os filtros para refinar a busca ou exporte os dados completos.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-muted mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-primary mb-2">Nenhuma detecção encontrada</h4>
            <p className="text-muted">
              Não há detecções para os filtros selecionados. 
              Tente ajustar o período ou tipo de relatório.
            </p>
          </div>
        )}
      </div>

      {/* Gráfico de tendências (placeholder) */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-primary mb-4">Tendência de Conformidade</h3>
        
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <PieChart className="w-16 h-16 text-muted mx-auto mb-4" />
            <p className="text-lg font-semibold text-primary mb-2">Gráfico de Tendências</p>
            <p className="text-muted">
              Visualização das tendências de conformidade ao longo do tempo
            </p>
            <p className="text-sm text-muted mt-2">
              Taxa atual: {complianceRate}% • Meta: 95%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsContent;

