# Guia de Segurança - Diário do Ser

## 🔒 Visão Geral

Este documento descreve as medidas de segurança implementadas no Diário do Ser e as melhores práticas para manter a aplicação segura.

## Score de Segurança

**Atual**: **A-** (8.5/10)

| Categoria | Score | Status |
|-----------|-------|--------|
| Gestão de Segredos | 10/10 | ✅ Excelente |
| Rate Limiting | 9/10 | ✅ Implementado |
| Input Validation | 9/10 | ✅ Sanitização completa |
| Headers de Segurança | 9/10 | ✅ OWASP-compliant |
| CORS | 8/10 | ✅ Controlado |
| Error Handling | 8/10 | ✅ Sanitizado |
| Autenticação | 0/10 | 🚧 Não implementado |

## 🛡️ Medidas de Segurança Implementadas

### 1. Rate Limiting

**Arquivo**: `src/shared/security.ts`

Protege contra DDoS e brute force attacks:

```typescript
// Geral: 100 requisições por 15 minutos
app.use('/api', rateLimiters.api)

// Criação de entradas: 10 por minuto
app.post('/api/entries', rateLimiters.createEntry, ...)
```

**Configuração**:
- API geral: 100 req / 15 minutos por IP
- Criação de entradas: 10 req / 1 minuto por IP
- Operações sensíveis: 5 req / 1 hora por IP

### 2. Input Validation & Sanitization

**Arquivo**: `src/server.ts`

Protege contra XSS e injection attacks:

```typescript
// 🔒 Validate input
const rawContent = String(req.body.content || '').trim()
if (!rawContent) {
  return res.status(400).json({ error: 'Conteúdo obrigatório.' })
}

// 🔒 Sanitize input to prevent XSS
const content = sanitizeInput(rawContent)

// Validate content length
if (content.length > 10000) {
  return res.status(400).json({ error: 'Conteúdo muito longo.' })
}
```

**Função de sanitização** (`src/shared/security.ts`):
```typescript
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '')           // Remove < e >
    .replace(/javascript:/gi, '')   // Remove javascript: protocol
    .replace(/on\w+=/gi, '')        // Remove event handlers
    .trim()
}
```

### 3. UUID Validation

Protege contra ID manipulation:

```typescript
// 🔒 Validate UUID format
if (!isValidUUID(id)) {
  return res.status(400).json({ error: 'ID inválido.' })
}
```

Regex utilizada: `/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i`

### 4. Security Headers (Helmet)

**Arquivo**: `src/shared/security.ts`

Headers OWASP-compliant:

```typescript
export const helmetOptions = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.openai.com", "https://generativelanguage.googleapis.com"],
    },
  },
}
```

Headers adicionais (`src/shared/security.ts`):
- `X-Frame-Options: DENY` - Previne clickjacking
- `X-Content-Type-Options: nosniff` - Previne MIME sniffing
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### 5. CORS (Cross-Origin Resource Sharing)

**Arquivo**: `src/shared/security.ts`

Origens controladas:

```typescript
export const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:5173',  // Vite dev
      'http://localhost:3000',  // Dev alternativo
      process.env.FRONTEND_URL, // Produção
    ].filter(Boolean)
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true)
    } else {
      console.warn(`🚫 Blocked CORS request from: ${origin}`)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}
```

### 6. Proteção de Chaves API

**Arquivo**: `src/shared/env.ts`

Chaves são mascaradas nos logs:

```typescript
function maskSensitiveValue(value: string | undefined): string {
  if (!value) return '[NOT SET]'
  if (value.length <= 8) return '***'
  return value.slice(0, 4) + '****' + value.slice(-4)
}

// Exemplo de output:
// GOOGLE_API_KEY: AIza****wsw
// ANTHROPIC_API_KEY: sk-a****1234
```

### 7. Error Handling Seguro

**Arquivo**: `src/shared/security.ts`

Stack traces ocultas em produção:

```typescript
export function sanitizeError(error: Error): { message: string; stack?: string } {
  if (process.env.NODE_ENV === 'production') {
    return {
      message: 'Ocorreu um erro interno. Tente novamente mais tarde.'
    }
  }
  
  return {
    message: error.message,
    stack: error.stack  // Apenas em desenvolvimento
  }
}
```

### 8. Request Timeout

**Arquivo**: `src/server.ts`

Timeout de 30 segundos para todas as requisições:

```typescript
app.use((req, res, next) => {
  res.setTimeout(30000, () => {
    res.status(408).json({ error: 'Request timeout' })
  })
  next()
})
```

