@echo off
title NEXUS Market AI - Parando
cd /d "%~dp0"

echo =====================================================
echo      Parando NEXUS Market AI...
echo =====================================================
echo.

:: Kill backend and frontend processes
taskkill /f /fi "WINDOWTITLE eq NEXUS Backend*" >nul 2>&1
taskkill /f /fi "WINDOWTITLE eq NEXUS Frontend*" >nul 2>&1

:: Kill any node processes in our directories
for /f "tokens=2 delims=," %%a in ('tasklist /fi "IMAGENAME eq node.exe" /fo csv /nh 2^>nul') do (
    taskkill /f /pid %%a >nul 2>&1
)

echo [OK] Servicos parados.
echo.
pause
