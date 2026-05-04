import { z } from 'zod'
import { getClaudeClient } from '../shared/claude.client'
import { JOURNAL_ANALYSIS_PROMPT } from '../shared/claude.prompts'
import { Insight, ReadingSuggestion } from './insight.model'

const claudeResponseSchema = z.object({
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

type ClaudeResponse = z.infer<typeof claudeResponseSchema>

export class InsightService {
  async generateInsight(content: string): Promise<Insight> {
    const client = getClaudeClient()

    const message = await client.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      temperature: 0.7,
      system: JOURNAL_ANALYSIS_PROMPT,
      messages: [
        {
          role: 'user',
          content: content,
        },
      ],
    })

    const rawAnalysis = message.content[0].type === 'text' ? message.content[0].text : ''

    let parsed: ClaudeResponse
    try {
      parsed = JSON.parse(rawAnalysis)
    } catch (error) {
      throw new Error('Failed to parse Claude response as JSON')
    }

    const validated = claudeResponseSchema.parse(parsed)

    return {
      id: '', // Will be set by repository
      journalEntryId: '', // Will be set by caller
      enneagramType: validated.enneagramType as any, // Type assertion since Zod ensures 1-9
      confidence: validated.confidence,
      ontologicalPhrase: validated.ontologicalPhrase,
      observation: validated.observation,
      readingSuggestion: validated.readingSuggestion,
      rawAnalysis,
      createdAt: new Date(),
    }
  }
}