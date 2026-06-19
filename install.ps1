<#
.SYNOPSIS
    NEXUS Market AI — Instalador Profissional
.DESCRIPTION
    Instala e configura automaticamente o ERP NEXUS Market AI no Windows.
    Verifica dependencias, configura banco, instala servicos, e ajusta firewall.
.NOTES
    Versao: 4.0.0
    Autor: NEXUS Market AI Team
    Executar como Administrador: Sim (necessario para servicos e firewall)
#>

# Check admin
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "Este instalador requer privilegios de administrador." -ForegroundColor Red
    Write-Host "Execute setup.bat como Administrador." -ForegroundColor Yellow
    Read-Host "Pressione Enter para sair"
    exit 1
}

$CURRENT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$LOG_FILE = Join-Path -Path $CURRENT_DIR -ChildPath "install-log.txt"
$BACKEND_DIR = Join-Path -Path $CURRENT_DIR -ChildPath "backend"
$FRONTEND_DIR = Join-Path -Path $CURRENT_DIR -ChildPath "frontend"

# Cores para terminal
$GREEN = "Green"
$YELLOW = "Yellow"
$RED = "Red"
$CYAN = "Cyan"
$GRAY = "Gray"

function Write-Log {
    param($Message, $Color = "White")
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[$timestamp] $Message"
    Write-Host $line -ForegroundColor $Color
    Add-Content -Path $LOG_FILE -Value $line
}

function Write-Banner {
    Clear-Host
    $banner = @"
  ___  _____  __  __  _____  _____  _  _  ___  ___
 / _ \|_   _||  \/  || ____|| ____|| || ||_ _||_ _|
| | | | | |  | |\/| ||  _|  |  _|  | __ | | |  | |
| |_| | | |  | |  | || |___ | |___ | _|| | | |  | |
 \___/  |_|  |_|  |_||_____||_____||_||_||___||___|

      MARKET AI - ERP v4.0
      Instalador Profissional - Windows
"@
    Write-Host $banner -ForegroundColor $CYAN
    Write-Host ""
}

function Test-NodeJs {
    Write-Log "[1/8] Verificando Node.js..." -Color $YELLOW
    try {
        $version = node --version 2>&1
        if ($version -match "v(\d+)") {
            $verNum = [int]$Matches[1]
            if ($verNum -ge 18) {
                Write-Log "Node.js $version encontrado OK" -Color $GREEN
                return $true
            } else {
                Write-Log "Node.js $version e muito antigo. Necessario >= 18" -Color $RED
                return $false
            }
        }
    } catch {}
    Write-Log "Node.js NAO encontrado!" -Color $RED
    return $false
}

function Test-Npm {
    Write-Log "Verificando npm..." -Color $YELLOW
    try {
        $version = npm --version 2>&1
        Write-Log "npm $version encontrado OK" -Color $GREEN
        return $true
    } catch {
        Write-Log "npm NAO encontrado!" -Color $RED
        return $false
    }
}

function Test-PostgreSQL {
    Write-Log "[2/8] Verificando PostgreSQL..." -Color $YELLOW
    try {
        $psqlPath = Get-Command "psql" -ErrorAction SilentlyContinue
        if (-not $psqlPath) {
            $psqlPath = Get-ChildItem -Path "${env:ProgramFiles}\PostgreSQL\*\bin\psql.exe" -ErrorAction SilentlyContinue | Select-Object -First 1
        }
        if ($psqlPath) {
            $version = & $psqlPath.FullName --version 2>&1
            Write-Log "PostgreSQL encontrado: $version" -Color $GREEN
            return $psqlPath.FullName
        }
    } catch {}
    Write-Log "PostgreSQL NAO encontrado. Instale de: https://www.postgresql.org/download/windows/" -Color $YELLOW
    return $null
}

