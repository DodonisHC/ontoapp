---
name: harness-spdd
description: >
  Guia completo para iniciar e conduzir projetos de software usando Harness Engineering e SPDD
  (Structured-Prompt-Driven Development). Use esta skill sempre que o usuário mencionar:
  SPDD, Harness Engineering, bounded contexts, DDD estratégico flat, REASONS Canvas,
  cinturão de confiança, shift-left quality, prompt-first development, /spdd-analysis,
  /spdd-reasons-canvas, /spdd-generate, /spdd-sync, openspdd, ou qualquer combinação de
  "IA + arquitetura + projeto novo". Também use quando o usuário quiser estruturar um projeto
  greenfield com governança de prompts, reduzir ruído para agentes de IA, ou aplicar DDD
  sem cerimônia excessiva. Esta skill deve ser ativada proativamente sempre que a conversa
  envolver planejamento de projeto com IA como copiloto de desenvolvimento.
---

# Harness Engineering + SPDD

Guia prático para projetos greenfield com IA como copiloto de desenvolvimento.
O objetivo central é **reduzir ruído para o agente** e criar um **cinturão de confiança** desde o primeiro commit.

---

## Três Pilares

### 1. DDD Estratégico Flat

Organização por domínio sem cerimônia ritualística de Clean Architecture.

**Estrutura de pastas recomendada:**
```
src/
  billing/
    billing.model.ts       ← entidades e tipos do domínio
    billing.service.ts     ← lógica de negócio
    billing.repository.ts  ← persistência
    billing.handler.ts     ← entrada/saída (HTTP, queue, CLI)
  identity/
    identity.model.ts
    identity.service.ts
    identity.repository.ts
    identity.handler.ts
  orders/
    ...
```

**Regras do flat:**
- Máximo **4 arquivos por bounded context** no início
- Sem interfaces para cada repositório (adicione quando a dor aparecer)
- Sem DTOs entre camadas internas (use os tipos do `.model.ts` diretamente)
- Sem mappers desnecessários
- Refatore quando o problema real aparecer — com IA, refatorar código simples é rápido

**Quando abstrair:**
- Segundo banco de dados real → abstraia repositório
- Segundo consumer de fila → abstraia handler
- Terceiro contexto com lógica compartilhada → extraia módulo `shared/`

**Princípios:**
- YAGNI: "You Ain't Gonna Need It" — não projete para "e se mudar o banco"
- Cada arquivo tem **uma responsabilidade clara** (modelo, serviço, repositório, handler)
- Nomes de arquivos revelam intenção: `billing.service.ts`, não `service.ts`

---

### 2. SPDD — Structured-Prompt-Driven Development

Prompts são artefatos de primeira classe, versionados junto com o código.

#### Fluxo de trabalho SPDD

```
1. /spdd-analysis     → mapeamento do domínio
2. /spdd-reasons-canvas → blueprint executável
3. /spdd-generate     → geração de código tarefa a tarefa
4. /spdd-sync         → sincronização após refatoração manual
```

#### REASONS Canvas

Use antes de qualquer geração de código. Preencha cada seção:

| Seção | O que captura |
|---|---|
| **R**equirements | O que o sistema deve fazer (casos de uso) |
| **E**ntities | Entidades do domínio e seus atributos |
| **A**pproach | Decisões de design e padrões adotados |
| **S**tructure | Organização de arquivos e módulos |
| **O**perations | Operações CRUD e fluxos de dados |
| **N**orms | Convenções de código, estilo, lint rules |
| **S**afeguards | Tratamento de erros, validações, limites |

**Template do canvas:**
```markdown
## REASONS Canvas — [Nome do Contexto]

### Requirements
- [ ] ...

### Entities
- `NomeEntidade`: campo1 (tipo), campo2 (tipo)

### Approach
- Padrão: ...
- Banco: ...
- Autenticação: ...

### Structure
```
src/contexto/
  contexto.model.ts
  contexto.service.ts
  contexto.repository.ts
  contexto.handler.ts
```

### Operations
- CREATE: ...
- READ: ...
- UPDATE: ...
- DELETE: ...

### Norms
- Linguagem: TypeScript strict
- Lint: ESLint + Prettier
- Testes: Vitest

### Safeguards
- Validação de entrada com Zod
- Erros tipados (never throw strings)
- Sem dados sensíveis em logs
```