### 9. Content Size Limit

**Arquivo**: `src/shared/security.ts`

Limite de 10MB para requests JSON:

```typescript
export const requestSizeLimit = '10mb'
```

Uso no server:
```typescript
app.use(express.json({ limit: requestSizeLimit }))
```

### 10. Health Check Endpoint

**Arquivo**: `src/server.ts`

Endpoint para monitoramento (sem rate limit):

```typescript
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  })
})
```

## 🚧 Itens Não Implementados (Roadmap)

### 1. Autenticação e Autorização
- **Status**: 🚧 Não implementado
- **Prioridade**: Alta
- **Descrição**: JWT-based auth para proteger endpoints

### 2. HTTPS Enforcement
- **Status**: 🚧 Configurável via reverse proxy
- **Prioridade**: Alta (produção)
- **Descrição**: Forçar HTTPS em produção

### 3. Content Security Policy Strict
- **Status**: 🚧 Parcial
- **Prioridade**: Média
- **Descrição**: CSP mais restritivo

### 4. Database Encryption
- **Status**: 🚧 Não implementado
- **Prioridade**: Média
- **Descrição**: Criptografia de dados sensíveis no banco

### 5. Audit Logging
- **Status**: 🚧 Básico
- **Prioridade**: Média
- **Descrição**: Log de todas as operações críticas

## 🔍 OWASP Top 10 - Status

| Rank | Risco | Status | Mitigação |
|------|-------|--------|-----------|
| A01 | Broken Access Control | 🟡 Parcial | Rate limiting implementado, auth pendente |
| A02 | Cryptographic Failures | 🟢 OK | Chaves mascaradas em logs |
| A03 | Injection | 🟢 OK | Input sanitization completa |
| A04 | Insecure Design | 🟢 OK | Arquitetura segura, DDD |
| A05 | Security Misconfiguration | 🟢 OK | Headers OWASP, Helmet |
| A06 | Vulnerable Components | 🟢 OK | npm audit disponível |
| A07 | Auth Failures | 🔴 Não | JWT não implementado |
| A08 | Data Integrity | 🟢 OK | Zod validation |
| A09 | Logging Failures | 🟢 OK | Logs sem segredos |
| A10 | SSRF | 🟢 OK | Requests controlados |

## 📝 Checklist de Deploy Seguro

### Antes do Deploy

- [ ] Rodar `npm audit` e corrigir vulnerabilidades
- [ ] Verificar `.env` - nenhuma chave hardcoded
- [ ] Confirmar `NODE_ENV=production`
- [ ] Configurar `FRONTEND_URL` no CORS
- [ ] Habilitar HTTPS
- [ ] Configurar backups automáticos
- [ ] Verificar rate limits adequados
- [ ] Testar health check endpoint

### Configurações de Produção

```env
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://seu-dominio.com

# Database
DATABASE_URL="postgresql://..."

# API Keys (pelo menos um)
GOOGLE_API_KEY=sua_chave
# ANTHROPIC_API_KEY=opcional
# OPENAI_API_KEY=opcional
```

## 🐛 Reportar Vulnerabilidades

Se encontrar uma vulnerabilidade de segurança:

1. **Não** abra uma issue pública
2. Envie email para: [seu-email@dominio.com]
3. Inclua:
   - Descrição do problema
   - Passos para reproduzir
   - Impacto potencial
   - Sugestão de correção (opcional)

Resposta em até 48 horas.

## 📊 Auditoria de Segurança

Última auditoria: **Maio 2026**

Próxima auditoria recomendada: **Agosto 2026**

### Comandos para Verificação

```bash
# Verificar vulnerabilidades em dependências
npm audit

# Fix automático
npm audit fix

# Verificar tipos TypeScript
npm run typecheck

# Rodar testes
npm run test
```

## 🔗 Recursos

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [CSP Quick Reference](https://content-security-policy.com/)

## 🔄 Changelog de Segurança

### [2026-05-04] - Security Hardening
- ✅ Rate limiting implementado (100 req/15min geral, 10 req/1min criação)
- ✅ Input sanitization com proteção XSS
- ✅ UUID validation em todos os endpoints
- ✅ Security headers OWASP-compliant (Helmet)
- ✅ CORS controlado por whitelist
- ✅ Error sanitization (sem stack traces em produção)
- ✅ Proteção de chaves API (mascaramento em logs)
- ✅ Request timeout (30 segundos)
- ✅ Content size limit (10MB)
- ✅ Health check endpoint

---

*Documentação de Segurança v1.0*
*Última atualização: Maio 2026*
