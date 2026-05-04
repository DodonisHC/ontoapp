# API Documentation - Diário do Ser

## Base URL

**Desenvolvimento**: `http://localhost:4000`

**Produção**: Dependente do deploy (ex: `https://api.seusite.com`)

## Autenticação

Atualmente a API não requer autenticação. Todos os endpoints são públicos.

> ⚠️ **Nota**: Autenticação JWT será implementada em versões futuras.

## Content-Type

Todas as requisições e respostas usam `application/json`.

## Endpoints

### Journal Entries

#### Listar Entradas

```http
GET /api/entries
```

Retorna uma lista de entradas do diário, ordenadas por data (mais recentes primeiro).

**Parâmetros de Query**: Nenhum

**Resposta de Sucesso (200 OK)**:

```json
[
  {
    "id": "uuid-string",
    "content": "Hoje me senti...",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "insight": {
      "id": "uuid-string",
      "journalEntryId": "uuid-string",
      "provider": "gemini",
      "enneagramType": 4,
      "confidence": "high",
      "ontologicalPhrase": "Você busca viver em plena consonância...",
      "observation": "O texto revela uma forte inclinação para...",
      "readingSuggestion": {
        "title": "A Sabedoria do Eneagrama",
        "author": "Don Richard Riso",
        "reason": "Este livro ajuda a compreender..."
      },
      "rawAnalysis": "{...}",
      "createdAt": "2024-01-15T10:30:05.000Z"
    }
  }
]
```

**Resposta de Erro (500 Internal Server Error)**:

```json
{
  "error": "Não foi possível listar as entradas."
}
```

---

#### Obter Entrada Específica

```http
GET /api/entries/:id
```

Retorna uma entrada específica do diário pelo ID.

**Parâmetros de URL**:
- `id` (string, obrigatório): UUID da entrada

**Resposta de Sucesso (200 OK)**:

```json
{
  "id": "uuid-string",
  "content": "Hoje me senti...",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "insight": {
    "id": "uuid-string",
    "journalEntryId": "uuid-string",
    "provider": "gemini",
    "enneagramType": 4,
    "confidence": "high",
    "ontologicalPhrase": "Você busca viver em plena consonância...",
    "observation": "O texto revela uma forte inclinação para...",
    "readingSuggestion": {
      "title": "A Sabedoria do Eneagrama",
      "author": "Don Richard Riso",
      "reason": "Este livro ajuda a compreender..."
    },
    "rawAnalysis": "{...}",
    "createdAt": "2024-01-15T10:30:05.000Z"
  }
}
```

**Resposta de Erro (404 Not Found)**:

```json
{
  "error": "Entrada não encontrada."
}
```

**Resposta de Erro (500 Internal Server Error)**:

```json
{
  "error": "Não foi possível recuperar a entrada."
}
```

---

#### Criar Entrada com Insight

```http
POST /api/entries
```

Cria uma nova entrada no diário e gera automaticamente um insight via IA.

**Corpo da Requisição**:

```json
{
  "content": "Texto da entrada do diário..."
}
```

**Validações**:
- `content` é obrigatório
- `content` não pode ser vazio ou apenas espaços

**Resposta de Sucesso (201 Created)**:

```json
{
  "id": "uuid-string",
  "content": "Texto da entrada do diário...",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "insight": {
    "id": "uuid-string",
    "journalEntryId": "uuid-string",
    "provider": "gemini",
    "enneagramType": 4,
    "confidence": "high",
    "ontologicalPhrase": "A beleza reside na profundidade da alma.",
    "observation": "Sua escrita revela uma sensibilidade profunda...",
    "readingSuggestion": {
      "title": "O Caminho do Artista",
      "author": "Julia Cameron",
      "reason": "Este livro ajuda a cultivar a criatividade..."
    },
    "rawAnalysis": "{\"enneagramType\": 4, ...}",
    "createdAt": "2024-01-15T10:30:05.000Z"
  }
}
```

**Resposta de Erro (400 Bad Request)**:

```json
{
  "error": "Conteúdo da entrada é obrigatório."
}
```

**Resposta de Erro (500 Internal Server Error)**:

```json
{
  "error": "Não foi possível salvar a entrada."
}
```

> **Nota**: Erro 500 também ocorre se:
> - Nenhum provedor de IA está configurado
> - Todos os provedores de IA falharam
> - Houve erro no banco de dados

---

## Tipos de Dados

### JournalEntry

```typescript
{
  id: string              // UUID v4
  content: string         // Texto da entrada
  createdAt: string       // ISO 8601 datetime
  insight?: Insight       // Opcional (null se não gerado)
}
```

### Insight

```typescript
{
  id: string              // UUID v4
  journalEntryId: string  // UUID da entrada relacionada
  provider: string        // 'claude' | 'gemini' | 'openai'
  enneagramType: number  // 1-9
  confidence: string      // 'low' | 'medium' | 'high'
  ontologicalPhrase: string
  observation: string
  readingSuggestion: {
    title: string
    author: string
    reason: string
  }
  rawAnalysis: string    // JSON string completo da resposta IA
  createdAt: string       // ISO 8601 datetime
}
```

### EnneagramType

```typescript
type EnneagramType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
```

