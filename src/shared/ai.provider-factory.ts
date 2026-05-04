import { AIProvider, AIProviderClient } from './types'
import { getAvailableProviders, validateEnv } from './env'
import { GeminiClient } from './gemini.client'
import { OpenAIClient } from './openai.client'
import { Anthropic } from '@anthropic-ai/sdk'
import { z } from 'zod'

export class AIProviderFactory {
  static createClient(provider: AIProvider): AIProviderClient {
    switch (provider) {
      case 'gemini':
        return new GeminiClient()
      case 'openai':
        return new OpenAIClient()
      case 'claude':
        return new ClaudeAdapter()
      default:
        throw new Error(`Unknown AI provider: ${provider}`)
    }
  }

  static getAvailableProviders(): AIProvider[] {
    return getAvailableProviders() as AIProvider[]
  }

  static getDefaultProvider(): AIProvider {
    const available = this.getAvailableProviders()
    if (available.length === 0) {
      throw new Error('No AI provider configured. Please set ANTHROPIC_API_KEY, GOOGLE_API_KEY, or OPENAI_API_KEY in .env')
    }
    // Priority: claude > gemini > openai
    if (available.includes('claude')) return 'claude'
    if (available.includes('gemini')) return 'gemini'
    return available[0]
  }

  static hasAnyProvider(): boolean {
    return this.getAvailableProviders().length > 0
  }
}

let anthropicClient: Anthropic | null = null

function getClaudeClient(): Anthropic {
  if (!anthropicClient) {
    const env = validateEnv()
    if (!env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is required to use Claude provider')
    }
    anthropicClient = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })
  }
  return anthropicClient
}

class ClaudeAdapter implements AIProviderClient {
  async generateInsight(content: string): Promise<import('./types').Insight> {
    const client = getClaudeClient()

    const systemPrompt = `Você é um analista especializado em Eneagrama e visão ontológica.
Analise textos de diário pessoal e identifique padrões relacionados aos 9 tipos do Eneagrama.

Responda APENAS com um JSON válido no seguinte formato:
{
  "enneagramType": número entre 1 e 9,
  "confidence": "low" ou "medium" ou "high",
  "ontologicalPhrase": string com uma frase inspiradora ontológica em português,
  "observation": string com a observação sobre o texto em português,
  "readingSuggestion": {
    "title": string,
    "author": string,
    "reason": string explicando porque recomenda este livro
  }
}

IMPORTANTE: Responda APENAS com o JSON, sem texto adicional antes ou depois.`

    const message = await client.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Analise o seguinte texto de diário pessoal:\n\n${content}`,
        },
      ],
    })

    const rawContent = message.content[0].type === 'text' ? message.content[0].text : ''

    const jsonMatch = rawContent.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in Claude response')
    }

    const parsed = JSON.parse(jsonMatch[0])

    const schema = z.object({
      enneagramType: z.number().int().min(1).max(9),
      confidence: z.enum(['low', 'medium', 'high']),
      ontologicalPhrase: z.string(),
      observation: z.string(),
      readingSuggestion: z.object({
        title: z.string(),
        author: z.string(),
        reason: z.string(),
      }),
    })

    const validated = schema.parse(parsed)

    return {
      id: '',
      journalEntryId: '',
      provider: 'claude',
      enneagramType: validated.enneagramType as any,
      confidence: validated.confidence,
      ontologicalPhrase: validated.ontologicalPhrase,
      observation: validated.observation,
      readingSuggestion: validated.readingSuggestion,
      rawAnalysis: rawContent,
      createdAt: new Date(),
    }
  }
}
