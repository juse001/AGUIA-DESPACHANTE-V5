@echo off
REM Águia Despachante - Script de Inicialização para Windows 11
REM Este script automatiza o processo de instalação e execução

echo.
echo ========================================================
echo    Águia Despachante v1.0.0 - Windows 11
echo    Sistema de Gestão de Processos Administrativos
echo ========================================================
echo.

REM Verificar se Node.js está instalado
echo Verificando Node.js...
node -v >nul 2>&1
if errorlevel 1 (
    echo.
    echo ❌ ERRO: Node.js não foi encontrado!
    echo.
    echo Instale Node.js em: https://nodejs.org
    echo Baixe a versão LTS e siga o instalador
    echo.
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node -v') do echo ✅ Node.js encontrado: %%i
)

REM Verificar npm
echo.
echo Verificando npm...
npm -v >nul 2>&1
if errorlevel 1 (
    echo ❌ npm não foi encontrado!
    pause
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('npm -v') do echo ✅ npm encontrado: %%i
)

echo.
echo ========================================================
echo    Menu de Opções
echo ========================================================
echo.
echo 1 - Instalar dependências (npm install)
echo 2 - Build para produção (npm run build)
echo 3 - Executar servidor local (npm run preview)
echo 4 - Executar em desenvolvimento (npm run dev)
echo 5 - Instalar + Build + Executar (Processo Completo)
echo 6 - Sair
echo.
set /p choice="Escolha uma opção (1-6): "

if "%choice%"=="1" goto install
if "%choice%"=="2" goto build
if "%choice%"=="3" goto preview
if "%choice%"=="4" goto dev
if "%choice%"=="5" goto complete
if "%choice%"=="6" goto end
echo Opção inválida!
goto menu

:complete
echo.
echo 🔄 Executando processo completo...
echo.

:install
echo.
echo 📦 Instalando dependências...
echo.
call npm install
if errorlevel 1 (
    echo.
    echo ❌ Erro ao instalar dependências!
    pause
    exit /b 1
)
echo ✅ Dependências instaladas com sucesso!

if "%choice%"=="1" goto end

:build
echo.
echo 🏭 Compilando para produção...
echo.
call npm run build
if errorlevel 1 (
    echo.
    echo ❌ Erro ao compilar!
    echo Verifique se há erros TypeScript
    pause
    exit /b 1
)
echo ✅ Build concluído com sucesso!

if "%choice%"=="2" goto end

:preview
echo.
echo 🌐 Iniciando servidor de produção...
echo.
echo ✅ Servidor iniciado!
echo.
echo 🔗 Acesse em seu navegador:
echo    http://localhost:4173/
echo.
echo Pressione CTRL+C para parar o servidor
echo.
call npm run preview
exit /b 0

:dev
echo.
echo 🔧 Iniciando servidor de desenvolvimento...
echo.
echo ✅ Servidor iniciado!
echo.
echo 🔗 Acesse em seu navegador:
echo    http://localhost:5173/
echo.
echo Pressione CTRL+C para parar o servidor
echo.
call npm run dev
exit /b 0

:end
echo.
echo ========================================================
echo    Obrigado por usar Águia Despachante!
echo ========================================================
echo.
pause
