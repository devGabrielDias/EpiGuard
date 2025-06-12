# Manual de Instalação - EPI Guard

## Sumário

1. [Pré-requisitos](#pré-requisitos)
2. [Instalação da API FastAPI](#instalação-da-api-fastapi)
3. [Instalação da Interface Desktop](#instalação-da-interface-desktop)
4. [Configuração Inicial](#configuração-inicial)
5. [Primeiro Uso](#primeiro-uso)
6. [Solução de Problemas](#solução-de-problemas)

## Pré-requisitos

### Sistema Operacional
- **Windows**: Windows 10 ou superior
- **Linux**: Ubuntu 18.04+ ou distribuições equivalentes

### Software Necessário
- **Python 3.8+**: Para executar a API FastAPI
- **Node.js 16+**: Para desenvolvimento (opcional)
- **Câmeras IP**: Com suporte RTSP (opcional)

### Hardware Mínimo
- **RAM**: 4 GB
- **Processador**: Intel i3 ou equivalente
- **Armazenamento**: 2 GB livres
- **Rede**: Conexão com internet para instalação

## Instalação da API FastAPI

### Passo 1: Preparar o Ambiente da API

1. **Extrair os arquivos da API**:
   ```bash
   # Extrair o arquivo helmet_detection_system.zip
   unzip helmet_detection_system.zip
   cd helmet_detection_system/api
   ```

2. **Criar ambiente virtual**:
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate
   
   # Linux/macOS
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Instalar dependências**:
   ```bash
   pip install -r requirements.txt
   ```

### Passo 2: Configurar o Modelo YOLOv8

1. **Verificar o modelo**:
   - Certifique-se de que o arquivo `best.pt` está na pasta `api/`
   - O modelo deve ter aproximadamente 6-14 MB

2. **Testar o carregamento**:
   ```bash
   python -c "from ultralytics import YOLO; model = YOLO('best.pt'); print('Modelo carregado com sucesso!')"
   ```

### Passo 3: Iniciar a API

1. **Executar a API**:
   ```bash
   python main.py
   ```

2. **Verificar funcionamento**:
   - Acesse: `http://localhost:8000/docs`
   - Teste o endpoint: `GET /api/v1/health`
   - Resposta esperada: `{"status": "healthy", "model_loaded": true}`

## Instalação da Interface Desktop

### Opção 1: Usar o AppImage (Linux - Recomendado)

1. **Baixar o AppImage**:
   - Arquivo: `EPI Guard-1.0.0.AppImage`
   - Tamanho: ~103 MB

2. **Tornar executável**:
   ```bash
   chmod +x "EPI Guard-1.0.0.AppImage"
   ```

3. **Executar**:
   ```bash
   ./"EPI Guard-1.0.0.AppImage"
   ```

### Opção 2: Desenvolvimento (Todas as Plataformas)

1. **Extrair o código fonte**:
   ```bash
   # Extrair epi-guard-electron.zip
   unzip epi-guard-electron.zip
   cd epi-guard-electron
   ```

2. **Instalar dependências**:
   ```bash
   npm install
   ```

3. **Executar em modo desenvolvimento**:
   ```bash
   npm run electron-dev
   ```

### Opção 3: Build Local

1. **Gerar build de produção**:
   ```bash
   npm run build
   ```

2. **Gerar instalador**:
   ```bash
   # Linux
   npm run dist-linux
   
   # Windows (requer Wine no Linux)
   npm run dist-win
   ```

## Configuração Inicial

### Passo 1: Verificar Conectividade

1. **Iniciar a API FastAPI** (se não estiver rodando):
   ```bash
   cd helmet_detection_system/api
   source venv/bin/activate  # Linux/macOS
   # ou venv\Scripts\activate  # Windows
   python main.py
   ```

2. **Iniciar a Interface Desktop**:
   - Execute o AppImage ou use `npm run electron-dev`

### Passo 2: Configurar a Conexão

1. **Acessar Configurações**:
   - Faça login com: `admin` / `admin123`
   - Vá para a aba "Configurações"

2. **Configurar API**:
   - **URL Base**: `http://localhost:8000`
   - **Timeout**: `30000` ms
   - **Tentativas**: `3`
   - Clique em "Testar Conexão"

3. **Verificar Status**:
   - Status deve mostrar: "API Conectada"
   - Modelo deve mostrar: "Carregado"

### Passo 3: Configurar Câmeras

1. **Acessar Gerenciamento de Câmeras**:
   - Vá para a aba "Câmeras"
   - Clique em "Adicionar Câmera"

2. **Configurar Webcam Local**:
   - **Nome**: "Webcam Principal"
   - **URL RTSP**: `0` (para webcam padrão)
   - **Localização**: "Escritório"
   - Clique em "Salvar"

3. **Configurar Câmera IP**:
   - **Nome**: "Câmera Entrada"
   - **URL RTSP**: `rtsp://usuario:senha@ip:porta/stream`
   - **Localização**: "Portaria"
   - Clique em "Salvar"

## Primeiro Uso

### Passo 1: Login no Sistema

1. **Credenciais Padrão**:
   - **Administrador**: `admin` / `admin123`
   - **Técnico**: `tecnico` / `tecnico123`

2. **Alterar Senhas**:
   - Vá para "Usuários" → "Editar"
   - Altere as senhas padrão por segurança

### Passo 2: Testar Detecção

1. **Teste Manual**:
   - Vá para "Câmeras"
   - Clique em "Ver" em uma câmera
   - Clique em "Detectar"
   - Verifique os resultados

2. **Teste Automático**:
   - Ative "Detecção Automática" nas configurações
   - Monitore o dashboard para detecções em tempo real

### Passo 3: Configurar Relatórios

1. **Gerar Primeiro Relatório**:
   - Vá para "Relatórios"
   - Selecione período: "Hoje"
   - Clique em "Gerar PDF"

2. **Configurar Exportação**:
   - Configure formatos desejados (PDF, Excel, CSV)
   - Defina periodicidade automática

## Solução de Problemas

### Problema: API não conecta

**Sintomas**: Dashboard mostra "API Desconectada"

**Soluções**:
1. Verificar se a API está rodando:
   ```bash
   curl http://localhost:8000/api/v1/health
   ```

2. Verificar logs da API:
   ```bash
   # Verificar arquivo de log na pasta api/
   tail -f helmet_detection_api_*.log
   ```

3. Reiniciar a API:
   ```bash
   # Parar (Ctrl+C) e reiniciar
   python main.py
   ```

### Problema: Modelo YOLOv8 não carrega

**Sintomas**: `"model_loaded": false` na API

**Soluções**:
1. Verificar arquivo do modelo:
   ```bash
   ls -la best.pt
   # Deve ter 6-14 MB
   ```

2. Verificar dependências:
   ```bash
   pip install ultralytics torch torchvision
   ```

3. Testar carregamento manual:
   ```bash
   python -c "from ultralytics import YOLO; YOLO('best.pt')"
   ```

### Problema: Câmera não conecta

**Sintomas**: Erro ao visualizar câmera

**Soluções**:
1. **Para webcam local**:
   - Verificar se a webcam está sendo usada por outro programa
   - Tentar diferentes índices: `0`, `1`, `2`

2. **Para câmera IP**:
   - Verificar URL RTSP: `rtsp://ip:porta/stream`
   - Testar com VLC: `vlc rtsp://ip:porta/stream`
   - Verificar credenciais de acesso

3. **Permissões**:
   ```bash
   # Linux: adicionar usuário ao grupo video
   sudo usermod -a -G video $USER
   ```

### Problema: Interface não abre

**Sintomas**: AppImage não executa

**Soluções**:
1. **Verificar permissões**:
   ```bash
   chmod +x "EPI Guard-1.0.0.AppImage"
   ```

2. **Verificar dependências**:
   ```bash
   # Ubuntu/Debian
   sudo apt install libgtk-3-0 libxss1 libasound2
   ```

3. **Executar em modo debug**:
   ```bash
   ./"EPI Guard-1.0.0.AppImage" --verbose
   ```

### Problema: Performance lenta

**Sintomas**: Detecção demorada

**Soluções**:
1. **Otimizar configurações**:
   - Reduzir intervalo de detecção
   - Diminuir resolução das câmeras
   - Ajustar limite de confiança

2. **Verificar recursos**:
   ```bash
   # Monitorar CPU e RAM
   htop
   ```

3. **Usar GPU** (se disponível):
   ```bash
   # Instalar PyTorch com CUDA
   pip install torch torchvision --index-url https://download.pytorch.org/whl/cu118
   ```

## Logs e Diagnóstico

### Localização dos Logs

1. **API FastAPI**:
   - Arquivo: `helmet_detection_api_YYYYMMDD.log`
   - Local: Pasta `api/`

2. **Interface Desktop**:
   - Console do Electron (F12)
   - Logs do sistema operacional

### Comandos Úteis

```bash
# Verificar status da API
curl http://localhost:8000/api/v1/health

# Testar detecção via API
curl -X GET http://localhost:8000/api/v1/detect/test

# Verificar processos
ps aux | grep python
ps aux | grep electron

# Verificar portas
netstat -tlnp | grep 8000
```

## Contato e Suporte

Para suporte adicional:
- **Email**: suporte@epiguard.com
- **Documentação**: Consulte o README.md
- **Logs**: Sempre inclua logs relevantes ao reportar problemas

---

**EPI Guard v1.0.0** - Manual de Instalação  
Última atualização: Junho 2025

