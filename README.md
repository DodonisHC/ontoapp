# Diário do Ser

Diário do Ser é uma aplicação web para diário pessoal guiado pelo Eneagrama e pela visão ontológica. O usuário escreve entradas no navegador, o texto é salvo no banco e um insight é gerado com base na análise do conteúdo.

## Visão Geral do Projeto

- **Web:** Vite + React + Express API
- **Banco:** SQLite local (desenvolvimento) + Prisma
- **IA:** Multi-provedor com fallback automático
  - Google Gemini (grátis) ← Padrão gratuito
  - Anthropic Claude (premium)
  - OpenAI GPT-4 mini (pago)
- **Validação:** Zod para ambiente e respostas externas
- **Testes:** Vitest

### Recursos de IA

O Diário do Ser implementa **fallback automático entre provedores de IA**: se um serviço falhar ou não estiver configurado, o sistema tenta automaticamente o próximo provedor disponível. Isso garante máxima disponibilidade sem custos obrigatórios.

**Prioridade:** Claude → Gemini → OpenAI

Veja o [Guia de Provedores de IA](./docs/AI_PROVIDERS_GUIDE.md) para configuração detalhada.

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

### Configuração Rápida

1. Copie `.env.example` para `.env`.
2. Configure o banco de dados: `DATABASE_URL="file:./dev.db"`
3. Configure **pelo menos um** provedor de IA (recomendamos Google Gemini - grátis):

### Opções de Provedor IA

**Opção 1: Google Gemini (Grátis - Recomendado)**
```env
DATABASE_URL="file:./dev.db"
GOOGLE_API_KEY=sua_chave_aqui
```
Obtenha chave gratuita em: https://aistudio.google.com/app/apikey

**Opção 2: Anthropic Claude (Premium)**
```env
DATABASE_URL="file:./dev.db"
ANTHROPIC_API_KEY=sua_chave_aqui
```

**Opção 3: OpenAI GPT-4 mini (Pago)**
```env
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY=sua_chave_aqui
```

**Opção 4: Múltiplos Provedores (Fallback)**
```env
DATABASE_URL="file:./dev.db"
ANTHROPIC_API_KEY=chave_claude
GOOGLE_API_KEY=chave_gemini
OPENAI_API_KEY=chave_openai
```

Quando múltiplos provedores estão configurados, o sistema usa automaticamente o próximo disponível se o primário falhar.

### Produção

Para produção, substitua `DATABASE_URL` por uma URL PostgreSQL válida.

> 📖 **Documentação completa:** Veja o [Guia de Provedores de IA](./docs/AI_PROVIDERS_GUIDE.md) para instruções detalhadas de configuração, troubleshooting e exemplos de uso.
## Documentação

### 📚 Guias Completos

| Documento | Descrição |
|-----------|-----------|
| **[Índice de Documentação](./docs/DOCUMENTATION_INDEX.md)** | 🗺️ Navegue por toda a documentação do projeto |
| **[Guia de Desenvolvimento](./docs/DEVELOPMENT.md)** | 💻 Setup, fluxo de trabalho, padrões de código |
| **[Arquitetura do Sistema](./docs/ARCHITECTURE.md)** | 🏗️ Visão técnica completa, padrões de design |
| **[Documentação da API](./docs/API.md)** | 📡 Endpoints, exemplos, integração |
| **[Guia de Deploy](./docs/DEPLOYMENT.md)** | 🚀 Deploy em VPS, Railway, Render, Docker |
| **[Guia de Provedores de IA](./docs/AI_PROVIDERS_GUIDE.md)** | 🤖 Configuração dos 3 provedores (Claude, Gemini, OpenAI) |

### 📋 Referência Rápida
- **[AGENTS.md](./AGENTS.md)** — Padrões de código, stack técnica, comandos
- **[spdd-bootstrap-diario-eneagrama.md](./spdd-bootstrap-diario-eneagrama.md)** — Especificação da feature, canvas, checklist

### Arquitetura de IA

O sistema usa um **factory pattern** com fallback automático:

```
src/shared/
├── ai.provider-factory.ts  # Factory + fallback logic
├── claude.client.ts        # Anthropic Claude adapter
├── gemini.client.ts        # Google Gemini adapter
├── openai.client.ts        # OpenAI adapter
└── types.ts               # AIProvider type definition
```

Cada cliente implementa a interface `AIProviderClient`:

```typescript
interface AIProviderClient {
  generateInsight(content: string): Promise<Omit<Insight, 'id' | 'journalEntryId' | 'createdAt'>>
}
```

A prioridade de fallback é determinada dinamicamente baseada nas chaves configuradas no `.env`.

## Changelog

### [Unreleased] - Multi-Provider AI Support
- ✨ Adicionado suporte a Google Gemini (grátis)
- ✨ Adicionado suporte a OpenAI GPT-4 mini
- ✨ Implementado fallback automático entre provedores
- ✨ Adicionado campo `provider` ao tipo `Insight`
- 📖 Criado guia completo de configuração em `docs/AI_PROVIDERS_GUIDE.md`

---

**Links Úteis:**
- [Google AI Studio](https://aistudio.google.com/app/apikey) — Obter chave Gemini gratuita
- [Anthropic Console](https://console.anthropic.com/) — Console Claude
- [OpenAI Platform](https://platform.openai.com/) — Console OpenAI