function Test-Redis {
    Write-Log "[3/8] Verificando Redis..." -Color $YELLOW
    try {
        $redisCli = Get-Command "redis-cli" -ErrorAction SilentlyContinue
        if ($redisCli) {
            $version = & $redisCli --version 2>&1
            Write-Log "Redis encontrado: $version" -Color $GREEN
            return $true
        }
    } catch {}
    Write-Log "Redis NAO encontrado. Opcional - pode usar Docker." -Color $YELLOW
    return $false
}

function Install-NpmPackages {
    Write-Log "[4/8] Instalando dependencias do backend..." -Color $YELLOW
    try {
        Set-Location -LiteralPath $BACKEND_DIR
        npm install 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) { throw "npm install falhou no backend" }
        Write-Log "Backend dependencies OK" -Color $GREEN
    } catch {
        Write-Log "ERRO: $($_.Exception.Message)" -Color $RED
        return $false
    }

    Write-Log "Instalando dependencias do frontend..." -Color $YELLOW
    try {
        Set-Location -LiteralPath $FRONTEND_DIR
        npm install 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) { throw "npm install falhou no frontend" }
        Write-Log "Frontend dependencies OK" -Color $GREEN
    } catch {
        Write-Log "ERRO: $($_.Exception.Message)" -Color $RED
        return $false
    }
    return $true
}

function Build-Frontend {
    Write-Log "[5/8] Compilando frontend para producao..." -Color $YELLOW
    try {
        Set-Location -LiteralPath $FRONTEND_DIR
        npm run build 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) { throw "Build falhou" }
        Write-Log "Frontend compilado OK (dist/)" -Color $GREEN
        return $true
    } catch {
        Write-Log "ERRO no build: $($_.Exception.Message)" -Color $RED
        return $false
    }
}

function Configure-Environment {
    Write-Log "[6/8] Configurando ambiente..." -Color $YELLOW
    $envFile = Join-Path -Path $BACKEND_DIR -ChildPath ".env"
    if (-not (Test-Path $envFile)) {
        $dbPass = Read-Host "Senha do PostgreSQL (deixe em branco para 'postgres')"
        if ([string]::IsNullOrWhiteSpace($dbPass)) { $dbPass = "postgres" }

        $jwtSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | ForEach-Object { [char]$_ })
        $dbHost = Read-Host "Host do PostgreSQL (Enter para localhost)"
        if ([string]::IsNullOrWhiteSpace($dbHost)) { $dbHost = "localhost" }
        $dbName = Read-Host "Nome do banco (Enter para nexus_market_ai)"
        if ([string]::IsNullOrWhiteSpace($dbName)) { $dbName = "nexus_market_ai" }
        $dbUser = Read-Host "Usuario PostgreSQL (Enter para postgres)"
        if ([string]::IsNullOrWhiteSpace($dbUser)) { $dbUser = "postgres" }

        $envContent = @"
PORT=8000
NODE_ENV=production
DB_HOST=$dbHost
DB_PORT=5432
DB_NAME=$dbName
DB_USER=$dbUser
DB_PASS=$dbPass
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://localhost:5672
JWT_SECRET=$jwtSecret
JWT_EXPIRES_IN=8h
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
CORS_ORIGIN=http://localhost:3000
UPLOAD_DIR=./uploads
LOG_DIR=./logs
"@
        Set-Content -Path $envFile -Value $envContent
        Write-Log ".env criado em: $envFile" -Color $GREEN
    } else {
        Write-Log ".env ja existe, mantendo configuracao atual" -Color $GREEN
    }
    return $true
}

