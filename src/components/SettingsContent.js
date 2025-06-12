import React, { useState } from 'react';
import { 
  Settings, 
  Wifi, 
  Database, 
  Bell, 
  Shield, 
  Monitor,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Server,
  HardDrive,
  Camera,
  Volume2
} from 'lucide-react';
import { useSystem } from '../services/SystemContext';

const SettingsContent = () => {
  const { 
    settings, 
    updateSettings, 
    testApiConnection, 
    apiStatus 
  } = useSystem();

  const [localSettings, setLocalSettings] = useState({
    api: {
      baseUrl: settings?.api?.baseUrl || 'http://127.0.0.1:8000',
      timeout: settings?.api?.timeout || 30000,
      retryAttempts: settings?.api?.retryAttempts || 3
    },
    detection: {
      confidenceThreshold: settings?.detection?.confidenceThreshold || 0.5,
      autoDetection: settings?.detection?.autoDetection || false,
      detectionInterval: settings?.detection?.detectionInterval || 5000,
      saveImages: settings?.detection?.saveImages || true
    },
    notifications: {
      enabled: settings?.notifications?.enabled || true,
      soundEnabled: settings?.notifications?.soundEnabled || true,
      emailEnabled: settings?.notifications?.emailEnabled || false,
      emailAddress: settings?.notifications?.emailAddress || ''
    },
    storage: {
      maxStorageDays: settings?.storage?.maxStorageDays || 30,
      autoCleanup: settings?.storage?.autoCleanup || true,
      compressionEnabled: settings?.storage?.compressionEnabled || true,
      backupEnabled: settings?.storage?.backupEnabled || false
    },
    display: {
      theme: settings?.display?.theme || 'light',
      language: settings?.display?.language || 'pt-BR',
      autoRefresh: settings?.display?.autoRefresh || true,
      refreshInterval: settings?.display?.refreshInterval || 30000
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings(localSettings);
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert(`Erro ao salvar configurações: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const result = await testApiConnection(localSettings.api.baseUrl);
      setTestResult({
        success: true,
        message: 'Conexão estabelecida com sucesso!',
        details: result
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Falha na conexão',
        details: error.message
      });
    } finally {
      setIsTesting(false);
    }
  };

  const updateLocalSetting = (category, key, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const SettingSection = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-green-light rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-green" />
        </div>
        <h3 className="text-lg font-semibold text-primary">{title}</h3>
      </div>
      {children}
    </div>
  );

  const InputField = ({ label, type = 'text', value, onChange, placeholder, min, max, step }) => (
    <div>
      <label className="block text-sm font-medium text-primary mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
      />
    </div>
  );

  const CheckboxField = ({ label, checked, onChange, description }) => (
    <div className="flex items-start space-x-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-1 w-4 h-4 text-green border-gray-300 rounded focus:ring-green"
      />
      <div>
        <label className="text-sm font-medium text-primary">{label}</label>
        {description && (
          <p className="text-xs text-muted mt-1">{description}</p>
        )}
      </div>
    </div>
  );

  const SelectField = ({ label, value, onChange, options }) => (
    <div>
      <label className="block text-sm font-medium text-primary mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-primary">Configurações do Sistema</h2>
          <p className="text-muted">Configure parâmetros de funcionamento e integração</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isTesting ? 'animate-spin' : ''}`} />
            <span>Testar Conexão</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-green text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Salvando...' : 'Salvar'}</span>
          </button>
        </div>
      </div>

      {/* Status da API */}
      <div className={`rounded-lg p-4 ${
        apiStatus.isConnected 
          ? 'bg-green-50 border border-green-200' 
          : 'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-center space-x-2">
          {apiStatus.isConnected ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600" />
          )}
          <div>
            <p className={`text-sm font-medium ${
              apiStatus.isConnected ? 'text-green-800' : 'text-red-800'
            }`}>
              {apiStatus.isConnected ? 'API Conectada' : 'API Desconectada'}
            </p>
            <p className={`text-xs ${
              apiStatus.isConnected ? 'text-green-700' : 'text-red-700'
            }`}>
              {apiStatus.isConnected 
                ? `Modelo: ${apiStatus.status?.model_loaded ? 'Carregado' : 'Não carregado'}`
                : 'Verifique se a API FastAPI está rodando'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Resultado do teste de conexão */}
      {testResult && (
        <div className={`rounded-lg p-4 ${
          testResult.success 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            {testResult.success ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <div>
              <p className={`text-sm font-medium ${
                testResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {testResult.message}
              </p>
              <p className={`text-xs ${
                testResult.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {testResult.details}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Configurações da API */}
      <SettingSection title="Configurações da API" icon={Server}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="URL Base da API"
            value={localSettings.api.baseUrl}
            onChange={(value) => updateLocalSetting('api', 'baseUrl', value)}
            placeholder="http://localhost:8000"
          />
          <InputField
            label="Timeout (ms)"
            type="number"
            value={localSettings.api.timeout}
            onChange={(value) => updateLocalSetting('api', 'timeout', value)}
            min={1000}
            max={60000}
            step={1000}
          />
          <InputField
            label="Tentativas de Retry"
            type="number"
            value={localSettings.api.retryAttempts}
            onChange={(value) => updateLocalSetting('api', 'retryAttempts', value)}
            min={1}
            max={10}
          />
        </div>
      </SettingSection>

      {/* Configurações de Detecção */}
      <SettingSection title="Configurações de Detecção" icon={Camera}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Limite de Confiança"
              type="number"
              value={localSettings.detection.confidenceThreshold}
              onChange={(value) => updateLocalSetting('detection', 'confidenceThreshold', value)}
              min={0.1}
              max={1.0}
              step={0.1}
            />
            <InputField
              label="Intervalo de Detecção (ms)"
              type="number"
              value={localSettings.detection.detectionInterval}
              onChange={(value) => updateLocalSetting('detection', 'detectionInterval', value)}
              min={1000}
              max={60000}
              step={1000}
            />
          </div>
          
          <div className="space-y-3">
            <CheckboxField
              label="Detecção Automática"
              checked={localSettings.detection.autoDetection}
              onChange={(value) => updateLocalSetting('detection', 'autoDetection', value)}
              description="Executar detecção automaticamente em intervalos regulares"
            />
            <CheckboxField
              label="Salvar Imagens"
              checked={localSettings.detection.saveImages}
              onChange={(value) => updateLocalSetting('detection', 'saveImages', value)}
              description="Salvar imagens das detecções para evidência"
            />
          </div>
        </div>
      </SettingSection>

      {/* Configurações de Notificações */}
      <SettingSection title="Notificações" icon={Bell}>
        <div className="space-y-4">
          <div className="space-y-3">
            <CheckboxField
              label="Notificações Habilitadas"
              checked={localSettings.notifications.enabled}
              onChange={(value) => updateLocalSetting('notifications', 'enabled', value)}
              description="Receber notificações sobre violações de segurança"
            />
            <CheckboxField
              label="Som de Notificação"
              checked={localSettings.notifications.soundEnabled}
              onChange={(value) => updateLocalSetting('notifications', 'soundEnabled', value)}
              description="Reproduzir som quando uma violação for detectada"
            />
            <CheckboxField
              label="Notificações por Email"
              checked={localSettings.notifications.emailEnabled}
              onChange={(value) => updateLocalSetting('notifications', 'emailEnabled', value)}
              description="Enviar alertas por email (requer configuração SMTP)"
            />
          </div>
          
          {localSettings.notifications.emailEnabled && (
            <InputField
              label="Endereço de Email"
              type="email"
              value={localSettings.notifications.emailAddress}
              onChange={(value) => updateLocalSetting('notifications', 'emailAddress', value)}
              placeholder="admin@empresa.com"
            />
          )}
        </div>
      </SettingSection>

      {/* Configurações de Armazenamento */}
      <SettingSection title="Armazenamento" icon={HardDrive}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Dias de Retenção"
              type="number"
              value={localSettings.storage.maxStorageDays}
              onChange={(value) => updateLocalSetting('storage', 'maxStorageDays', value)}
              min={1}
              max={365}
            />
          </div>
          
          <div className="space-y-3">
            <CheckboxField
              label="Limpeza Automática"
              checked={localSettings.storage.autoCleanup}
              onChange={(value) => updateLocalSetting('storage', 'autoCleanup', value)}
              description="Remover automaticamente dados antigos após o período de retenção"
            />
            <CheckboxField
              label="Compressão de Imagens"
              checked={localSettings.storage.compressionEnabled}
              onChange={(value) => updateLocalSetting('storage', 'compressionEnabled', value)}
              description="Comprimir imagens para economizar espaço em disco"
            />
            <CheckboxField
              label="Backup Automático"
              checked={localSettings.storage.backupEnabled}
              onChange={(value) => updateLocalSetting('storage', 'backupEnabled', value)}
              description="Criar backups automáticos dos dados importantes"
            />
          </div>
        </div>
      </SettingSection>

      {/* Configurações de Interface */}
      <SettingSection title="Interface" icon={Monitor}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Tema"
              value={localSettings.display.theme}
              onChange={(value) => updateLocalSetting('display', 'theme', value)}
              options={[
                { value: 'light', label: 'Claro' },
                { value: 'dark', label: 'Escuro' },
                { value: 'auto', label: 'Automático' }
              ]}
            />
            <SelectField
              label="Idioma"
              value={localSettings.display.language}
              onChange={(value) => updateLocalSetting('display', 'language', value)}
              options={[
                { value: 'pt-BR', label: 'Português (Brasil)' },
                { value: 'en-US', label: 'English (US)' },
                { value: 'es-ES', label: 'Español' }
              ]}
            />
            <InputField
              label="Intervalo de Atualização (ms)"
              type="number"
              value={localSettings.display.refreshInterval}
              onChange={(value) => updateLocalSetting('display', 'refreshInterval', value)}
              min={5000}
              max={300000}
              step={5000}
            />
          </div>
          
          <CheckboxField
            label="Atualização Automática"
            checked={localSettings.display.autoRefresh}
            onChange={(value) => updateLocalSetting('display', 'autoRefresh', value)}
            description="Atualizar dados automaticamente em intervalos regulares"
          />
        </div>
      </SettingSection>
    </div>
  );
};

export default SettingsContent;