Valores:
- `1`: Perfeccionista
- `2`: Auxiliador
- `3`: Realizador
- `4`: Individualista
- `5`: Observador
- `6`: Questionador
- `7`: Entusiasta
- `8`: Desafiador
- `9`: Pacificador

### Confidence

```typescript
type Confidence = 'low' | 'medium' | 'high'
```

- `low`: IA tem baixa confiança na análise
- `medium`: IA tem confiança moderada
- `high`: IA tem alta confiança

---

## Exemplos de Uso

### cURL

#### Listar Entradas

```bash
curl http://localhost:4000/api/entries
```

#### Obter Entrada

```bash
curl http://localhost:4000/api/entries/123e4567-e89b-12d3-a456-426614174000
```

#### Criar Entrada

```bash
curl -X POST http://localhost:4000/api/entries \
  -H "Content-Type: application/json" \
  -d '{"content": "Hoje me senti muito feliz e realizado!"}'
```

### JavaScript (Fetch)

```javascript
// Listar entradas
const entries = await fetch('http://localhost:4000/api/entries')
  .then(res => res.json())

// Criar entrada
const newEntry = await fetch('http://localhost:4000/api/entries', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: 'Hoje foi um dia produtivo...'
  })
}).then(res => res.json())
```

### TypeScript

```typescript
interface JournalEntry {
  id: string
  content: string
  createdAt: string
  insight?: Insight
}

interface Insight {
  id: string
  journalEntryId: string
  provider: 'claude' | 'gemini' | 'openai'
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
  createdAt: string
}

// API Client
class JournalAPI {
  private baseURL = 'http://localhost:4000'

  async listEntries(): Promise<JournalEntry[]> {
    const res = await fetch(`${this.baseURL}/api/entries`)
    if (!res.ok) throw new Error('Failed to fetch entries')
    return res.json()
  }

  async getEntry(id: string): Promise<JournalEntry> {
    const res = await fetch(`${this.baseURL}/api/entries/${id}`)
    if (!res.ok) throw new Error('Entry not found')
    return res.json()
  }

  async createEntry(content: string): Promise<JournalEntry> {
    const res = await fetch(`${this.baseURL}/api/entries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    })
    if (!res.ok) throw new Error('Failed to create entry')
    return res.json()
  }
}
```

---

## Códigos de Erro

| Código | Descrição | Quando Ocorre |
|--------|-----------|---------------|
| 200 | OK | Requisição bem-sucedida |
| 201 | Created | Recurso criado com sucesso |
| 400 | Bad Request | Dados inválidos na requisição |
| 404 | Not Found | Recurso não encontrado |
| 500 | Internal Server Error | Erro no servidor |

## Fluxo de Erros

### Cenário: Nenhum Provedor de IA Configurado

```
POST /api/entries
  ↓
500 Internal Server Error
  ↓
{
  "error": "No AI provider configured. Please set ANTHROPIC_API_KEY, GOOGLE_API_KEY, or OPENAI_API_KEY"
}
```

### Cenário: Todos os Provedores Falharam

```
POST /api/entries
  ↓
InsightService tenta: Claude → Gemini → OpenAI
  ↓
Todos falham
  ↓
500 Internal Server Error
  ↓
{
  "error": "Não foi possível salvar a entrada."
}
```

### Cenário: Entrada Não Encontrada

```
GET /api/entries/invalid-id
  ↓
404 Not Found
  ↓
{
  "error": "Entrada não encontrada."
}
```

---

## Rate Limiting

Atualmente não há rate limiting implementado.

> 🚧 **Planejado**: Limites de requisições por IP/minuto serão adicionados.

## Versionamento

A API atual não tem versionamento explícito na URL.

> 🚧 **Planejado**: `/api/v1/entries` para futuras versões.

## WebSockets

Não implementado. Todas as comunicações são via HTTP REST.

> 🚧 **Planejado**: WebSockets para atualizações em tempo real.

## Documentação OpenAPI/Swagger

Não implementado.

> 🚧 **Planejado**: Especificação OpenAPI 3.0 com Swagger UI.

---

## Testes da API

### Usando Vitest

```typescript
import { describe, it, expect } from 'vitest'

describe('API /api/entries', () => {
  it('should list entries', async () => {
    const res = await fetch('http://localhost:4000/api/entries')
    expect(res.status).toBe(200)
    
    const entries = await res.json()
    expect(Array.isArray(entries)).toBe(true)
  })

  it('should create entry with insight', async () => {
    const res = await fetch('http://localhost:4000/api/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'Test entry' })
    })
    
    expect(res.status).toBe(201)
    
    const entry = await res.json()
    expect(entry.content).toBe('Test entry')
    expect(entry.insight).toBeDefined()
    expect(entry.insight.enneagramType).toBeGreaterThanOrEqual(1)
    expect(entry.insight.enneagramType).toBeLessThanOrEqual(9)
  })
})
```

---

## Integração Frontend

O frontend React (Vite) consome esta API via proxy configurado em `vite.config.ts`:

```typescript
// vite.config.ts
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  }
}
```

Isso permite que o frontend faça requisições para `/api/entries` que são automaticamente redirecionadas para o backend.

---

## Referências

- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [JSON Schema](https://json-schema.org/)

---

*API Documentation v1.0*
*Última atualização: Maio 2026*
