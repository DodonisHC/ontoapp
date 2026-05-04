# Diário do Ser

## Visão Geral

Diário do Ser é uma aplicação terminal (TUI) para diário pessoal guiado pelo Eneagrama e pela visão ontológica. O usuário escreve entradas no editor do sistema, a aplicação salva no banco e gera insights com o tipo do Eneagrama, uma frase ontológica e sugestão de leitura via Anthropic Claude.

## Stack

| Camada | Tecnologia | Versão |
|---|---|---|
| Runtime | Node.js | >=20.0.0 |
| Linguagem | TypeScript | 5.x strict |
| TUI | Ink | 4.x |
| Banco | PostgreSQL | — |
| ORM | Prisma | 5.x |
| IA | Anthropic Claude | — |
| Testes | Vitest | 1.x |
| Lint | ESLint + Prettier | — |

## Bounded Contexts

| Pasta | Responsabilidade |
|---|---|
| `src/journal/` | Entradas do diário e persistência |
| `src/insight/` | Geração e persistência de insights |
| `src/enneagram/` | Dados e perfis do Eneagrama |
| `src/tui/` | Interface de terminal e navegação |
| `src/shared/` | Tipos, validação de ambiente e cliente Claude |

## Estrutura de Arquivos

```
.
├── AGENTS.md
├── package.json
├── prisma/
├── src/
│   ├── journal/
│   │   ├── journal.model.ts
│   │   ├── journal.service.ts
│   │   └── journal.repository.ts
│   ├── insight/
│   │   ├── insight.model.ts
│   │   ├── insight.service.ts
│   │   └── insight.repository.ts
│   ├── enneagram/
│   │   ├── enneagram.model.ts
│   │   ├── enneagram.data.ts
│   │   └── enneagram.service.ts
│   ├── shared/
│   │   ├── env.ts
│   │   ├── claude.client.ts
│   │   └── claude.prompts.ts
│   └── tui/
│       ├── App.tsx
│       ├── screens/
│       └── components/
```

## Convenções

- Arquivos de domínio: `*.model.ts`, `*.service.ts`, `*.repository.ts`
- Tipos: `PascalCase`
- Funções e variáveis: `camelCase`
- Exportações nomeadas preferidas
- TypeScript `strict: true`
- Evite `any`; use `unknown` quando necessário
- Zod para validação de ambiente e respostas externas

## Comandos

- `npm run start` — inicia a TUI
- `npm run dev` — inicia em watch mode
- `npm run lint` — executa ESLint
- `npm run test` — executa Vitest
- `npm run typecheck` — `tsc --noEmit`
- `npm run harness` — validação completa (`typecheck && lint && test`)

## SPDD

- O primeiro fluxo foi implementado com base no REASONS Canvas de nova entrada e insight.
- Antes de gerar novas features, leia o canvas relevante e mantenha o agente alinhado com o domínio.
