# SPDD Bootstrap — Diário do Ser (Web)

## Contexto do Sistema

**Diário do Ser** é uma aplicação web para escrita de diário pessoal guiado pelo Eneagrama e pela visão ontológica. O usuário abre o navegador, navega entre entradas antigas, escreve novas reflexões e recebe insights sobre seus padrões — frases ontológicas e sugestões de leitura geradas pela análise do texto. A experiência é de um diário íntimo e inteligente, não de um chatbot.

---

## Stack Técnica

- **Linguagem/Runtime**: Node.js 20 + TypeScript (strict mode)
- **Frontend**: Vite + React — componentes declarativos, estado com hooks
- **Backend**: Express API — REST endpoints para journal e insights
- **Banco de dados**: SQLite (desenvolvimento) + PostgreSQL (produção) + Prisma ORM
- **IA**: Anthropic Claude API (premium) + Google Gemini API (grátis) + OpenAI API (grátis) — análise das entradas do diário
- **Variáveis de ambiente**: `dotenv` + validação Zod no startup
- **Testes**: Vitest
- **Qualidade**: ESLint + Prettier + `tsc --noEmit` no pre-commit via Husky

---

## Estrutura de Domínios (Bounded Contexts)

```
src/
├── journal/               # Core Domain — entradas do diário
│   ├── journal.model.ts
│   ├── journal.service.ts
│   └── journal.repository.ts
│
├── enneagram/             # Dados e lógica dos 9 tipos
│   ├── enneagram.model.ts
│   ├── enneagram.data.ts  # tipos hardcoded — sem banco
│   └── enneagram.service.ts
│
├── insight/               # Geração de insights via Claude API
│   ├── insight.model.ts
│   ├── insight.service.ts
│   └── insight.repository.ts
│
├── web/                   # Telas e componentes da interface web
│   ├── App.tsx            # raiz do React — gerencia rotas
│   ├── pages/
│   │   ├── HomePage.tsx          # lista de entradas recentes
│   │   ├── EntryPage.tsx          # visualiza entrada + insight
│   │   └── NewEntryPage.tsx       # formulário + exibe insight após salvar
│   └── components/
│       ├── EntryList.tsx
│       ├── InsightCard.tsx
│       └── NavigationBar.tsx
│
├── server.ts              # API backend Express
└── shared/
    ├── types.ts
    ├── env.ts                    # validação Zod
    ├── ai.clients.ts             # wrappers Claude, Gemini, OpenAI
    └── ai.prompts.ts             # system prompts versionados
```

> **Regra de ouro**: `web/` nunca acessa banco diretamente — sempre via services. `journal`, `enneagram` e `insight` não sabem que existe uma interface web. IA services abstraem múltiplos provedores.

---

## REASONS Canvas — Primeira Feature: Página Inicial + Nova Entrada + Insight

### R — Requirements (Requisitos)

- [ ] Ao abrir a aplicação web, usuário vê a página inicial com lista das entradas recentes (data + primeiras palavras)
- [ ] Usuário clica em uma entrada para lê-la
- [ ] Botão "Nova Entrada" abre formulário para escrever nova entrada
- [ ] Ao salvar, o texto é enviado para análise via Claude API
- [ ] Enquanto analisa, tela exibe `Analisando sua entrada...`
- [ ] Após análise, tela exibe o insight: tipo do eneagrama + frase ontológica + observação + sugestão de leitura
- [ ] Navegação entre páginas via menu/header

### E — Entidades e Tipos

```typescript
// journal/journal.model.ts
type JournalEntry = {
  id: string
  content: string
  createdAt: Date
  insight?: Insight
}

// insight/insight.model.ts
type AIProvider = 'claude' | 'gemini' | 'openai'

type Insight = {
  id: string
  journalEntryId: string
  provider: AIProvider
  enneagramType: EnneagramType
  confidence: 'low' | 'medium' | 'high'
  ontologicalPhrase: string
  observation: string
  readingSuggestion: ReadingSuggestion
  rawAnalysis: string
  createdAt: Date
}

type EnneagramType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

type ReadingSuggestion = {
  title: string
  author: string
  reason: string
}

// web/App.tsx — estado de navegação
type Page = 'home' | 'entry' | 'new-entry'

type AppState = {
  page: Page
  selectedEntryId: string | null
}

// enneagram/enneagram.model.ts
type EnneagramProfile = {
  type: EnneagramType
  name: string
  coreFear: string
  coreDesire: string
  ontologicalSignature: string[]
}
```

### A — Abordagem Técnica

