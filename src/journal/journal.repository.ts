import { PrismaClient } from '@prisma/client'
import { JournalEntry } from './journal.model'

export class JournalRepository {
  private prisma = new PrismaClient()

  async createEntry(content: string): Promise<JournalEntry> {
    const entry = await this.prisma.journalEntry.create({
      data: { content },
      include: { insight: true },
    })
    return {
      id: entry.id,
      content: entry.content,
      createdAt: entry.createdAt,
      insight: entry.insight
        ? {
            id: entry.insight.id,
            journalEntryId: entry.insight.journalEntryId,
            provider: 'claude', // Default for existing data
            enneagramType: entry.insight.enneagramType as any,
            confidence: entry.insight.confidence as any,
            ontologicalPhrase: entry.insight.ontologicalPhrase,
            observation: entry.insight.observation,
            readingSuggestion: JSON.parse(entry.insight.readingSuggestion),
            rawAnalysis: entry.insight.rawAnalysis,
            createdAt: entry.insight.createdAt,
          }
        : undefined,
    }
  }

  async listEntries(limit = 10): Promise<JournalEntry[]> {
    const entries = await this.prisma.journalEntry.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { insight: true },
    })
    return entries.map(entry => ({
      id: entry.id,
      content: entry.content,
      createdAt: entry.createdAt,
      insight: entry.insight
        ? {
            id: entry.insight.id,
            journalEntryId: entry.insight.journalEntryId,
            provider: 'claude', // Default for existing data
            enneagramType: entry.insight.enneagramType as any,
            confidence: entry.insight.confidence as any,
            ontologicalPhrase: entry.insight.ontologicalPhrase,
            observation: entry.insight.observation,
            readingSuggestion: JSON.parse(entry.insight.readingSuggestion),
            rawAnalysis: entry.insight.rawAnalysis,
            createdAt: entry.insight.createdAt,
          }
        : undefined,
    }))
  }

  async getEntryById(id: string): Promise<JournalEntry | null> {
    const entry = await this.prisma.journalEntry.findUnique({
      where: { id },
      include: { insight: true },
    })
    if (!entry) return null
    return {
      id: entry.id,
      content: entry.content,
      createdAt: entry.createdAt,
      insight: entry.insight
        ? {
            id: entry.insight.id,
            journalEntryId: entry.insight.journalEntryId,
            provider: 'claude', // Default for existing data
            enneagramType: entry.insight.enneagramType as any,
            confidence: entry.insight.confidence as any,
            ontologicalPhrase: entry.insight.ontologicalPhrase,
            observation: entry.insight.observation,
            readingSuggestion: JSON.parse(entry.insight.readingSuggestion),
            rawAnalysis: entry.insight.rawAnalysis,
            createdAt: entry.insight.createdAt,
          }
        : undefined,
    }
  }
}