# Guia de Desenvolvimento - Diário do Ser

## Requisitos

- **Node.js**: 20.0.0 ou superior
- **npm**: 10.0.0 ou superior (vem com Node.js)
- **Git**: Para versionamento

## Setup do Ambiente

### 1. Clonar o Repositório

```bash
git clone https://github.com/DodonisHC/ontoapp.git
cd ontoapp
```

### 2. Instalar Dependências

```bash
npm install
```

Isso instala todas as dependências do projeto, incluindo:
- React + Vite (frontend)
- Express + tipos (backend)
- Prisma + cliente
- Provedores de IA (Anthropic, Google, OpenAI)
- Ferramentas de desenvolvimento (Vitest, ESLint, TypeScript)

### 3. Configurar Variáveis de Ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Banco de dados (obrigatório)
DATABASE_URL="file:./dev.db"

# Pelo menos um provedor de IA (recomendamos Google Gemini - grátis)
GOOGLE_API_KEY=sua_chave_aqui

# Opcionais
ANTHROPIC_API_KEY=sua_chave_claude
OPENAI_API_KEY=sua_chave_openai
```

> 💡 **Dica**: Comece apenas com `DATABASE_URL` e `GOOGLE_API_KEY` (grátis). Veja o [AI_PROVIDERS_GUIDE.md](./AI_PROVIDERS_GUIDE.md) para mais opções.

### 4. Inicializar o Banco de Dados

```bash
npx prisma migrate dev
```

Isso cria o banco SQLite e aplica as migrations.

### 5. Verificar Instalação

```bash
npm run typecheck
npm run test
```

Todos os testes devem passar.

## Fluxo de Desenvolvimento

### Iniciar Servidor de Desenvolvimento

Você precisa de **dois terminais**:

**Terminal 1 - Backend:**
```bash
npm run dev:api
```

**Terminal 2 - Frontend:**
```bash
npm run dev:web
```

Acesse: http://localhost:5173

### Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev:api` | Inicia backend com hot reload (porta 4000) |
| `npm run dev:web` | Inicia frontend Vite (porta 5173) |
| `npm run start:api` | Inicia backend em modo produção |
| `npm run build:web` | Compila frontend para produção |
| `npm run preview:web` | Preview da build de produção |
| `npm run test` | Executa testes Vitest |
| `npm run test:ui` | Executa testes com UI do Vitest |
| `npm run typecheck` | Verifica tipos TypeScript |
| `npm run lint` | Executa ESLint |
| `npm run harness` | Validação completa (typecheck + lint + test) |

### Fluxo de Trabalho Típico

```
1. Criar feature branch
   git checkout -b feature/nome-da-feature

2. Desenvolver
   - Editar código
   - Testar manualmente
   - Escrever/atualizar testes

3. Verificar qualidade
   npm run harness

4. Commit
   git add .
   git commit -m "feat: descrição da feature"

5. Push e PR
   git push origin feature/nome-da-feature
```

## Estrutura de Código

### Convenções de Nomenclatura

| Elemento | Convenção | Exemplo |
|----------|-----------|---------|
| Arquivos | kebab-case | `journal.service.ts` |
| Classes | PascalCase | `JournalService` |
| Interfaces | PascalCase | `JournalEntry` |
| Funções | camelCase | `createEntry()` |
| Variáveis | camelCase | `journalEntries` |
| Constantes | UPPER_SNAKE_CASE (se exportada) | `MAX_ENTRIES` |
| Tipos | PascalCase | `AIProvider` |

### Estrutura de Arquivos por Domínio

```
src/journal/
├── journal.model.ts          # Tipos/interfaces
├── journal.service.ts       # Lógica de negócio
├── journal.repository.ts    # Acesso a dados
└── __tests__/
    └── journal.service.test.ts
```

### Padrões de Código

#### 1. Services

Responsabilidade: Orquestração de regras de negócio

