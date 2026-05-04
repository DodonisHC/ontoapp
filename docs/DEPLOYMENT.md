# Guia de Deploy - Diário do Ser

## Visão Geral

Este guia cobre o deploy do Diário do Ser em diferentes ambientes:
- **Desenvolvimento**: Local com SQLite
- **Produção**: Com PostgreSQL

## Requisitos de Produção

- Node.js 20+
- PostgreSQL 14+
- Variáveis de ambiente configuradas
- (Opcional) Servidor web (Nginx, Apache, ou serviço de hospedagem)

## Preparação para Produção

### 1. Build do Frontend

```bash
npm run build:web
```

Isso cria a pasta `dist/` com os arquivos otimizados para produção.

### 2. Configurar Variáveis de Ambiente

Crie arquivo `.env.production`:

```env
# Banco PostgreSQL
DATABASE_URL="postgresql://user:password@host:5432/database_name?schema=public"

# Provedores de IA (configure pelo menos um)
GOOGLE_API_KEY=sua_chave_gemini
ANTHROPIC_API_KEY=sua_chave_claude
OPENAI_API_KEY=sua_chave_openai

# Porta da API
PORT=4000

# Ambiente
NODE_ENV=production
```

> ⚠️ **Importante**: Nunca commite arquivos `.env` no git!

### 3. Migrações do Banco

```bash
# Aplicar migrations em produção
npx prisma migrate deploy
```

## Opções de Deploy

### Opção 1: VPS/Dedicado (Linux)

#### Instalação

```bash
# 1. Conectar ao servidor
ssh user@seu-servidor.com

# 2. Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Instalar PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# 4. Clonar repositório
git clone https://github.com/DodonisHC/ontoapp.git
cd ontoapp

# 5. Instalar dependências
npm ci --production

# 6. Configurar ambiente
cp .env.example .env
nano .env  # Editar com suas configurações

# 7. Configurar banco de dados
sudo -u postgres psql -c "CREATE DATABASE diario_do_ser;"
sudo -u postgres psql -c "CREATE USER diario_user WITH PASSWORD 'senha_segura';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE diario_do_ser TO diario_user;"

# 8. Aplicar migrations
npx prisma migrate deploy

# 9. Build frontend
npm run build:web

# 10. Iniciar servidor
npm run start:api
```

#### Process Manager (PM2)

Recomendado para produção:

```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Criar arquivo de configuração
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'diario-do-ser-api',
    script: './src/server.ts',
    interpreter: 'tsx',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 4000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
}
EOF

# Criar pasta de logs
mkdir -p logs

# Iniciar com PM2
pm2 start ecosystem.config.js

# Salvar configuração
pm2 save

# Configurar inicialização automática
pm2 startup systemd
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $(whoami) --hp $(echo $HOME)
```

Comandos úteis do PM2:

```bash
pm2 status              # Ver status
pm2 logs                # Ver logs
pm2 restart diario-do-ser-api  # Reiniciar
pm2 stop diario-do-ser-api     # Parar
pm2 delete diario-do-ser-api   # Remover
```

#### Nginx como Reverse Proxy

```bash
# Instalar Nginx
sudo apt-get install nginx

# Criar configuração
sudo nano /etc/nginx/sites-available/diario-do-ser
```