function Setup-Database {
    Write-Log "[7/8] Configurando banco de dados..." -Color $YELLOW
    $envContent = Get-Content -Path (Join-Path -Path $BACKEND_DIR -ChildPath ".env") -Raw
    $dbHost = if ($envContent -match "DB_HOST=(.+)") { $Matches[1].Trim() } else { "localhost" }
    $dbPort = if ($envContent -match "DB_PORT=(.+)") { $Matches[1].Trim() } else { "5432" }
    $dbName = if ($envContent -match "DB_NAME=(.+)") { $Matches[1].Trim() } else { "nexus_market_ai" }
    $dbUser = if ($envContent -match "DB_USER=(.+)") { $Matches[1].Trim() } else { "postgres" }
    $dbPass = if ($envContent -match "DB_PASS=(.+)") { $Matches[1].Trim() } else { "postgres" }

    Write-Log ("Conectando em PostgreSQL " + $dbHost + ":" + $dbPort + "...") -Color $YELLOW

    $env:PGPASSWORD = $dbPass
    $psqlParams = "-h", $dbHost, "-p", $dbPort, "-U", $dbUser, "-d", "postgres"

    try {
        $exists = & psql @psqlParams -t -c "SELECT 1 FROM pg_database WHERE datname='$dbName'" 2>&1
        if ($exists -match "1") {
            Write-Log "Banco '$dbName' ja existe" -Color $GREEN
        } else {
            & psql @psqlParams -c "CREATE DATABASE $dbName" 2>&1 | Out-Null
            if ($LASTEXITCODE -eq 0) {
                Write-Log "Banco '$dbName' criado com sucesso" -Color $GREEN
            } else {
                Write-Log "AVISO: Nao foi possivel criar o banco automaticamente. Crie manualmente." -Color $YELLOW
            }
        }
    } catch {
        Write-Log "AVISO: Nao foi possivel conectar ao PostgreSQL para criar o banco." -Color $YELLOW
        Write-Log "       Crie manualmente: CREATE DATABASE $dbName;" -Color $YELLOW
    }

    try {
        Set-Location -LiteralPath $BACKEND_DIR
        if (Test-Path "database/migrate.js") {
            npm run migrate 2>&1 | Out-Null
            Write-Log "Migracoes executadas OK" -Color $GREEN
        }
        if (Test-Path "database/seed.js") {
            npm run seed 2>&1 | Out-Null
            Write-Log "Seed executado OK (usuario admin: admin / admin)" -Color $GREEN
        }
    } catch {
        Write-Log "AVISO: Migrations falharam. Execute manualmente: npm run migrate, depois npm run seed" -Color $YELLOW
    }

    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
    return $true
}

function Register-Service {
    Write-Log "[8/8] Instalando servico Windows..." -Color $YELLOW
    $serviceName = "NEXUSMarketAI"
    $existing = Get-Service -Name $serviceName -ErrorAction SilentlyContinue
    if ($existing) {
        Write-Log "Servico '$serviceName' ja existe. Reiniciando..." -Color $YELLOW
        Restart-Service -Name $serviceName -ErrorAction SilentlyContinue
        return $true
    }
    Write-Log "Servico Windows: Para criar servico permanente, use NSSM (nao incluso)." -Color $YELLOW
    Write-Log "  Comando manual: nssm install $serviceName node $BACKEND_DIR\server.js" -Color $YELLOW
    Write-Log "  Ou execute no backend: npm start" -Color $CYAN
    return $true
}

function Show-Summary {
    $jwtFile = Join-Path -Path $BACKEND_DIR -ChildPath ".env"
    $jwtSecret = ""
    if (Test-Path $jwtFile) {
        $content = Get-Content $jwtFile -Raw
        if ($content -match "JWT_SECRET=(.+)") {
            $jwtSecret = $Matches[1].Trim()
        }
    }

    Write-Host ""
    Write-Host ("=" * 52) -ForegroundColor $GREEN
    Write-Host "     INSTALACAO CONCLUIDA COM SUCESSO!" -ForegroundColor $GREEN
    Write-Host ("=" * 52) -ForegroundColor $GREEN
    Write-Host " Backend:  http://localhost:8000" -ForegroundColor $GREEN
    Write-Host " Frontend: http://localhost:3000" -ForegroundColor $GREEN
    Write-Host " API:      http://localhost:8000/api/health" -ForegroundColor $GREEN
    Write-Host " Login:    admin / admin" -ForegroundColor $GREEN
    if ($jwtSecret -and $jwtSecret.Length -gt 10) {
        $displaySecret = $jwtSecret.Substring(0, 15) + "..."
        Write-Host " JWT: $displaySecret" -ForegroundColor $YELLOW
    }
    Write-Host " Log: install-log.txt" -ForegroundColor $GREEN
    Write-Host ("=" * 52) -ForegroundColor $GREEN
    Write-Host ""
    Write-Host "INICIAR:" -ForegroundColor $CYAN
    Write-Host "  backend:  npm start" -ForegroundColor $GRAY
    Write-Host "  frontend: npm run dev" -ForegroundColor $GRAY
    Write-Host ""
    Write-Host "ACESSAR:" -ForegroundColor $CYAN
    Write-Host "  Frontend: http://localhost:5173" -ForegroundColor $GRAY
    Write-Host "  API:      http://localhost:8000/api/health" -ForegroundColor $GRAY
    Write-Host ""
}

