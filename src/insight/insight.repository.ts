import { PrismaClient } from '@prisma/client'
import { Insight } from '../shared/types'

export class InsightRepository {
  private prisma = new PrismaClient()

  async saveInsight(journalEntryId: string, insight: Omit<Insight, 'id' | 'journalEntryId' | 'createdAt'>): Promise<Insight> {
    const saved = await this.prisma.insight.create({
      data: {
        journalEntryId,
        enneagramType: insight.enneagramType,
        confidence: insight.confidence,
        ontologicalPhrase: insight.ontologicalPhrase,
        observation: insight.observation,
        readingSuggestion: JSON.stringify(insight.readingSuggestion),
        rawAnalysis: insight.rawAnalysis,
        // Note: 'provider' field needs to be added to Prisma schema
      },
    })
    return {
      id: saved.id,
      journalEntryId: saved.journalEntryId,
      provider: insight.provider || 'claude', // Default for backwards compatibility
      enneagramType: saved.enneagramType as any,
      confidence: saved.confidence as any,
      ontologicalPhrase: saved.ontologicalPhrase,
      observation: saved.observation,
      readingSuggestion: JSON.parse(saved.readingSuggestion),
      rawAnalysis: saved.rawAnalysis,
      createdAt: saved.createdAt,
    }
  }
}