Configuração:

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    # Frontend (arquivos estáticos)
    location / {
        root /caminho/para/ontoapp/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API (proxy para Node.js)
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ativar:

```bash
sudo ln -s /etc/nginx/sites-available/diario-do-ser /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# (Opcional) Certificado SSL com Certbot
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
```

### Opção 2: Railway.app (Recomendado para iniciantes)

#### Deploy Automático

1. **Conectar GitHub**:
   - Acesse [Railway](https://railway.app/)
   - Conecte sua conta GitHub
   - Importe o repositório

2. **Adicionar PostgreSQL**:
   - No dashboard, clique em "New"
   - Selecione "Database" → "Add PostgreSQL"

3. **Variáveis de Ambiente**:
   - Railway automaticamente configura `DATABASE_URL`
   - Adicione manualmente:
     - `GOOGLE_API_KEY`
     - `ANTHROPIC_API_KEY` (opcional)
     - `OPENAI_API_KEY` (opcional)

4. **Deploy**:
   - Railway detecta automaticamente o projeto Node.js
   - Deploy automático a cada push no `main`

#### Configuração de Build

Crie `railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start:api",
    "healthcheckPath": "/api/entries",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Opção 3: Render.com

#### Web Service

1. **Criar Web Service**:
   - Acesse [Render](https://render.com/)
   - "New" → "Web Service"
   - Conecte repositório GitHub

2. **Configuração**:
   - **Name**: diario-do-ser
   - **Environment**: Node
   - **Build Command**: `npm ci && npm run build:web && npx prisma migrate deploy`
   - **Start Command**: `npm run start:api`

3. **Variáveis de Ambiente**:
   - Adicione todas as variáveis do `.env`

4. **PostgreSQL**:
   - "New" → "PostgreSQL"
   - Render automaticamente configura `DATABASE_URL`

### Opção 4: Docker (Avançado)

#### Dockerfile

Crie na raiz do projeto:

```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:web
RUN npx prisma generate

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

COPY package*.json ./
RUN npm ci --production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

EXPOSE 4000

CMD ["npm", "run", "start:api"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "4000:4000"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/diario?schema=public
      GOOGLE_API_KEY: ${GOOGLE_API_KEY}
      ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
      OPENAI_API_KEY: ${OPENAI_API_KEY}
    depends_on:
      - db
    volumes:
      - ./logs:/app/logs

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: diario
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./dist:/usr/share/nginx/html:ro
    depends_on:
      - app

volumes:
  postgres_data:
```

#### Build e Deploy

```bash
# Build
docker-compose build

# Up
docker-compose up -d

# Logs
docker-compose logs -f app

# Down
docker-compose down
```

## Checklist de Produção

### Segurança

- [ ] Variáveis de ambiente configuradas
- [ ] `.env` não está no git
- [ ] Chaves de API protegidas
- [ ] HTTPS configurado
- [ ] Headers de segurança no Nginx

### Performance

- [ ] Frontend buildado (`npm run build:web`)
- [ ] Node.js em modo produção
- [ ] PM2 ou similar para process management
- [ ] Cache configurado (se aplicável)

### Banco de Dados

- [ ] PostgreSQL configurado
- [ ] Migrations aplicadas
- [ ] Backups configurados
- [ ] Índices otimizados

### Monitoramento

- [ ] Logs configurados
- [ ] Health checks configurados
- [ ] Alertas de erro (opcional)

## Variáveis de Ambiente de Produção

### Obrigatórias

```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
GOOGLE_API_KEY="sua_chave"  # Ou outro provedor
NODE_ENV="production"
PORT="4000"
```

### Opcionais

```env
# Múltiplos provedores para fallback
ANTHROPIC_API_KEY="sua_chave"
OPENAI_API_KEY="sua_chave"

# Configurações avançadas
LOG_LEVEL="info"
CORS_ORIGIN="https://seu-dominio.com"
RATE_LIMIT="100"
```

## Troubleshooting de Deploy

### Erro: "Cannot find module"

```bash
# Reinstalar dependências
rm -rf node_modules
npm ci
```

### Erro: "Database connection failed"

```bash
# Verificar string de conexão
echo $DATABASE_URL

# Testar conexão
npx prisma db pull
```

### Erro: "Port already in use"

```bash
# Encontrar processo
sudo lsof -i :4000

# Matar processo
sudo kill -9 <PID>
```

### Frontend não carrega

```bash
# Verificar se build existe
ls -la dist/

# Rebuild
npm run build:web
```

### Erro 502 Bad Gateway (Nginx)

```bash
# Verificar se API está rodando
curl http://localhost:4000/api/entries

# Verificar logs do Nginx
sudo tail -f /var/log/nginx/error.log

# Verificar configuração
sudo nginx -t
```

## Backup e Restore

### PostgreSQL

```bash
# Backup
pg_dump -h localhost -U user -d diario_do_ser > backup.sql

# Restore
psql -h localhost -U user -d diario_do_ser < backup.sql
```

### SQLite (Desenvolvimento)

```bash
# Backup
cp dev.db dev.db.backup.$(date +%Y%m%d)

# Restore
cp dev.db.backup.YYYYMMDD dev.db
```

## Escalabilidade

### Horizontal (Múltiplas Instâncias)

```bash
# PM2 Cluster Mode
pm2 start src/server.ts -i max --name diario-api
```

### Load Balancing com Nginx

```nginx
upstream api_servers {
    server localhost:4000;
    server localhost:4001;
    server localhost:4002;
}

server {
    location /api {
        proxy_pass http://api_servers;
        # ... resto da config
    }
}
```

## CI/CD

### GitHub Actions (Exemplo)

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run harness
    
    - name: Build
      run: npm run build:web
    
    - name: Deploy to Railway
      uses: railway/cli-deploy@v1
      with:
        railway_token: ${{ secrets.RAILWAY_TOKEN }}
```

## Recursos Adicionais

- [Node.js Production Checklist](https://nodejs.org/en/docs/guides/production-checklist/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Nginx Beginner's Guide](https://nginx.org/en/docs/beginners_guide.html)
- [Railway Documentation](https://docs.railway.app/)
- [Render Docs](https://render.com/docs)

---

*Deployment Guide v1.0*
*Última atualização: Maio 2026*
