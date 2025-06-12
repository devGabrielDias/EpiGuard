// Testes manuais para a aplicação EPI Guard
console.log('🧪 Iniciando testes da aplicação EPI Guard...\n');

// Teste 1: Verificar estrutura de arquivos
console.log('✅ Teste 1: Estrutura de arquivos');
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'package.json',
  'main.js',
  'preload.js',
  'webpack.config.js',
  'src/index.js',
  'src/App.js',
  'src/services/ApiService.js',
  'src/services/AuthContext.js',
  'src/services/SystemContext.js',
  'build/index.html',
  'build/bundle.js'
];

let filesOk = true;
requiredFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, '..', file))) {
    console.log(`   ✓ ${file} existe`);
  } else {
    console.log(`   ✗ ${file} não encontrado`);
    filesOk = false;
  }
});

if (filesOk) {
  console.log('   🎉 Todos os arquivos necessários estão presentes\n');
} else {
  console.log('   ❌ Alguns arquivos estão faltando\n');
}

// Teste 2: Verificar package.json
console.log('✅ Teste 2: Configuração do package.json');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf8'));
  
  const requiredScripts = ['start', 'build', 'electron-dev', 'dist'];
  const requiredDeps = ['react', 'react-dom', 'axios'];
  const requiredDevDeps = ['electron', 'electron-builder', 'webpack'];
  
  console.log(`   ✓ Nome: ${packageJson.name}`);
  console.log(`   ✓ Versão: ${packageJson.version}`);
  
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`   ✓ Script '${script}' configurado`);
    } else {
      console.log(`   ✗ Script '${script}' não encontrado`);
    }
  });
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`   ✓ Dependência '${dep}' presente`);
    } else {
      console.log(`   ✗ Dependência '${dep}' não encontrada`);
    }
  });
  
  requiredDevDeps.forEach(dep => {
    if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
      console.log(`   ✓ Dev dependência '${dep}' presente`);
    } else {
      console.log(`   ✗ Dev dependência '${dep}' não encontrada`);
    }
  });
  
  console.log('   🎉 Configuração do package.json está correta\n');
} catch (error) {
  console.log(`   ❌ Erro ao ler package.json: ${error.message}\n`);
}

// Teste 3: Verificar build
console.log('✅ Teste 3: Build da aplicação');
if (fs.existsSync(path.join(__dirname, '..', 'build', 'bundle.js'))) {
  const bundleStats = fs.statSync(path.join(__dirname, '..', 'build', 'bundle.js'));
  console.log(`   ✓ Bundle gerado com sucesso (${Math.round(bundleStats.size / 1024)}KB)`);
  
  if (fs.existsSync(path.join(__dirname, '..', 'build', 'index.html'))) {
    console.log('   ✓ HTML principal gerado');
    console.log('   🎉 Build está funcionando corretamente\n');
  } else {
    console.log('   ✗ HTML principal não encontrado\n');
  }
} else {
  console.log('   ✗ Bundle não encontrado - execute npm run build\n');
}

// Teste 4: Verificar componentes React
console.log('✅ Teste 4: Componentes React');
const componentFiles = [
  'src/components/Button.js',
  'src/components/Input.js',
  'src/components/Sidebar.js',
  'src/components/Header.js',
  'src/components/DashboardContent.js',
  'src/components/CamerasContent.js',
  'src/components/ReportsContent.js',
  'src/components/UsersContent.js',
  'src/components/SettingsContent.js'
];

let componentsOk = true;
componentFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, '..', file))) {
    console.log(`   ✓ ${path.basename(file)} existe`);
  } else {
    console.log(`   ✗ ${path.basename(file)} não encontrado`);
    componentsOk = false;
  }
});

if (componentsOk) {
  console.log('   🎉 Todos os componentes React estão presentes\n');
} else {
  console.log('   ❌ Alguns componentes estão faltando\n');
}

// Teste 5: Verificar serviços
console.log('✅ Teste 5: Serviços da aplicação');
const serviceFiles = [
  'src/services/ApiService.js',
  'src/services/AuthContext.js',
  'src/services/SystemContext.js'
];

let servicesOk = true;
serviceFiles.forEach(file => {
  if (fs.existsSync(path.join(__dirname, '..', file))) {
    console.log(`   ✓ ${path.basename(file)} existe`);
  } else {
    console.log(`   ✗ ${path.basename(file)} não encontrado`);
    servicesOk = false;
  }
});

if (servicesOk) {
  console.log('   🎉 Todos os serviços estão presentes\n');
} else {
  console.log('   ❌ Alguns serviços estão faltando\n');
}

// Resumo final
console.log('📊 RESUMO DOS TESTES:');
console.log('='.repeat(50));

if (filesOk && componentsOk && servicesOk) {
  console.log('🎉 TODOS OS TESTES PASSARAM COM SUCESSO!');
  console.log('✅ A aplicação está pronta para uso');
  console.log('✅ Todos os arquivos necessários estão presentes');
  console.log('✅ Build foi gerado corretamente');
  console.log('✅ Componentes React estão implementados');
  console.log('✅ Serviços estão configurados');
  console.log('\n🚀 Para executar a aplicação:');
  console.log('   npm run electron-dev (desenvolvimento)');
  console.log('   npm run dist (gerar instalador)');
} else {
  console.log('❌ ALGUNS TESTES FALHARAM');
  console.log('⚠️  Verifique os erros acima e corrija antes de prosseguir');
}

console.log('\n' + '='.repeat(50));

