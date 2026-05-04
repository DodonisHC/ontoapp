# Arquitetura do Sistema - Diário do Ser

## Visão Geral

O Diário do Ser é uma aplicação web full-stack com arquitetura modular baseada em **Domain-Driven Design (DDD)** e **Clean Architecture**. O sistema é dividido em domínios bem definidos com responsabilidades claras.

## Stack Tecnológico

| Camada | Tecnologia |
|--------|-----------|
| **Runtime** | Node.js 20+ |
| **Linguagem** | TypeScript 5.x (strict) |
| **Frontend** | Vite + React 18 |
| **Backend** | Express.js |
| **Banco** | SQLite (dev) / PostgreSQL (prod) |
| **ORM** | Prisma 5.x |
| **IA** | Multi-provedor (Claude, Gemini, OpenAI) |
| **Validação** | Zod |
| **Testes** | Vitest |

## Arquitetura de Alto Nível

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENTE (Browser)                     │
│              React + Vite (Porta 5173)                 │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP / REST
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  BACKEND (Express)                       │
│              API REST (Porta 4000)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │  /journal   │  │  /insight   │  │  /enneagram     │  │
│  │   Routes    │  │   Routes    │  │   Routes        │  │
│  └──────┬──────┘  └──────┬──────┘  └─────────────────┘  │
│         │                │                              │
│  ┌──────▼──────┐  ┌──────▼──────┐                       │
│  │  Service    │  │  Service    │                       │
│  │  Layer      │  │  Layer      │                       │
│  └──────┬──────┘  └──────┬──────┘                       │
│         │                │                              │
│  ┌──────▼──────┐  ┌──────▼──────┐                       │
│  │ Repository  │  │ Repository  │  ┌─────────────────┐    │
│  │   (Prisma)  │  │   (Prisma)  │  │ AI Providers    │    │
│  └──────┬──────┘  └──────┬──────┘  │ (Factory)       │    │
└─────────┼────────────────┼──────────┴────────┬────────┘────┘
          │                │                 │
          ▼                ▼                 ▼
┌─────────────────────────────────────────────────────────┐
│                    DATA LAYER                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │   SQLite    │  │   Prisma    │  │   AI Clients    │  │
│  │   (Local)   │  │   ORM       │  │ (Claude/Gemini/ │  │
│  │             │  │             │  │   OpenAI)       │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Bounded Contexts (Domínios)

### 1. Journal Domain (`src/journal/`)
**Responsabilidade**: Gerenciamento de entradas do diário

```
journal/
├── journal.model.ts          # Tipos e interfaces
├── journal.service.ts       # Lógica de negócio
├── journal.repository.ts    # Acesso a dados
└── __tests__/               # Testes unitários
```

**Entidades Principais**:
- `JournalEntry`: Entrada do diário com conteúdo e metadata

**Operações**:
- `createEntry(content: string)`: Cria nova entrada
- `listEntries(limit?: number)`: Lista entradas recentes
- `getEntryById(id: string)`: Recupera entrada específica

### 2. Insight Domain (`src/insight/`)
**Responsabilidade**: Geração e persistência de insights via IA

```
insight/
├── insight.service.ts        # Orquestração de IA
├── insight.repository.ts     # Persistência de insights
└── __tests__/               # Testes
```

**Entidades Principais**:
- `Insight`: Análise gerada pela IA (tipo Eneagrama, frase ontológica, etc.)

**Operações**:
- `generateInsight(content: string, provider?): Promise<Insight>`
- `saveInsight(entryId: string, insight: Insight): Promise<Insight>`

**Padrão de Design**: Factory Pattern com Fallback

### 3. Enneagram Domain (`src/enneagram/`)
**Responsabilidade**: Dados e lógica dos 9 tipos do Eneagrama

```
enneagram/
├── types.ts                 # Tipos do Eneagrama
└── data/                    # Dados dos tipos
```

**Tipos**:
- 1: Perfeccionista
- 2: Auxiliador
- 3: Realizador
- 4: Individualista
- 5: Observador
- 6: Questionador
- 7: Entusiasta
- 8: Desafiador
- 9: Pacificador

### 4. Shared Kernel (`src/shared/`)
**Responsabilidade**: Recursos compartilhados entre domínios

```
shared/
├── types.ts                 # Tipos globais (AIProvider, Insight, etc.)
├── env.ts                   # Validação de ambiente
├── ai.provider-factory.ts  # Factory de provedores IA
├── gemini.client.ts        # Cliente Google Gemini
├── openai.client.ts        # Cliente OpenAI
├── claude.client.ts        # Cliente Anthropic
└── claude.prompts.ts       # Prompts para Claude
```

## Fluxo de Dados

### Criar Entrada com Insight

