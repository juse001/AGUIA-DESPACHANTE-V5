# Águia Despachante - Script de Inicialização (PowerShell)
# Para Windows 11

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "   Águia Despachante v1.0.0" -ForegroundColor Cyan
Write-Host "   Sistema de Gestão de Processos" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js encontrado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERRO: Node.js não foi encontrado!" -ForegroundColor Red
    Write-Host "Instale em: https://nodejs.org" -ForegroundColor Yellow
    Read-Host "Pressione ENTER para sair"
    exit 1
}

# Verificar npm
Write-Host "Verificando npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm -v
    Write-Host "✅ npm encontrado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ ERRO: npm não foi encontrado!" -ForegroundColor Red
    Read-Host "Pressione ENTER para sair"
    exit 1
}

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Menu de Opções" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1 - Instalar dependências (npm install)" -ForegroundColor White
Write-Host "2 - Build para produção (npm run build)" -ForegroundColor White
Write-Host "3 - Executar servidor local - PRODUÇÃO (npm run preview)" -ForegroundColor Green
Write-Host "4 - Executar em desenvolvimento (npm run dev)" -ForegroundColor White
Write-Host "5 - Instalar + Build + Executar COMPLETO" -ForegroundColor Green
Write-Host "6 - Sair" -ForegroundColor White
Write-Host ""
$choice = Read-Host "Escolha uma opção (1-6)"

switch ($choice) {
    "1" { 
        Write-Host ""
        Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
        Write-Host ""
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Erro ao instalar!" -ForegroundColor Red
            Read-Host "Pressione ENTER"
            exit 1
        }
        Write-Host "✅ Instalação concluída!" -ForegroundColor Green
    }
    "2" { 
        Write-Host ""
        Write-Host "🏭 Compilando para produção..." -ForegroundColor Yellow
        Write-Host ""
        npm run build
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Erro ao compilar!" -ForegroundColor Red
            Read-Host "Pressione ENTER"
            exit 1
        }
        Write-Host "✅ Build concluído!" -ForegroundColor Green
    }
    "3" { 
        Write-Host ""
        Write-Host "🌐 Iniciando servidor de produção..." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "✅ Servidor iniciado!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🔗 Acesse em seu navegador:" -ForegroundColor Cyan
        Write-Host "   http://localhost:4173/" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Pressione CTRL+C para parar" -ForegroundColor Yellow
        Write-Host ""
        npm run preview
    }
    "4" { 
        Write-Host ""
        Write-Host "🔧 Iniciando servidor de desenvolvimento..." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "✅ Servidor iniciado!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🔗 Acesse em seu navegador:" -ForegroundColor Cyan
        Write-Host "   http://localhost:5173/" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Pressione CTRL+C para parar" -ForegroundColor Yellow
        Write-Host ""
        npm run dev
    }
    "5" { 
        Write-Host ""
        Write-Host "🚀 Executando processo completo..." -ForegroundColor Yellow
        Write-Host ""
        
        Write-Host "📦 Passo 1: Instalando dependências..." -ForegroundColor Cyan
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Erro ao instalar!" -ForegroundColor Red
            Read-Host "Pressione ENTER"
            exit 1
        }
        
        Write-Host ""
        Write-Host "🏭 Passo 2: Compilando para produção..." -ForegroundColor Cyan
        npm run build
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Erro ao compilar!" -ForegroundColor Red
            Read-Host "Pressione ENTER"
            exit 1
        }
        
        Write-Host ""
        Write-Host "🌐 Passo 3: Iniciando servidor..." -ForegroundColor Cyan
        Write-Host ""
        Write-Host "✅ Servidor iniciado!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🔗 Acesse em seu navegador:" -ForegroundColor Cyan
        Write-Host "   http://localhost:4173/" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Pressione CTRL+C para parar" -ForegroundColor Yellow
        Write-Host ""
        npm run preview
    }
    "6" { 
        exit 0
    }
    default { 
        Write-Host "❌ Opção inválida!" -ForegroundColor Red
    }
}