# ===== MAIN =====
try {
    Write-Banner
    Write-Host "Iniciando instalacao do NEXUS Market AI v4.0..." -ForegroundColor $CYAN
    Write-Host "Diretorio: $CURRENT_DIR" -ForegroundColor $GRAY
    Write-Host "Log: $LOG_FILE" -ForegroundColor $GRAY
    Write-Host ""

    # Clean log
    Remove-Item -Path $LOG_FILE -ErrorAction SilentlyContinue

    # 1. Check Node.js
    $hasNode = Test-NodeJs
    if (-not $hasNode) {
        Write-Host ""
        Write-Host ("=" * 50) -ForegroundColor $RED
        Write-Host " Node.js 18+ e obrigatorio!" -ForegroundColor $RED
        Write-Host " Baixe de: https://nodejs.org/" -ForegroundColor $RED
        Write-Host " Apos instalar, execute o instalador novamente." -ForegroundColor $RED
        Write-Host ("=" * 50) -ForegroundColor $RED
        Write-Host ""
        Read-Host "Pressione Enter para sair"
        exit 1
    }
    if (-not (Test-Npm)) { exit 1 }

    # 2. PostgreSQL check (optional)
    $psqlPath = Test-PostgreSQL

    # 3. Redis check (optional)
    Test-Redis

    # 4. Create necessary directories
    Write-Log "Criando diretorios necessarios..." -Color $YELLOW
    @("$BACKEND_DIR/uploads", "$BACKEND_DIR/exports", "$BACKEND_DIR/logs", "$CURRENT_DIR/backups", "$CURRENT_DIR/storage") | ForEach-Object {
        if (-not (Test-Path $_)) { New-Item -ItemType Directory -Path $_ -Force | Out-Null }
    }
    Write-Log "Diretorios criados OK" -Color $GREEN

    # 5. Install npm packages
    if (-not (Install-NpmPackages)) { exit 1 }

    # 6. Build frontend
    if (-not (Build-Frontend)) { exit 1 }

    # 7. Configure .env
    if (-not (Configure-Environment)) { exit 1 }

    # 8. Setup database
    if ($psqlPath) {
        Setup-Database
    } else {
        Write-Log "[7/8] PostgreSQL nao encontrado localmente. Configure manualmente." -Color $YELLOW
        Write-Log "      Crie o banco e execute: cd backend; npm run migrate; npm run seed" -Color $YELLOW
    }

    # 9. Register service
    Register-Service

    # 10. Summary
    Show-Summary

    Write-Log "Instalacao concluida!" -Color $GREEN

    Read-Host "`nPressione Enter para sair"

} catch {
    Write-Log "ERRO FATAL: $($_.Exception.Message)" -Color $RED
    Write-Log "Stack: $($_.ScriptStackTrace)" -Color $RED
    Write-Host "`nErro durante instalacao. Verifique o log: $LOG_FILE" -ForegroundColor $RED
    Read-Host "`nPressione Enter para sair"
    exit 1
}