#### Princípio Prompt-First

> Antes de gerar código, defina a intenção.  
> Se o prompt estiver errado, o código estará errado.  
> Corrija o prompt primeiro, depois atualize o código.

**Regra de ouro:** `realidade ≠ canvas` → corrija o canvas → rode `/spdd-sync` → atualize o código

---

### 3. Harness Engineering — Cinturão de Confiança

Sistema de guias (feedforward) e sensores (feedback) para o agente de IA.

#### Guias (Feedforward) — o que o agente vê antes de agir

| Guia | Implementação |
|---|---|
| Templates de estrutura | `SKILL.md` ou `AGENTS.md` na raiz do projeto |
| Convenções explícitas | `.editorconfig`, `tsconfig.json` strict, `eslint.config.js` |
| Topologias de harness | Exemplos de cada padrão em `docs/topologies/` |
| LSP e type checking | TypeScript em modo strict — erros visíveis no editor |

#### Sensores (Feedback) — o que valida cada mudança

```bash
# Roda a cada mudança (pre-commit hook ou CI)
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npm run test        # vitest --run
```

**Configuração mínima do harness (`package.json`):**
```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "eslint src --max-warnings 0",
    "test": "vitest --run",
    "harness": "npm run typecheck && npm run lint && npm run test"
  }
}
```

#### Loop de Correção

```
Agente gera código
      ↓
harness roda (typecheck + lint + test)
      ↓
    PASS? ─── sim ──→ commit
      │
     não
      ↓
Agente lê o erro
      ↓
Corrige o CANVAS ou o código
      ↓
(repete)
```

#### AGENTS.md — arquivo de contexto do projeto

Crie na raiz do projeto. O agente lê automaticamente:

```markdown
# Contexto do Projeto

## Stack
- Runtime: Node.js 22 + TypeScript 5.x strict
- Framework: Fastify
- Banco: PostgreSQL com Drizzle ORM
- Testes: Vitest
- Lint: ESLint + Prettier

## Bounded Contexts
- `billing/` — gestão de cobranças e planos
- `identity/` — autenticação e usuários
- `orders/` — pedidos e fulfillment

## Convenções
- Arquivos: `contexto.responsabilidade.ts`
- Erros: classes tipadas em `shared/errors.ts`
- Nunca use `any` — use `unknown` e narrowing
- Validação de entrada: Zod em todos os handlers

## Harness
- `npm run harness` deve passar antes de todo commit
- Cobertura mínima: 80% nas services
```

---

## Checklist de Início de Projeto

```
□ Definir bounded contexts (mínimo 2, máximo 5 para começar)
□ Criar estrutura de pastas flat por contexto
□ Configurar TypeScript strict
□ Configurar ESLint + Prettier
□ Configurar Vitest
□ Criar AGENTS.md na raiz
□ Criar REASONS Canvas para o primeiro contexto
□ Rodar /spdd-analysis para validar o mapeamento
□ Rodar /spdd-generate para o primeiro contexto
□ Configurar pre-commit hook com `npm run harness`
□ Primeiro commit: estrutura + harness verde
```

---

## Anti-padrões a evitar

| Anti-padrão | Por quê evita | Alternativa |
|---|---|---|
| Interface para cada repo | Aumenta tokens, confunde o agente | Repositório concreto; abstraia quando houver 2º banco |
| DTO por camada | Mappers desnecessários, mais arquivos | Use tipos do `.model.ts` entre camadas internas |
| Clean Architecture completa no dia 1 | Custo cognitivo alto, acurácia da IA cai | Flat por contexto; extraia camadas quando doer |
| Comentários redundantes | Ruído para o agente | Nomes que revelam intenção |
| `any` no TypeScript | Remove guardrails do harness | `unknown` + narrowing ou tipos explícitos |
| Gerar código sem canvas | IA vai em direção errada | Sempre canvas primeiro |

---

## Referências

- `references/reasons-canvas-template.md` — template completo do REASONS Canvas
- `references/agents-md-template.md` — template do AGENTS.md para projetos
- `references/harness-topologies.md` — topologias comuns de harness por tipo de projeto
