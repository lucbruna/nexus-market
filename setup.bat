@echo off
title NEXUS Market AI - Instalador

cd /d "%~dp0"

:: Check if install.ps1 exists
if not exist "install.ps1" (
    echo ERRO: install.ps1 nao encontrado
    pause
    exit /b 1
)

:: Attempt self-elevation
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Solicitando privilegios de administrador...
    powershell -NoProfile -Command "Start-Process -FilePath 'powershell.exe' -ArgumentList '-NoProfile -ExecutionPolicy Bypass -File ""%~dp0install.ps1""' -Verb RunAs -Wait"
    echo.
    echo Instalacao concluida (ou cancelada). Verifique install-log.txt
    pause
    exit /b %errorLevel%
)

:: Running as admin - execute installer
echo.
echo Executando instalador NEXUS Market AI...
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "install.ps1"
set EXIT_CODE=%errorLevel%

if %EXIT_CODE% neq 0 (
    echo.
    echo =====================================================
    echo  Instalacao falhou. Verifique install-log.txt
    echo =====================================================
    pause
)
exit /b %EXIT_CODE%
