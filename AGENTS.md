# Diário do Ser

## Visão Geral

Diário do Ser é uma aplicação web para diário pessoal guiado pelo Eneagrama e pela visão ontológica. O usuário escreve entradas no navegador, a aplicação salva no banco e gera insights via Anthropic Claude.

## Propósito deste arquivo

Este documento é o guia de referência do repositório. Ele deve permanecer conciso e operacional, servindo como atalho para a documentação de implementação e o planejamento de features.

## Stack

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js >=20.0.0 |
| Linguagem | TypeScript 5.x strict |
| Frontend | Vite + React |
| Backend | Express API |
| Banco | SQLite (dev) + PostgreSQL (prod) |
| ORM | Prisma 5.x |
| IA | Anthropic Claude (premium) + Google Gemini (grátis) + OpenAI GPT-4 mini (grátis) |
| Testes | Vitest 1.x |
| Lint | ESLint + Prettier |

## Bounded Contexts

| Pasta | Responsabilidade |
|---|---|
| `src/journal/` | Entradas do diário e persistência |
| `src/insight/` | Geração e persistência de insights |
| `src/enneagram/` | Dados e lógica do Eneagrama |
| `src/web/` | Interface web (React) |
| `src/server.ts` | API backend (Express) |
| `src/shared/` | Tipos, validação e clientes IA (Claude, Gemini, OpenAI) |

## Estrutura de Arquivos

```
.
├── AGENTS.md
├── README.md
├── package.json
├── prisma/
├── src/
│   ├── journal/
│   ├── insight/
│   ├── enneagram/
│   ├── web/
│   ├── server.ts
│   └── shared/
├── spdd-bootstrap-diario-eneagrama.md
```

## Convenções

- Arquivos de domínio: `*.model.ts`, `*.service.ts`, `*.repository.ts`
- Tipos: `PascalCase`
- Funções e variáveis: `camelCase`
- Exportações nomeadas preferidas
- TypeScript `strict: true`
- Evite `any`; use `unknown` quando necessário
- Use Zod para validação de ambiente e respostas externas

## Comandos

### Backend API
- `npm run start:api` — inicia o servidor backend
- `npm run dev:api` — inicia o servidor backend em modo dev

### Frontend Web
- `npm run dev:web` — inicia a aplicação web no navegador
- `npm run build:web` — compila a aplicação web para produção
- `npm run preview:web` — faz preview da aplicação web compilada

### Qualidade
- `npm run lint` — executa ESLint
- `npm run test` — executa Vitest
- `npm run typecheck` — `tsc --noEmit`
- `npm run harness` — validação completa (`typecheck && lint && test`)

## Documentação do Projeto

- `README.md` — visão geral e ponto de entrada principal do repositório
- `spdd-bootstrap-diario-eneagrama.md` — especificação da feature, canvas e checklist de implementação

> Mantenha a documentação modular: informações estáveis no README e detalhes de execução em arquivos de feature.
