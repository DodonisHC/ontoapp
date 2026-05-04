# Guia de Provedores de IA

Este guia explica como configurar e usar múltiplos provedores de IA no Diário do Ser.

## Visão Geral

O Diário do Ser suporta três provedores de IA para geração de insights:

| Provedor | Modelo | Custo | Prioridade |
|----------|--------|-------|------------|
| **Anthropic Claude** | claude-3-sonnet | Pago | 1 (Padrão) |
| **Google Gemini** | gemini-2.5-flash | Grátis* | 2 |
| **OpenAI** | gpt-4o-mini | Pago | 3 |

*Limite de requisições gratuitas por dia

## Configuração

### 1. Arquivo `.env`

Configure pelo menos um provedor no arquivo `.env`:

```env
# Opção 1: Google Gemini (Grátis)
GOOGLE_API_KEY=sua_chave_aqui

# Opção 2: Anthropic Claude (Pago)
ANTHROPIC_API_KEY=sua_chave_aqui

# Opção 3: OpenAI (Pago)
OPENAI_API_KEY=sua_chave_aqui

# Database (obrigatório)
DATABASE_URL="file:./dev.db"
```

### 2. Obter Chaves API

#### Google Gemini (Grátis)
1. Acesse [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Clique em "Create API Key"
3. Copie a chave para o `.env`

#### Anthropic Claude
1. Acesse [Anthropic Console](https://console.anthropic.com/)
2. Vá para "Settings" > "API Keys"
3. Crie uma nova chave

#### OpenAI
1. Acesse [OpenAI Platform](https://platform.openai.com/)
2. Vá para "API Keys"
3. Crie uma nova chave secreta

## Uso

### Uso Padrão (Automático)

O sistema usa o provedor com maior prioridade disponível:

```typescript
import { InsightService } from './insight/insight.service'

const service = new InsightService()
const insight = await service.generateInsight('Hoje me senti...')

// insight.provider mostra qual IA foi usada
console.log(insight.provider) // 'gemini', 'claude' ou 'openai'
```

### Seleção Manual de Provedor

```typescript
import { AIProvider } from './shared/types'

// Especificar provedor manualmente
const insight = await service.generateInsight(
  'Hoje me senti...',
  'gemini' as AIProvider  // ou 'claude', 'openai'
)
```

### Fallback Automático

Se o provedor primário falhar, o sistema tenta automaticamente os outros:

```
1. Tenta Claude (se configurado)
2. Se falhar → tenta Gemini (se configurado)
3. Se falhar → tenta OpenAI (se configurado)
```

Exemplo de código com fallback:

```typescript
try {
  const insight = await service.generateInsight(content)
} catch (error) {
  // Todos os provedores falharam
  console.error('Nenhum provedor disponível:', error)
}
```

## API

### InsightService

```typescript
class InsightService {
  // Gera insight (usa provedor padrão ou especificado)
  async generateInsight(
    content: string,
    provider?: AIProvider
  ): Promise<Insight>

  // Versão explícita com provedor
  async generateInsightWithProvider(
    content: string,
    provider: AIProvider
  ): Promise<Insight>

  // Lista provedores disponíveis
  getAvailableProviders(): AIProvider[]
}
```

### AIProviderFactory

```typescript
class AIProviderFactory {
  // Cria cliente para um provedor
  static createClient(provider: AIProvider): AIProviderClient

  // Lista provedores configurados
  static getAvailableProviders(): AIProvider[]

  // Retorna provedor padrão (maior prioridade)
  static getDefaultProvider(): AIProvider

  // Verifica se há algum provedor configurado
  static hasAnyProvider(): boolean
}
```

## Tipos

```typescript
type AIProvider = 'claude' | 'gemini' | 'openai'

type Insight = {
  id: string
  journalEntryId: string
  provider: AIProvider        // ← Novo campo!
  enneagramType: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
  confidence: 'low' | 'medium' | 'high'
  ontologicalPhrase: string
  observation: string
  readingSuggestion: {
    title: string
    author: string
    reason: string
  }
  rawAnalysis: string
  createdAt: Date
}
```

## Testes

### Testar Provedor Específico

Crie um arquivo de teste temporário:

```typescript
import 'dotenv/config'
import { GeminiClient } from './shared/gemini.client'

async function test() {
  const client = new GeminiClient()
  const result = await client.generateInsight('Hoje me senti feliz!')
  console.log(result)
}

test()
```

Execute:
```bash
npx tsx src/test.ts
```

## Troubleshooting

### Erro: "No AI provider configured"
**Solução**: Configure pelo menos uma chave API no `.env`

### Erro: "API key expired" (Gemini)
**Solução**: Gere uma nova chave em [Google AI Studio](https://aistudio.google.com/app/apikey)

### Erro: "Rate limit exceeded" (OpenAI)
**Solução**: Verifique seus créditos ou use outro provedor

### Erro: "Insufficient quota" (OpenAI)
**Solução**: Adicione créditos à conta ou use Google Gemini (grátis)

## Roadmap

- [ ] Persistir `provider` no banco de dados (Prisma migration)
- [ ] UI para seleção de provedor na criação de entrada
- [ ] Métricas de uso por provedor
- [ ] Cache de respostas para economizar tokens
- [ ] Retry automático com exponential backoff

## Referências

- [Google Gemini API Docs](https://ai.google.dev/docs)
- [Anthropic Claude API](https://docs.anthropic.com/)
- [OpenAI API Docs](https://platform.openai.com/docs)
