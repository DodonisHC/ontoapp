# AGENTS.md — Template de Contexto do Projeto

Coloque este arquivo na raiz do repositório.
O agente de IA lê automaticamente antes de qualquer tarefa.
Mantenha atualizado — é o "mapa" que o agente usa para navegar o projeto.

---

# [Nome do Projeto]

## Visão Geral

[1-3 frases descrevendo o que o sistema faz e para quem]

## Stack

| Camada | Tecnologia | Versão |
|---|---|---|
| Runtime | Node.js | 22.x |
| Linguagem | TypeScript | 5.x strict |
| Framework HTTP | Fastify | 5.x |
| Banco de dados | PostgreSQL | 16.x |
| ORM | Drizzle ORM | 0.x |
| Testes | Vitest | 2.x |
| Lint | ESLint + Prettier | — |
| Containerização | Docker + Compose | — |

## Bounded Contexts

Lista de contextos delimitados e suas responsabilidades:

| Pasta | Responsabilidade |
|---|---|
| `src/identity/` | Autenticação, usuários, sessões |
| `src/billing/` | Planos, cobranças, pagamentos |
| `src/orders/` | Pedidos, itens, fulfillment |
| `src/shared/` | Utilitários compartilhados (erros, logger, db client) |

## Estrutura de Arquivos

```
.
├── AGENTS.md                    ← você está aqui
├── src/
│   ├── [contexto]/
│   │   ├── [contexto].model.ts
│   │   ├── [contexto].service.ts
│   │   ├── [contexto].repository.ts
│   │   ├── [contexto].handler.ts
│   │   └── [contexto].test.ts
│   └── shared/
│       ├── errors.ts
│       ├── logger.ts
│       └── db.ts
├── docs/
│   └── canvas/                  ← REASONS Canvas de cada contexto
├── migrations/                  ← migrações do banco
└── package.json
```

## Convenções de Código

### Nomenclatura
- Arquivos: `contexto.responsabilidade.ts` (ex: `billing.service.ts`)
- Tipos: `PascalCase` (ex: `BillingPlan`)
- Funções/variáveis: `camelCase` (ex: `createBillingPlan`)
- Constantes: `SCREAMING_SNAKE_CASE` (ex: `MAX_RETRY_COUNT`)
- Tabelas do banco: `snake_case` plural (ex: `billing_plans`)

### TypeScript
- `strict: true` no tsconfig — obrigatório
- Sem `any` — use `unknown` com narrowing
- Exports nomeados (sem `export default` exceto em config)
- Prefira `type` a `interface` para tipos de dados

### Erros
- Classes de erro tipadas em `src/shared/errors.ts`
- Nunca `throw new Error('string')` nos serviços
- Handlers convertem erros de domínio para respostas HTTP

### Testes
- Um arquivo por módulo: `[contexto].test.ts`
- Services: mocked repository
- Repositories: banco real em memória (SQLite) ou test containers
- Handlers: supertest ou Fastify inject

## Harness

```bash
npm run harness   # typecheck + lint + test (deve passar antes de todo commit)
npm run typecheck # tsc --noEmit
npm run lint      # eslint src --max-warnings 0
npm run test      # vitest --run
```

**Regra:** `npm run harness` deve estar verde antes de qualquer commit.

## SPDD

Os REASONS Canvas ficam em `docs/canvas/[contexto].canvas.md`.
Antes de modificar código de um contexto, leia o canvas correspondente.
Após refatoração manual, rode `/spdd-sync` para atualizar o canvas.

## O que NÃO fazer

- Não criar interfaces para repositórios sem necessidade real
- Não adicionar DTOs entre camadas internas do mesmo contexto
- Não usar `any` — nunca
- Não importar de um bounded context para outro diretamente (use `shared/` ou eventos)
- Não modificar migrations existentes — sempre crie uma nova
- Não commitar com `npm run harness` falhando
