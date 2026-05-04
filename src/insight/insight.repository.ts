import { PrismaClient } from '@prisma/client'
import { Insight } from './insight.model.ts'

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
      },
    })
    return {
      id: saved.id,
      journalEntryId: saved.journalEntryId,
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