```typescript
// journal.service.ts
export class JournalService {
  private repository = new JournalRepository()

  async createEntry(content: string): Promise<JournalEntry> {
    if (!content.trim()) {
      throw new Error('Content is required')
    }
    return this.repository.createEntry(content)
  }
}
```

#### 2. Repositories

Responsabilidade: Abstração da camada de dados

```typescript
// journal.repository.ts
export class JournalRepository {
  private prisma = new PrismaClient()

  async createEntry(content: string): Promise<JournalEntry> {
    const entry = await this.prisma.journalEntry.create({
      data: { content }
    })
    return this.mapToDomain(entry)
  }

  private mapToDomain(prismaEntry: PrismaEntry): JournalEntry {
    return {
      id: prismaEntry.id,
      content: prismaEntry.content,
      createdAt: prismaEntry.createdAt
    }
  }
}
```

#### 3. Modelos/Types

```typescript
// journal.model.ts ou shared/types.ts
export type JournalEntry = {
  id: string
  content: string
  createdAt: Date
  insight?: Insight
}
```

### Importações

#### Ordenação

```typescript
// 1. Bibliotecas externas (alfabético)
import express from 'express'
import { z } from 'zod'

// 2. Imports internos (alfabético)
import { InsightService } from '../insight/insight.service'
import { JournalRepository } from './journal.repository'

// 3. Tipos (alfabético)
import type { JournalEntry } from './journal.model'
```

#### Caminhos

```typescript
// ✅ Correto: Sem extensão .ts
import { JournalService } from './journal.service'

// ❌ Errado: Com extensão .ts
import { JournalService } from './journal.service.ts'
```

## Testes

### Estrutura de Testes

```
src/
├── journal/
│   └── __tests__/
│       └── journal.service.test.ts
├── insight/
│   └── __tests__/
│       └── insight.service.test.ts
```

### Escrevendo Testes

```typescript
import { describe, it, expect, vi } from 'vitest'
import { JournalService } from '../journal.service'

// Mock de dependências
vi.mock('../journal.repository', () => ({
  JournalRepository: vi.fn(() => ({
    createEntry: vi.fn(() => Promise.resolve({
      id: '123',
      content: 'Test',
      createdAt: new Date()
    }))
  }))
}))

describe('JournalService', () => {
  let service: JournalService

  beforeEach(() => {
    service = new JournalService()
  })

  describe('createEntry', () => {
    it('should create entry with valid content', async () => {
      const entry = await service.createEntry('Hello World')
      
      expect(entry).toBeDefined()
      expect(entry.content).toBe('Hello World')
      expect(entry.id).toBeDefined()
    })

    it('should throw error for empty content', async () => {
      await expect(service.createEntry(''))
        .rejects.toThrow('Content is required')
    })
  })
})
```

### Executando Testes

```bash
# Todos os testes
npm run test

# Modo watch (re-executa ao salvar)
npm run test -- --watch

# Com UI
npm run test:ui

# Apenas um arquivo
npm run test -- src/journal/__tests__/journal.service.test.ts

# Com coverage
npm run test -- --coverage
```

### Mocks

#### Mock de Provedores IA

```typescript
vi.mock('../../shared/ai.provider-factory', () => ({
  AIProviderFactory: {
    createClient: vi.fn(() => ({
      generateInsight: vi.fn(() => Promise.resolve({
        provider: 'gemini',
        enneagramType: 4,
        confidence: 'high',
        ontologicalPhrase: 'Test phrase',
        observation: 'Test observation',
        readingSuggestion: {
          title: 'Test Book',
          author: 'Test Author',
          reason: 'Test reason'
        },
        rawAnalysis: '{}'
      }))
    })),
    getDefaultProvider: vi.fn(() => 'gemini')
  }
}))
```

## Debugging

### Backend (VS Code)

Crie `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug API",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev:api"],
      "envFile": "${workspaceFolder}/.env",
      "console": "integratedTerminal"
    }
  ]
}
```

### Frontend (Chrome DevTools)

1. Execute `npm run dev:web`
2. Abra http://localhost:5173
3. Pressione F12 para DevTools
4. Use a aba "Sources" para breakpoints

