# NEXUS Market AI — Guia de Instalação

> **Versão 4.0.0** · ERP modular para supermercados

---

## 📋 Requisitos Mínimos

| Componente | Especificação |
|------------|---------------|
| **Sistema Operacional** | Windows 10/11, Windows Server 2019+, Linux (Ubuntu 20.04+) |
| **Node.js** | v18.0.0 ou superior ([Download](https://nodejs.org/)) |
| **PostgreSQL** | 14+ ([Download](https://www.postgresql.org/download/)) |
| **RAM** | Mínimo 2GB (recomendado 4GB) |
| **Disco** | 1GB livres para instalação |
| **Navegador** | Chrome 90+, Edge 90+, Firefox 90+ |

### Opcionais

- **Redis** — para cache e filas (pode usar Docker)
- **Docker** — para execução conteinerizada
- **NSSM** — para instalar como serviço Windows

---

## 🚀 Instalação Rápida (Windows)

### Método 1: Instalador Automático (Recomendado)

1. Execute como **Administrador**:
   ```
   setup.bat
   ```

2. O instalador irá:
   - ✅ Verificar Node.js 18+
   - ✅ Verificar PostgreSQL
   - ✅ Instalar dependências (npm install)
   - ✅ Compilar frontend (npm run build)
   - ✅ Configurar arquivo `.env`
   - ✅ Criar banco de dados
   - ✅ Executar migrations e seed

3. Acesse:
   - **Frontend:** `http://localhost:5173`
   - **API:** `http://localhost:8000/api/health`
   - **Login:** `admin` / `admin`

### Método 2: Manual PowerShell

```powershell
# Como Administrador
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\install.ps1
```

---

## 🐧 Instalação Manual (Linux)

```bash
# 1. Clonar o repositório
git clone https://github.com/seu-repo/nexus-market-ai.git
cd nexus-market-ai

# 2. Configurar banco PostgreSQL
sudo -u postgres createdb nexus_market_ai
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"

# 3. Configurar ambiente
cp backend/.env.example backend/.env
nano backend/.env  # Ajustar credenciais do banco

# 4. Instalar dependências
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# 5. Compilar frontend
cd frontend && npm run build && cd ..

# 6. Migrations e seed
cd backend && npm run migrate && npm run seed && cd ..

# 7. Iniciar
cd backend && npm start &
cd frontend && npm run dev &
```

---

## 🐳 Instalação com Docker

```bash
# 1. Configurar JWT_SECRET seguro
$env:JWT_SECRET = "sua-chave-segura-aqui"  # PowerShell
export JWT_SECRET="sua-chave-segura-aqui"   # Linux

# 2. Iniciar todos os serviços
docker-compose up -d

# 3. Acompanhar logs
docker-compose logs -f

# 4. Acessar
# Frontend: http://localhost:3000
# API:      http://localhost:8000/api/health
```

---

## ⚙️ Configuração

### Variáveis de Ambiente (`backend/.env`)

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta do backend | `8000` |
| `NODE_ENV` | Ambiente | `development` |
| `DB_HOST` | Host PostgreSQL | `localhost` |
| `DB_PORT` | Porta PostgreSQL | `5432` |
| `DB_NAME` | Nome do banco | `nexus_market_ai` |
| `DB_USER` | Usuário PostgreSQL | `postgres` |
| `DB_PASS` | Senha PostgreSQL | `postgres` |
| `JWT_SECRET` | **Chave secreta JWT (obrigatório)** | *(gerada na instalação)* |
| `JWT_EXPIRES_IN` | Expiração do token | `8h` |
| `CORS_ORIGIN` | Origem permitida CORS | `http://localhost:3000` |

> ⚠️ **Produção:** Gere um JWT_SECRET forte:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

---

## 🔒 Segurança

Após a instalação inicial, recomenda-se:

1. **Trocar senha do admin** — Acessar Configurações > Usuários
2. **Gerar JWT_SECRET forte** — Editar `backend/.env`
3. **Configurar HTTPS** — Usar nginx + Let's Encrypt ou similar
4. **Alterar senhas PostgreSQL** — Usuário `postgres` padrão
5. **Configurar firewall** — Bloquear portas 5432, 6379, 5672 externamente
6. **Backup regular** — Usar a ferramenta em Configurações > Backup

---

## 📁 Estrutura de Diretórios

```
nexus_market_ai/
├── backend/           # API REST (Node.js + Express)
│   ├── api/           # Rotas da API
│   ├── database/      # Models, migrations, seed
│   ├── middleware/     # Auth, auditoria, upload
│   └── server.js      # Ponto de entrada
├── frontend/          # SPA (Vanilla JS + Vite)
│   └── src/
│       ├── pages/     # Módulos do ERP
│       ├── components/# Sidebar, Topbar
│       ├── services/  # Database, API
│       └── styles/    # CSS global
├── deploy/            # Nginx, SSL
├── docker-compose.yml # Infra completa
├── install.ps1       # Instalador Windows
├── uninstall.ps1     # Desinstalador
└── setup.bat         # Launcher do instalador
```

---

## 🔧 Manutenção

### Atualizar dependências
```bash
cd backend && npm update && cd ..
cd frontend && npm update && cd ..
```

### Resetar banco de dados
```bash
cd backend && npm run seed
```

### Backup manual
```bash
pg_dump -U postgres nexus_market_ai > backup-$(date +%Y-%m-%d).sql
```

### Logs
```bash
# Backend
tail -f backend/logs/auditoria.log

# Docker
docker-compose logs -f backend
```

---

## 🆘 Suporte

- **Issues:** https://github.com/anomalyco/nexus-market-ai/issues
- **Documentação:** https://nexus-ai.github.io/docs
- **Email:** suporte@nexus.ai

---

## 📝 Licença

MIT License — Copyright (c) 2024 NEXUS Market AI
