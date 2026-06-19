<#
.SYNOPSIS
    NEXUS Market AI — Desinstalador
.DESCRIPTION
    Remove todos os componentes do NEXUS Market AI do sistema.
    Inclui: servico Windows, banco de dados, arquivos de configuracao.
.NOTES
    Executar como Administrador: Sim
#>

#Requires -RunAsAdministrator

$CURRENT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$BACKEND_DIR = Join-Path -Path $CURRENT_DIR -ChildPath "backend"
$LOG_FILE = Join-Path -Path $CURRENT_DIR -ChildPath "uninstall-log.txt"

function Write-Log {
    param($Message, $Color = "White")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[$timestamp] $Message"
    Write-Host $line -ForegroundColor $Color
    Add-Content -Path $LOG_FILE -Value $line
}

Clear-Host
Write-Host @"
╔══════════════════════════════════════════════════════════╗
║           NEXUS Market AI — Desinstalador                ║
╚══════════════════════════════════════════════════════════╝
"@ -ForegroundColor $RED
Write-Host ""

$confirm = Read-Host "Tem certeza que deseja REMOVER o NEXUS Market AI? (S/N)"
if ($confirm -ne "S" -and $confirm -ne "s") {
    Write-Host "Desinstalacao cancelada." -ForegroundColor $YELLOW
    pause
    exit
}

$confirm2 = Read-Host "REMOVER TAMBEM O BANCO DE DADOS? (S/N) - Dados serao perdidos!"
$removeDb = ($confirm2 -eq "S" -or $confirm2 -eq "s")

Write-Host ""
Write-Host "Iniciando desinstalacao..." -ForegroundColor $YELLOW

# 1. Stop service
$serviceName = "NEXUSMarketAI"
$service = Get-Service -Name $serviceName -ErrorAction SilentlyContinue
if ($service) {
    Write-Log "Parando servico Windows..." -Color $Yellow
    Stop-Service -Name $serviceName -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    sc.exe delete $serviceName 2>&1 | Out-Null
    Write-Log "Servico removido: $serviceName" -Color $Green
}

# 2. Kill running processes
Write-Log "Finalizando processos..." -Color $Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
    $_.Path -like "*NEXUS_MARKET_AI*"
} | Stop-Process -Force -ErrorAction SilentlyContinue

# 3. Remove database
if ($removeDb) {
    Write-Log "Removendo banco de dados..." -Color $Yellow
    $envFile = Join-Path -Path $BACKEND_DIR -ChildPath ".env"
    if (Test-Path $envFile) {
        $envContent = Get-Content $envFile -Raw
        $dbHost = if ($envContent -match "DB_HOST=(.+)") { $Matches[1].Trim() } else { "localhost" }
        $dbPort = if ($envContent -match "DB_PORT=(.+)") { $Matches[1].Trim() } else { "5432" }
        $dbName = if ($envContent -match "DB_NAME=(.+)") { $Matches[1].Trim() } else { "nexus_market_ai" }
        $dbUser = if ($envContent -match "DB_USER=(.+)") { $Matches[1].Trim() } else { "postgres" }
        $dbPass = if ($envContent -match "DB_PASS=(.+)") { $Matches[1].Trim() } else { "postgres" }
        try {
            $env:PGPASSWORD = $dbPass
            & psql -h $dbHost -p $dbPort -U $dbUser -d "postgres" -c "DROP DATABASE IF EXISTS $dbName" 2>&1 | Out-Null
            Write-Log "Banco '$dbName' removido" -Color $Green
        } catch {
            Write-Log "AVISO: Nao foi possivel remover o banco automaticamente" -Color $Yellow
        }
        Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
    }
}

# 4. Remove node_modules
Write-Log "Removendo node_modules..." -Color $Yellow
@("$BACKEND_DIR\node_modules", "$CURRENT_DIR\frontend\node_modules") | ForEach-Object {
    if (Test-Path $_) {
        Remove-Item -Path $_ -Recurse -Force -ErrorAction SilentlyContinue
        Write-Log "Removido: $_" -Color $Green
    }
}

# 5. Remove .env
$envFile = Join-Path -Path $BACKEND_DIR -ChildPath ".env"
if (Test-Path $envFile) {
    Remove-Item -Path $envFile -Force -ErrorAction SilentlyContinue
    Write-Log "Removido: .env" -Color $Green
}

# 6. Remove uploads, exports, logs
@("$BACKEND_DIR\uploads", "$BACKEND_DIR\exports", "$BACKEND_DIR\logs") | ForEach-Object {
    if (Test-Path $_) {
        Remove-Item -Path "$_\*" -Recurse -Force -ErrorAction SilentlyContinue
        Write-Log "Limpado: $_" -Color $Green
    }
}

# 7. Remove dist
$distDir = "$CURRENT_DIR\frontend\dist"
if (Test-Path $distDir) {
    Remove-Item -Path $distDir -Recurse -Force -ErrorAction SilentlyContinue
    Write-Log "Removido: frontend/dist" -Color $Green
}

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor $GREEN
Write-Host "║        DESINSTALACAO CONCLUIDA!                         ║" -ForegroundColor $GREEN
Write-Host "╠══════════════════════════════════════════════════════════╣" -ForegroundColor $GREEN
if (-not $removeDb) {
    Write-Host "║  Banco de dados PRESERVADO (nao foi removido)           ║" -ForegroundColor $YELLOW
}
Write-Host "║  Log: $LOG_FILE" -ForegroundColor $GREEN
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor $GREEN
Write-Host ""

Read-Host "Pressione Enter para sair"
