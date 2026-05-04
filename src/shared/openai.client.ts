import OpenAI from 'openai'
import { z } from 'zod'
import { validateEnv } from './env'
import { AIProviderClient, Insight } from './types'

let client: OpenAI | null = null

function getOpenAIClient(): OpenAI {
  if (!client) {
    const env = validateEnv()
    if (!env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is required to use OpenAI provider')
    }
    client = new OpenAI({ apiKey: env.OPENAI_API_KEY })
  }
  return client
}

export class OpenAIClient implements AIProviderClient {
  async generateInsight(content: string): Promise<Omit<Insight, 'id' | 'journalEntryId' | 'createdAt'>> {
    const openai = getOpenAIClient()

    const systemPrompt = `Você é um analista especializado em Eneagrama e visão ontológica. 
Analise textos de diário pessoal e identifique:
1. O tipo de Eneagrama provável (1-9)
2. A confiança na análise (low, medium, high)
3. Uma frase ontológica inspiradora em português
4. Uma observação sobre o texto em português
5. Uma sugestão de leitura adequada

Responda APENAS com um JSON válido no formato especificado.`

    const userPrompt = `Analise o seguinte texto de diário pessoal:

${content}

Responda com JSON neste formato:
{
  "enneagramType": número entre 1 e 9,
  "confidence": "low" | "medium" | "high",
  "ontologicalPhrase": string,
  "observation": string,
  "readingSuggestion": {
    "title": string,
    "author": string,
    "reason": string
  }
}`

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      })

      const rawContent = completion.choices[0]?.message?.content || ''

      const jsonMatch = rawContent.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in OpenAI response')
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
        provider: 'openai',
        enneagramType: validated.enneagramType as any,
        confidence: validated.confidence,
        ontologicalPhrase: validated.ontologicalPhrase,
        observation: validated.observation,
        readingSuggestion: validated.readingSuggestion,
        rawAnalysis: rawContent,
      }
    } catch (error) {
      console.error('OpenAI API error:', error)
      throw new Error(`Failed to generate insight with OpenAI: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}
