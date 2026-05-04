import { GoogleGenerativeAI } from '@google/generative-ai'
import { z } from 'zod'
import { validateEnv } from './env'
import { AIProviderClient, Insight } from './types'

let client: GoogleGenerativeAI | null = null

function getGeminiClient(): GoogleGenerativeAI {
  if (!client) {
    const env = validateEnv()
    if (!env.GOOGLE_API_KEY) {
      throw new Error('GOOGLE_API_KEY is required to use Gemini provider')
    }
    client = new GoogleGenerativeAI(env.GOOGLE_API_KEY)
  }
  return client
}

export class GeminiClient implements AIProviderClient {
  async generateInsight(content: string): Promise<Omit<Insight, 'id' | 'journalEntryId' | 'createdAt'>> {
    const genAI = getGeminiClient()
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `Analise o seguinte texto de diário pessoal e gere insights baseados no Eneagrama.

Texto:
${content}

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

IMPORTANTE: Responda APENAS com o JSON, sem texto adicional.`

    try {
      const result = await model.generateContent(prompt)
      const response = result.response
      const text = response.text()

      // Parse and validate the response
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in Gemini response')
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
        provider: 'gemini',
        enneagramType: validated.enneagramType as any,
        confidence: validated.confidence,
        ontologicalPhrase: validated.ontologicalPhrase,
        observation: validated.observation,
        readingSuggestion: validated.readingSuggestion,
        rawAnalysis: text,
      }
    } catch (error) {
      console.error('Gemini API error:', error)
      throw new Error(`Failed to generate insight with Gemini: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}