- **Frontend**: React + Vite — `useState` para navegação entre páginas, formulários controlados
- **Backend**: Express API — endpoints REST para journal e insights
- **Análise IA**: Múltiplos provedores (Claude, Gemini, OpenAI) com fallback automático
- **Dados do eneagrama**: objeto estático em `enneagram.data.ts` — sem banco
- **Navegação**: `App.tsx` controla a página ativa via `useState<Page>`; cada página recebe callbacks para navegar
- **Seleção de IA**: Usuário pode escolher provedor (grátis/pago) nas configurações
- **Sem interface de repositório**: Prisma direto nos services — YAGNI

### S — Estrutura de Arquivos desta Feature

```
src/
├── index.ts                         # entrypoint: valida env + renderiza <App />
├── tui/
│   ├── App.tsx                      # raiz Ink, gerencia Screen state
│   ├── screens/
│   │   ├── HomeScreen.tsx           # lista entradas, captura ↑↓ Enter n q
│   │   ├── EntryScreen.tsx          # exibe entrada + InsightCard
│   │   └── NewEntryScreen.tsx       # spawn editor → loading → InsightCard
│   └── components/
│       ├── EntryList.tsx            # lista navegável de JournalEntry[]
│       ├── InsightCard.tsx          # exibe Insight formatado
│       └── StatusBar.tsx            # linha inferior com atalhos de teclado
├── journal/
│   ├── journal.model.ts
│   ├── journal.service.ts           # createEntry(), listEntries()
│   └── journal.repository.ts
├── insight/
│   ├── insight.model.ts
│   ├── insight.service.ts           # generateInsight() → Claude + Zod
│   └── insight.repository.ts
├── enneagram/
│   ├── enneagram.model.ts
│   ├── enneagram.data.ts            # 9 tipos hardcoded
│   └── enneagram.service.ts
└── shared/
    ├── env.ts                       # Zod: ANTHROPIC_API_KEY, DATABASE_URL
    ├── claude.client.ts
    └── claude.prompts.ts            # JOURNAL_ANALYSIS_PROMPT
```

### O — Operações a Implementar

1. `listEntries()` — busca entradas ordenadas por data decrescente, com insight se existir
2. `createEntry(content)` — salva `JournalEntry` no banco
3. `generateInsight(entry, provider)` — chama API escolhida, valida com Zod, retorna `Insight`
4. `saveInsight(journalEntryId, result)` — persiste `Insight`
5. `<HomePage>` — renderiza `<EntryList>` + `<NavigationBar>`, captura cliques
6. `<EntryPage>` — exibe entrada completa + `<InsightCard>`
7. `<NewEntryPage>` — formulário → loading → exibe insight
8. `<SettingsPage>` — seleção de provedor IA (grátis/pago)

### N — Normas e Padrões

- Nomenclatura: camelCase funções/variáveis, PascalCase tipos e componentes, kebab-case arquivos não-componentes
- Componentes Ink: arquivos `.tsx`, exportação default
- Erros: `try/catch` em toda chamada à Claude API — exibir mensagem de erro na TUI, nunca travar
- Variáveis de ambiente: validar com Zod no startup — falhar rápido com mensagem clara
- Commits: conventional commits (`feat:`, `fix:`, `chore:`)
- Prompt: constante exportada em `claude.prompts.ts` — nunca inline

### S — Safeguards (Proteções do Harness)

**Guias (Feedforward):**
- [ ] `shared/env.ts` com Zod implementado **antes** de qualquer outra coisa
- [ ] `claude.prompts.ts` com system prompt completo **antes** de chamar a API
- [ ] Schema Zod para validar resposta JSON da Claude — obrigatório
- [ ] `enneagram.data.ts` com os 9 tipos definidos **antes** de implementar análise
- [ ] `.env.example` documentado

**Sensores (Feedback):**
- [ ] Teste unitário: `insight.service.test.ts` — mock da Claude API, verificar parsing Zod
- [ ] Teste unitário: `journal.service.test.ts` — `createEntry` e `listEntries`
- [ ] Teste manual: rodar TUI, criar entrada, verificar insight exibido
- [ ] `tsc --noEmit` + ESLint no pre-commit via Husky

**Loop de Correção:**
- Se a Claude retornar JSON fora do schema: ajustar prompt primeiro, nunca o parser
- Se a TUI travar ao abrir o editor: verificar `spawn` com `stdio: 'inherit'` e `detached: false`
- Rodar `/spdd-sync` após qualquer refatoração manual

---

## System Prompt da Claude

> Versionar em `src/shared/claude.prompts.ts`

