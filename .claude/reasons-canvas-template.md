# REASONS Canvas — Template Completo

Use este template para cada bounded context antes de gerar qualquer código.
Preencha do topo para baixo. Não pule seções — cada uma "trava" uma decisão de design.

---

## REASONS Canvas — [Nome do Contexto]

**Projeto:** [nome do projeto]  
**Data:** [data]  
**Versão:** 1.0  
**Status:** [ ] Rascunho  [ ] Aprovado  [ ] Implementado

---

### R — Requirements (Requisitos)

O que este contexto deve fazer? Liste casos de uso na forma "O sistema deve...":

- [ ] O sistema deve...
- [ ] O sistema deve...
- [ ] O sistema **não** deve... ← restrições explícitas são tão importantes quanto os requisitos

**Critérios de aceite:**
- Dado [contexto], quando [ação], então [resultado esperado]

---

### E — Entities (Entidades)

Entidades do domínio e seus atributos. Use tipos explícitos:

```typescript
type NomeEntidade = {
  id: string          // UUID v7
  campo: string
  status: 'ativo' | 'inativo'
  criadoEm: Date
  atualizadoEm: Date
}

type OutraEntidade = {
  id: string
  // ...
}
```

**Relacionamentos:**
- `NomeEntidade` pertence a `OutraEntidade` via `outroId`
- `NomeEntidade` tem muitos `OutrosItens`

**Invariantes do domínio:**
- Um [entidade] não pode ter [estado X] e [estado Y] ao mesmo tempo
- [campo] é obrigatório quando [condição]

---

### A — Approach (Abordagem)

Decisões de design para este contexto:

**Padrão arquitetural:**
- [ ] Flat (handler → service → repository)
- [ ] Event-driven (publica eventos após mutações)
- [ ] CQRS (separação de leitura e escrita)

**Banco de dados:**
- Banco: [PostgreSQL / SQLite / MongoDB / ...]
- ORM/Query builder: [Drizzle / Prisma / Knex / ...]
- Estratégia de migração: [automática / manual]

**Autenticação/Autorização:**
- [ ] JWT Bearer token
- [ ] Session cookie
- [ ] API Key
- Quem pode fazer o quê: [descreva regras de acesso]

**Comunicação externa:**
- [ ] REST HTTP
- [ ] fila de mensagens (qual: ...)
- [ ] eventos internos

---

### S — Structure (Estrutura)

Organização de arquivos deste contexto:

```
src/[contexto]/
  [contexto].model.ts       ← tipos, entidades, schemas Zod
  [contexto].service.ts     ← lógica de negócio pura
  [contexto].repository.ts  ← acesso ao banco
  [contexto].handler.ts     ← entrada/saída (HTTP routes, queue consumers)
  [contexto].test.ts        ← testes de unidade e integração
```

**Dependências externas deste contexto:**
- Importa de `shared/`: [quais módulos]
- Importa de outros contextos: [listar — minimizar ao máximo]

---

### O — Operations (Operações)

Operações que este contexto expõe:

| Operação | Entrada | Saída | Efeitos colaterais |
|---|---|---|---|
| criar[Entidade] | `{ campo1, campo2 }` | `Entidade` | persiste no banco |
| buscar[Entidade]PorId | `{ id }` | `Entidade \| null` | nenhum |
| listar[Entidades] | `{ filtros? }` | `Entidade[]` | nenhum |
| atualizar[Entidade] | `{ id, campos }` | `Entidade` | persiste no banco |
| remover[Entidade] | `{ id }` | `void` | soft delete ou hard delete |

**Fluxos complexos:**
1. [Nome do fluxo]:
   - Passo 1: ...
   - Passo 2: ...
   - Passo 3: ...

---

### N — Norms (Normas)

Convenções que o agente deve seguir ao gerar código para este contexto:

**Linguagem e tipagem:**
- TypeScript strict (`strict: true` no tsconfig)
- Sem `any` — use `unknown` + narrowing
- Exports nomeados, sem default exports (exceto em config files)

**Nomenclatura:**
- Arquivos: `kebab-case.responsabilidade.ts`
- Tipos e interfaces: `PascalCase`
- Funções e variáveis: `camelCase`
- Constantes: `SCREAMING_SNAKE_CASE`
- Tabelas do banco: `snake_case` (plural)

**Erros:**
- Sem `throw new Error('string')` — use erros tipados de `shared/errors.ts`
- Handlers retornam `Result<T, E>` ou lançam erros HTTP tipados

**Testes:**
- Um arquivo de teste por módulo
- Nome: `[contexto].test.ts`
- Mocks: apenas dependências externas (banco, HTTP externo)
- Cobertura mínima: 80% nas services

---

### S — Safeguards (Salvaguardas)

Proteções e limites deste contexto:

**Validação de entrada:**
```typescript
// Schema Zod para cada operação de escrita
const criarEntidadeSchema = z.object({
  campo1: z.string().min(1).max(255),
  campo2: z.enum(['opcao1', 'opcao2']),
})
```

**Limites de rate:**
- Endpoint X: máximo N req/min por usuário

**Dados sensíveis:**
- [ ] Campos que nunca aparecem em logs: [listar]
- [ ] Campos que são criptografados em repouso: [listar]
- [ ] PII que requer LGPD/GDPR handling: [listar]

**Tratamento de falhas:**
- Se o banco estiver indisponível: [retorna erro 503 / usa cache / ...]
- Se serviço externo falhar: [retry com backoff / circuit breaker / ...]
- Timeout máximo de operação: [N]ms

---

## Histórico de versões

| Versão | Data | Mudança |
|---|---|---|
| 1.0 | [data] | Versão inicial |

---

*Após preencher, rode `/spdd-generate` para iniciar a implementação.*