```
1. Frontend POST /api/entries
   │
   ▼
2. Backend valida content
   │
   ▼
3. JournalService.createEntry()
   │
   ▼
4. InsightService.generateInsight()
   │
   ├── AIProviderFactory.getDefaultProvider()
   │   └── Retorna: 'claude' | 'gemini' | 'openai'
   │
   ├── AIProviderFactory.createClient(provider)
   │   └── Retorna: Cliente específico
   │
   └── client.generateInsight(content)
       ├── Chama API externa (Claude/Gemini/OpenAI)
       ├── Parseia resposta JSON
       └── Valida com Zod schema
   │
   ▼
5. InsightRepository.saveInsight()
   │
   ▼
6. Retorna Entry + Insight para Frontend
```

### Listar Entradas

```
1. Frontend GET /api/entries
   │
   ▼
2. Backend chama JournalService.listEntries()
   │
   ▼
3. Repository faz query via Prisma
   │
   ├── SELECT * FROM JournalEntry
   └── JOIN com Insight (se existir)
   │
   ▼
4. Mapeia resultado para JournalEntry[]
   │
   ▼
5. Retorna JSON para Frontend
```

## Padrões de Design

### 1. Repository Pattern
**Uso**: `journal.repository.ts`, `insight.repository.ts`

**Benefícios**:
- Abstração da camada de dados
- Facilidade para testes (mocking)
- Troca de implementação (SQLite → PostgreSQL)

```typescript
// Interface
interface JournalRepository {
  createEntry(content: string): Promise<JournalEntry>
  listEntries(limit?: number): Promise<JournalEntry[]>
  getEntryById(id: string): Promise<JournalEntry | null>
}
```

### 2. Service Layer
**Uso**: `journal.service.ts`, `insight.service.ts`

**Benefícios**:
- Lógica de negócio isolada
- Orquestração entre repositórios
- Reutilização entre endpoints

### 3. Factory Pattern
**Uso**: `ai.provider-factory.ts`

**Benefícios**:
- Criação dinâmica de clientes IA
- Fallback automático entre provedores
- Extensibilidade (fácil adicionar novo provedor)

```typescript
class AIProviderFactory {
  static createClient(provider: AIProvider): AIProviderClient
  static getDefaultProvider(): AIProvider
  static getAvailableProviders(): AIProvider[]
}
```

### 4. Adapter Pattern
**Uso**: Clientes IA (Claude, Gemini, OpenAI)

**Benefícios**:
- Interface unificada `AIProviderClient`
- Cada cliente adapta sua API específica
- Troca transparente de provedor

```typescript
interface AIProviderClient {
  generateInsight(content: string): Promise<Omit<Insight, 'id' | 'journalEntryId' | 'createdAt'>>
}

class GeminiClient implements AIProviderClient { ... }
class OpenAIClient implements AIProviderClient { ... }
class ClaudeAdapter implements AIProviderClient { ... }
```

## Estrutura de Dados

### Prisma Schema (Simplificado)

```prisma
model JournalEntry {
  id        String   @id @default(uuid())
  content   String
  createdAt DateTime @default(now())
  insight   Insight?
}

model Insight {
  id                  String   @id @default(uuid())
  journalEntryId      String   @unique
  journalEntry        JournalEntry @relation(fields: [journalEntryId], references: [id])
  
  // Campos de análise
  enneagramType       Int      // 1-9
  confidence          String   // 'low' | 'medium' | 'high'
  ontologicalPhrase   String
  observation         String
  readingSuggestion   String   // JSON
  rawAnalysis         String
  
  createdAt           DateTime @default(now())
}
```

### Tipos TypeScript Principais

```typescript
// src/shared/types.ts

type AIProvider = 'claude' | 'gemini' | 'openai'

type EnneagramType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

type Insight = {
  id: string
  journalEntryId: string
  provider: AIProvider
  enneagramType: EnneagramType
  confidence: 'low' | 'medium' | 'high'
  ontologicalPhrase: string
  observation: string
  readingSuggestion: {
    title: string
    author: string
    reason: string
  }
  rawAnalysis: string
  createdAt: Date
}

type JournalEntry = {
  id: string
  content: string
  createdAt: Date
  insight?: Insight
}
```

## Segurança

### Validação de Ambiente
**Arquivo**: `src/shared/env.ts`

```typescript
const envSchema = z.object({
  ANTHROPIC_API_KEY: z.string().min(1).optional(),
  GOOGLE_API_KEY: z.string().min(1).optional(),
  OPENAI_API_KEY: z.string().min(1).optional(),
  DATABASE_URL: z.string().url(),
})
```

### Validação de Respostas IA
**Arquivo**: Clientes IA (gemini.client.ts, openai.client.ts, etc.)

