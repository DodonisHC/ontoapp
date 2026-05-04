# Topologias de Harness

Padrões comuns de harness por tipo de projeto.
O agente consulta este arquivo para escolher a topologia adequada.

---

## Topologia 1: API REST + Banco Relacional (mais comum)

**Quando usar:** APIs HTTP com PostgreSQL/SQLite, projetos CRUD, SaaS backends.

```
Handler (Fastify route)
  ↓ valida entrada (Zod)
Service (lógica de negócio)
  ↓ usa tipos do model
Repository (Drizzle/Prisma)
  ↓
Banco (PostgreSQL)
```

**Harness mínimo:**
```bash
tsc --noEmit        # tipos
eslint src          # estilo
vitest --run        # lógica de negócio (unit) + integração (repository)
```

**Arquivo de teste padrão:**
```typescript
// billing.test.ts
import { describe, it, expect, vi } from 'vitest'
import { BillingService } from './billing.service'

const mockRepo = {
  findById: vi.fn(),
  create: vi.fn(),
}

describe('BillingService', () => {
  const svc = new BillingService(mockRepo)

  it('deve criar plano com dados válidos', async () => {
    mockRepo.create.mockResolvedValue({ id: '1', nome: 'Pro' })
    const result = await svc.criarPlano({ nome: 'Pro' })
    expect(result.id).toBe('1')
  })
})
```

---

## Topologia 2: Worker / Processador de Filas

**Quando usar:** Consumidores de mensagens (SQS, RabbitMQ, BullMQ), jobs assíncronos.

```
Queue Consumer (handler)
  ↓ deserializa + valida (Zod)
Service (lógica de negócio)
  ↓
Repository + Side effects (email, webhook, etc.)
```

**Harness adicional:**
```bash
# Testa o fluxo completo com fila em memória
vitest --run src/**/*.queue.test.ts
```

**Sensor extra:** dead-letter queue monitoring em produção.

---

## Topologia 3: API + Eventos de Domínio

**Quando usar:** Quando contextos precisam se comunicar sem acoplamento direto.

```
Handler
  ↓
Service
  ↓ emite DomainEvent
EventBus (in-memory ou Kafka/SQS)
  ↓
Outros contextos (subscribers)
```

**Convenção de eventos:**
```typescript
// shared/events.ts
type DomainEvent<T extends string, P> = {
  type: T
  occurredAt: Date
  payload: P
}

type OrderPlacedEvent = DomainEvent<'order.placed', {
  orderId: string
  customerId: string
  total: number
}>
```

**Harness adicional:**
```typescript
// Teste que o evento foi emitido
it('deve emitir evento ao criar pedido', async () => {
  const events: DomainEvent<any, any>[] = []
  const bus = { emit: (e) => events.push(e) }
  const svc = new OrderService(mockRepo, bus)
  
  await svc.criarPedido({ ... })
  
  expect(events).toContainEqual(
    expect.objectContaining({ type: 'order.placed' })
  )
})
```

---

## Topologia 4: CLI / Script de Automação

**Quando usar:** Ferramentas de linha de comando, scripts de migração, crons.

```
CLI Parser (commander/yargs)
  ↓
Command Handler
  ↓
Service
  ↓
Repository / File System / External API
```

**Harness:**
```bash
tsc --noEmit
eslint src
vitest --run
# Teste de smoke manual: node dist/cli.js --help
```

---

## Escolha da Topologia

| Situação | Topologia |
|---|---|
| API HTTP + banco | 1 — REST + Relacional |
| Processamento assíncrono | 2 — Worker/Fila |
| Múltiplos contextos que se comunicam | 3 — Eventos de Domínio |
| Ferramentas internas, scripts | 4 — CLI |
| Combinação (API + fila) | 1 + 2 em paralelo |

---

## Evolução do Harness

O harness cresce conforme o projeto cresce:

```
Dia 1:  typecheck + lint + unit tests
Semana 2: + integration tests (repo com banco real)
Mês 1:  + e2e tests (supertest/playwright)
Produção: + observabilidade (métricas, traces, alertas)
```

**Princípio:** Adicione sensores quando sentir falta deles, não antes.