### Logs

```typescript
// Log estruturado
console.log('[JournalService] Creating entry:', { content })

// Log de erro
console.error('[InsightService] Failed to generate:', error)

// Log de debug (remover em produção)
console.debug('[AIProviderFactory] Available providers:', providers)
```

## Prisma ORM

### Comandos Úteis

```bash
# Abrir Studio (UI para banco)
npx prisma studio

# Gerar cliente após mudanças no schema
npx prisma generate

# Criar migration
npx prisma migrate dev --name nome_da_migration

# Resetar banco (cuidado!)
npx prisma migrate reset

# Seed de dados (se implementado)
npx prisma db seed
```

### Schema

Local: `prisma/schema.prisma`

### Acessar Dados

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Create
await prisma.journalEntry.create({ data: { content: 'Hello' } })

// Read
await prisma.journalEntry.findMany()
await prisma.journalEntry.findUnique({ where: { id: 'uuid' } })

// Update
await prisma.journalEntry.update({
  where: { id: 'uuid' },
  data: { content: 'Updated' }
})

// Delete
await prisma.journalEntry.delete({ where: { id: 'uuid' } })
```

## Variáveis de Ambiente

### Desenvolvimento

```env
DATABASE_URL="file:./dev.db"
GOOGLE_API_KEY="sua_chave"
```

### Teste

Crie `.env.test` (opcional):

```env
DATABASE_URL="file:./test.db"
```

### Produção

```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
GOOGLE_API_KEY="sua_chave"
ANTHROPIC_API_KEY="sua_chave"
OPENAI_API_KEY="sua_chave"
PORT=4000
```

## Docker (Opcional)

> 🚧 **Planejado**: Dockerfile e docker-compose.yml serão adicionados.

```dockerfile
# Dockerfile (exemplo futuro)
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:web
EXPOSE 4000
CMD ["npm", "run", "start:api"]
```

## Troubleshooting

### Erro: "Cannot find module"

```bash
# Limpar cache
rm -rf node_modules
rm package-lock.json
npm install
```

### Erro: "Database does not exist"

```bash
# Resetar banco
npx prisma migrate reset
```

### Erro: "Type check failed"

```bash
# Ver tipos manualmente
npx tsc --noEmit

# Ver com mais detalhes
npx tsc --noEmit --pretty
```

### Erro: "Port already in use"

```bash
# Linux/Mac
lsof -ti:4000 | xargs kill -9
lsof -ti:5173 | xargs kill -9

# Windows (PowerShell)
Get-NetTCPConnection -LocalPort 4000 | ForEach-Object { Stop-Process -Id $_.OwningProcess }
```

### Hot Reload Não Funciona

```bash
# Reiniciar servidores
# Terminal 1
Ctrl+C
npm run dev:api

# Terminal 2
Ctrl+C
npm run dev:web
```

## VS Code Extensions Recomendadas

- **ESLint** - Linting integrado
- **Prettier** - Formatação automática
- **Prisma** - Syntax highlighting para schema
- **Vitest** - Runner de testes integrado
- **TypeScript Importer** - Auto-imports

## Git Workflow

### Branches

- `main` - Produção (protegida)
- `develop` - Desenvolvimento (opcional)
- `feature/*` - Novas features
- `fix/*` - Correções de bugs
- `docs/*` - Documentação

### Commits

Seguindo [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add user authentication
fix: resolve database connection issue
docs: update API documentation
refactor: simplify insight service
test: add unit tests for journal service
chore: update dependencies
```

### Pull Requests

1. Crie branch: `git checkout -b feature/nome`
2. Desenvolva e teste
3. Commit: `git commit -m "feat: ..."`
4. Push: `git push origin feature/nome`
5. Abra PR no GitHub
6. Aguarde review
7. Merge para `main`

## Recursos Adicionais

- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Vitest Guide](https://vitest.dev/guide/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

---

*Development Guide v1.0*
*Última atualização: Maio 2026*
