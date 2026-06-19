@echo off
title NEXUS Market AI
cd /d "%~dp0"

color 0F
cls

echo.
echo  ============================================
echo     NEXUS Market AI v4.0  -  INICIANDO
echo  ============================================
echo.
echo  Pressione CTRL+C a qualquer momento para parar.
echo.

:: ============================================
:: 1. Verificar Node.js
:: ============================================
echo  [1/5] Verificando Node.js...
where node >nul 2>&1
if %errorLevel% neq 0 (
    echo.
    echo  ****************************************************
    echo  *  Node.js nao encontrado!
    echo  *  
    echo  *  Passo 1: Baixe Node.js em https://nodejs.org/
    echo  *  Passo 2: Instale (marcar "Add to PATH")
    echo  *  Passo 3: Feche e abra o programa novamente
    echo  ****************************************************
    echo.
    start https://nodejs.org/
    pause
    exit /b 1
)
echo  [OK] Node.js encontrado
echo.

:: ============================================
:: 2. Configurar .env
:: ============================================
echo  [2/5] Configurando ambiente...
if not exist "backend\.env" (
    if exist "backend\.env.example" (
        copy "backend\.env.example" "backend\.env" >nul
        echo  [OK] .env criado a partir do .env.example
        echo.
        echo  ****************************************************
        echo  *  ATENCAO: Edite backend\.env com os dados
        echo  *  do seu banco PostgreSQL antes de usar
        echo  *  recursos do servidor (opcional para uso local)
        echo  ****************************************************
    ) else (
        echo  [ERRO] .env.example nao encontrado
        pause
        exit /b 1
    )
) else (
    echo  [OK] .env ja configurado
)
echo.

:: ============================================
:: 3. Instalar dependencias
:: ============================================
echo  [3/5] Instalando dependencias (pode levar alguns minutos)...
echo.

if not exist "backend\node_modules" (
    echo  >> Backend...
    cd backend
    call npm install --no-fund --no-audit --loglevel=error
    if %errorLevel% neq 0 (
        echo.
        echo  [ERRO] Falha ao instalar dependencias do backend
        pause
        exit /b 1
    )
    cd ..
    echo  [OK] Backend pronto
) else (
    echo  [OK] Backend ja instalado
)

if not exist "frontend\node_modules" (
    echo  >> Frontend...
    cd frontend
    call npm install --no-fund --no-audit --loglevel=error
    if %errorLevel% neq 0 (
        echo.
        echo  [ERRO] Falha ao instalar dependencias do frontend
        pause
        exit /b 1
    )
    cd ..
    echo  [OK] Frontend pronto
) else (
    echo  [OK] Frontend ja instalado
)
echo.

:: ============================================
:: 4. Compilar frontend
:: ============================================
echo  [4/5] Compilando frontend...
if not exist "frontend\dist" (
    cd frontend
    call npm run build
    if %errorLevel% neq 0 (
        echo.
        echo  [ERRO] Falha ao compilar frontend
        pause
        exit /b 1
    )
    cd ..
    echo  [OK] Frontend compilado
) else (
    echo  [OK] Frontend ja compilado
)
echo.

:: ============================================
:: 5. Iniciar servicos
:: ============================================
echo  [5/5] Iniciando servicos...
echo.
echo  >> Backend (API na porta 8000)...
start "NEXUS Backend" /MIN cmd /c "cd /d "%~dp0backend" && node server.js"

:: Aguardar backend ficar pronto (ate 30s)
echo  >> Aguardando backend responder...
setlocal enabledelayedexpansion
set "READY="
for /l %%i in (1,1,30) do (
    ping -n 2 127.0.0.1 >nul
    >nul 2>&1 curl -s http://localhost:8000/api/health
    if !errorLevel! equ 0 (
        set "READY=1"
        goto :ready
    )
    if %%i equ 15 echo     (ainda iniciando, aguarde...)
)
:ready
if defined READY (
    echo  [OK] Backend online
) else (
    echo  [AVISO] Backend nao respondeu (PostgreSQL pode estar offline)
    echo          O sistema funcionara em modo local (IndexedDB)
)

:: Iniciar frontend (servindo build pronto)
echo  >> Frontend (interface na porta 3000)...
start "NEXUS Frontend" /MIN cmd /c "cd /d "%~dp0frontend" && npx vite preview --port 3000 --host"

:: Aguardar frontend ficar pronto (ate 15s)
echo  >> Aguardando frontend responder...
for /l %%i in (1,1,15) do (
    ping -n 2 127.0.0.1 >nul
    >nul 2>&1 curl -s http://localhost:3000
    if !errorlevel! equ 0 goto :webready
)
:webready
echo  [OK] Frontend online
endlocal

echo.
echo  ============================================
echo     SISTEMA PRONTO!
echo  ============================================
echo.
echo  Interface: http://localhost:3000
echo  API:       http://localhost:8000/api/health
echo  Login:     admin / admin
echo.
echo  Duas janelas em segundo plano:
echo    - "NEXUS Backend"  (servidor API)
echo    - "NEXUS Frontend" (servidor web)
echo.
echo  Para sair: feche as janelas ou execute stop-nexus.bat
echo.
echo  Abrindo navegador...
echo.
start http://localhost:3000
echo.
echo  Pressione qualquer tecla para fechar esta janela,
echo  ou apenas minimize-a (os servicos continuam rodando).
pause >nul
