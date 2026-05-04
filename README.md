# Diário do Ser

Diário do Ser é uma aplicação web para diário pessoal guiado pelo Eneagrama e pela visão ontológica. O usuário escreve entradas no navegador, o texto é salvo no banco e um insight é gerado com base na análise do conteúdo.

## Visão Geral do Projeto

- Web: Vite + React + Express API
- Banco: SQLite local (desenvolvimento) + Prisma
- IA: Anthropic Claude (premium) + Google Gemini (grátis) + OpenAI GPT-4 mini (grátis) para análise de entradas
- Validação: Zod para ambiente e respostas externas
- Testes: Vitest

## Estrutura do Código

- `src/journal/` — domínio das entradas do diário
- `src/insight/` — geração e persistência de insights
- `src/enneagram/` — dados e lógica dos tipos
- `src/web/` — interface web (React)
- `src/shared/` — tipos, validação de ambiente e clientes IA (Claude, Gemini, OpenAI)

## Comandos Úteis

- `npm run start:api` — inicia o servidor backend para a aplicação web
- `npm run dev:api` — inicia o servidor backend em modo de desenvolvimento
- `npm run dev:web` — inicia a aplicação web no navegador via Vite
- `npm run build:web` — compila a aplicação web para produção
- `npm run preview:web` — faz preview da aplicação web compilada
- `npm run lint` — executa ESLint
- `npm run test` — executa Vitest
- `npm run typecheck` — `tsc --noEmit`
- `npm run harness` — validação completa (`typecheck && lint && test`)

> Para desenvolvimento, abra dois terminais e rode `npm run dev:api` e `npm run dev:web`.

## Rodando no navegador

1. No primeiro terminal, execute:
   - `npm run dev:api`
2. No segundo terminal, execute:
   - `npm run dev:web`
3. Abra `http://localhost:5173` no navegador.

A aplicação web consome o backend em `http://localhost:4000` via proxy.

## Configuração de Ambiente

O projeto exige variáveis de ambiente válidas antes de iniciar.

1. Copie `.env.example` para `.env`.
2. Para desenvolvimento local, use SQLite com `DATABASE_URL="file:./dev.db"`.
3. Se quiser gerar insights via Claude, defina também `ANTHROPIC_API_KEY`.

Exemplo mínimo de `.env`:

```env
DATABASE_URL="file:./dev.db"
```

Para produção, você pode substituir `DATABASE_URL` por uma URL PostgreSQL válida.
## Documentação e Planejamento

- `AGENTS.md` — guia de referência do repositório e padrões de código
- `spdd-bootstrap-diario-eneagrama.md` — especificação da primeira feature, canvas e checklist de implementação

## Boas práticas de documentação

1. Mantenha `README.md` como ponto de entrada principal do repositório.
2. Use arquivos de planejamento como `spdd-bootstrap-diario-eneagrama.md` para requisitos, fluxos e decisões de implementação.
3. Evite duplicar detalhes de especificação entre documentos.
