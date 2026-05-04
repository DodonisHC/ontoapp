# Diário do Ser

Diário do Ser é uma aplicação terminal (TUI) para diário pessoal guiado pelo Eneagrama e pela visão ontológica. O usuário escreve entradas no editor do sistema, o texto é salvo no banco e um insight é gerado com base na análise do conteúdo.

## Visão Geral do Projeto

- TUI: Ink + React hooks
- Banco: PostgreSQL + Prisma
- IA: Anthropic Claude para análise de entradas
- Editor: `$EDITOR` do sistema via `child_process.spawn`
- Validação: Zod para ambiente e respostas externas
- Testes: Vitest

## Estrutura do Código

- `src/journal/` — domínio das entradas do diário
- `src/insight/` — geração e persistência de insights
- `src/enneagram/` — dados e lógica dos tipos
- `src/tui/` — interface de terminal e navegação
- `src/shared/` — tipos, validação de ambiente e cliente Claude

## Comandos Úteis

- `npm run start` — inicia a TUI
- `npm run dev` — inicia em watch mode
- `npm run lint` — executa ESLint
- `npm run test` — executa Vitest
- `npm run typecheck` — `tsc --noEmit`
- `npm run harness` — validação completa (`typecheck && lint && test`)

## Documentação e Planejamento

- `AGENTS.md` — guia de referência do repositório e padrões de código
- `spdd-bootstrap-diario-eneagrama.md` — especificação da primeira feature, canvas e checklist de implementação

## Boas práticas de documentação

1. Mantenha `README.md` como ponto de entrada principal do repositório.
2. Use arquivos de planejamento como `spdd-bootstrap-diario-eneagrama.md` para requisitos, fluxos e decisões de implementação.
3. Evite duplicar detalhes de especificação entre documentos.