```
Você é um guia de autoconhecimento que usa o Eneagrama e a visão ontológica para ajudar pessoas a se compreenderem melhor.

O usuário escreveu uma entrada em seu diário pessoal. Sua tarefa é:

1. Identificar o tipo de eneagrama predominante no texto (1 a 9), com base nos padrões de linguagem, preocupações, emoções e forma de narrar a experiência
2. Gerar uma frase ontológica que ressoe com o que o usuário expressou — curta, profunda, sem jargão técnico
3. Escrever uma observação acolhedora (2–3 frases) sobre o padrão identificado, sem diagnóstico
4. Sugerir um livro real alinhado ao padrão identificado

Responda APENAS em JSON válido, sem markdown, sem texto fora do JSON:
{
  "enneagramType": <número de 1 a 9>,
  "confidence": "low" | "medium" | "high",
  "ontologicalPhrase": "<frase curta e profunda>",
  "observation": "<observação acolhedora, 2–3 frases>",
  "readingSuggestion": {
    "title": "<título exato do livro>",
    "author": "<nome do autor>",
    "reason": "<por que este livro para este padrão — 1 frase>"
  }
}

Regras:
- Nunca invente livros. Use apenas obras reais.
- Tom sempre acolhedor, nunca diagnóstico ou julgador.
- Se o texto for curto demais, use "confidence": "low" e escolha o padrão mais provável.
```

---

## Primeira Tarefa — Implementação

**Objetivo**: Rodar `npx ts-node src/index.ts`, ver a tela inicial com lista de entradas, pressionar `n` para abrir o editor do sistema, escrever, fechar e ver o insight do eneagrama exibido na tela.

**Ordem sugerida de implementação:**
1. `shared/env.ts` — validação Zod no startup
2. `shared/claude.prompts.ts` — system prompt
3. `enneagram/enneagram.data.ts` — 9 tipos estáticos
4. `shared/claude.client.ts` — wrapper Anthropic SDK
5. `insight/insight.service.ts` — `generateInsight()` com Zod
6. `journal/journal.repository.ts` + `journal.service.ts`
7. `tui/components/InsightCard.tsx` + `EntryList.tsx` + `StatusBar.tsx`
8. `tui/screens/HomeScreen.tsx` + `EntryScreen.tsx` + `NewEntryScreen.tsx`
9. `tui/App.tsx` — navegação entre telas
10. `src/index.ts` — entrypoint

**Critérios de Aceite:**
- [ ] Tela inicial exibe lista de entradas (data + preview do texto)
- [ ] Navegação com `↑ ↓` funciona, `Enter` abre a entrada
- [ ] `n` abre o editor do sistema (`$EDITOR` ou `vi` como fallback)
- [ ] Ao fechar o editor, entrada é salva no banco
- [ ] Tela exibe `Analisando...` durante a chamada à API
- [ ] Insight exibido: tipo + frase ontológica + observação + livro
- [ ] `Esc` volta para tela anterior, `q` sai
- [ ] Teste unitário do `insight.service` passando com mock
- [ ] `tsc --noEmit` sem erros

**Não faça agora (YAGNI):**
- [ ] Não implementar edição de entradas antigas
- [ ] Não implementar busca ou filtro por tipo do eneagrama
- [ ] Não implementar histórico de evolução do tipo ao longo do tempo
- [ ] Não implementar exportação do diário
- [ ] Não criar interface `IInsightRepository`
- [ ] Não implementar múltiplos usuários
- [ ] Não usar Blessed ou outra biblioteca TUI — Ink é suficiente

---

## Comandos de Fluxo

- `/spdd-analysis` — para mapear o contexto de histórico e evolução do tipo
- `/spdd-reasons-canvas` — antes de começar qualquer nova feature
- `/spdd-generate` — para gerar código tarefa por tarefa seguindo o canvas
- `/spdd-sync` — após qualquer refatoração manual

---

## Regra de Ouro

> **Se a Claude retornar algo inesperado, ajuste o prompt em `claude.prompts.ts` primeiro.**
> **O canvas REASONS é a fonte da verdade — não o código.**

---

## Decisões de Design

| Decisão | Escolha | Razão |
|---|---|---|
| TUI Framework | Ink (React para terminal) | Componentes declarativos, estado com hooks — muito menos código que imperativo |
| Editor de texto | `spawn($EDITOR)` | Não reimplementar editor no terminal; usar o que o usuário já conhece |
| Dados do eneagrama | Arquivo estático | 9 tipos fixos — banco seria over-engineering |
| Análise IA | Claude API com `await` completo | Streaming adiciona complexidade sem ganho real no MVP |
| Validação da resposta | Zod obrigatório | API é não-determinística — nunca confiar sem validar |
| Repositório | Prisma direto no service | Sem interface — YAGNI, refatorar quando doer |