```typescript
const schema = z.object({
  enneagramType: z.number().int().min(1).max(9),
  confidence: z.enum(['low', 'medium', 'high']),
  ontologicalPhrase: z.string(),
  observation: z.string(),
  readingSuggestion: z.object({
    title: z.string(),
    author: z.string(),
    reason: z.string(),
  }),
})
```

## Performance

### Otimizações Implementadas

1. **Lazy Loading de Clientes IA**: Clientes só são instanciados quando necessários
2. **Caching de Ambiente**: Validação de env só executa uma vez
3. **Connection Pooling**: Prisma gerencia conexões automaticamente

### Possíveis Melhorias

1. **Cache de Insights**: Evitar re-análise de conteúdo idêntico
2. **Rate Limiting**: Controle de requisições por usuário
3. **Batch Processing**: Processar múltiplas entradas em lote

## Escalabilidade

### Horizontal
- **Stateless API**: Servidor Express não mantém estado
- **Banco**: Fácil migração SQLite → PostgreSQL
- **IA**: Fallback automático entre provedores

### Vertical
- **Code Splitting**: Vite divide bundles automaticamente
- **Lazy Loading**: Componentes React carregados sob demanda

## Decisões Arquiteturais

### 1. Por que Multi-Provider IA?
**Problema**: Dependência de único provedor = ponto de falha único + custo fixo

**Solução**: Factory pattern com fallback
- **Benefício**: Máxima disponibilidade, custo controlado
- **Trade-off**: Complexidade adicional no código

### 2. Por que DDD (Domain-Driven Design)?
**Problema**: Código monolítico difícil de manter

**Solução**: Separação por domínios (journal, insight, enneagram)
- **Benefício**: Código modular, testável, escalável
- **Trade-off**: Mais arquivos e pastas

### 3. Por que SQLite para Dev?
**Problema**: Setup complexo para novos desenvolvedores

**Solução**: SQLite (zero config) + Prisma (abstração)
- **Benefício**: Setup instantâneo, migração fácil para PostgreSQL
- **Trade-off**: Não serve para produção com muitos usuários

## Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                              │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                     React                            │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │  Journal   │  │   Entry     │  │   Insight    │  │  │
│  │  │   List     │  │   Form      │  │   Display    │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │  │
│  │  ┌─────────────┐  ┌─────────────┐                  │  │
│  │  │   API       │  │   Types     │                  │  │
│  │  │   Client    │  │   (shared)  │                  │  │
│  │  └─────────────┘  └─────────────┘                  │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST
                            ▼
┌─────────────────────────────────────────────────────────┐
│                      BACKEND                               │
│  ┌─────────────────────────────────────────────────────┐  │
│  │                    Express API                       │  │
│  │                                                     │  │
│  │  GET    /api/entries        → listEntries()         │  │
│  │  GET    /api/entries/:id    → getEntryById()        │  │
│  │  POST   /api/entries        → createEntry()         │  │
│  │                                                     │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │  Journal    │  │   Insight   │  │   Shared    │  │  │
│  │  │  Service    │  │   Service   │  │   Kernel    │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │  │
│  │                                                     │  │
│  │  ┌─────────────┐  ┌─────────────┐                  │  │
│  │  │  Journal    │  │   Insight   │                  │  │
│  │  │ Repository  │  │ Repository  │                  │  │
│  │  └─────────────┘  └─────────────┘                  │  │
│  │                                                     │  │
│  │  ┌─────────────────────────────────────────────┐     │  │
│  │  │        AI Provider Factory                 │     │  │
│  │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐     │     │  │
│  │  │  │ Claude  │ │ Gemini  │ │ OpenAI  │     │     │  │
│  │  │  │ Client  │ │ Client  │ │ Client  │     │     │  │
│  │  │  └─────────┘ └─────────┘ └─────────┘     │     │  │
│  │  └─────────────────────────────────────────────┘     │  │
│  └─────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐
│   SQLite    │     │   Prisma    │     │  External APIs  │
│   (Local)   │     │   ORM       │     │  (Claude/Gemini/│
│             │     │             │     │   OpenAI)       │
└─────────────┘     └─────────────┘     └─────────────────┘
```

## Referências

- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html) - Martin Fowler
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html) - Martin Fowler
- [Factory Pattern](https://refactoring.guru/design-patterns/factory-method) - Refactoring Guru
- [Prisma Best Practices](https://www.prisma.io/docs/guides/best-practices) - Prisma Docs

## Próximos Passos

1. **Cache Layer**: Adicionar Redis para cache de insights
2. **Authentication**: Implementar JWT para multi-usuário
3. **Rate Limiting**: Proteger APIs de abuso
4. **Monitoring**: Adicionar logs estruturados e métricas

---

*Documentação da Arquitetura v1.0*
*Última atualização: Maio 2026*
