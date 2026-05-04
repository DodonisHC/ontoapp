import { describe, it, expect, vi, beforeEach } from 'vitest'
import { InsightService } from '../insight.service.ts'

// Mock Anthropic
vi.mock('../../shared/claude.client', () => ({
  getClaudeClient: vi.fn(() => ({
    messages: {
      create: vi.fn(() => Promise.resolve({
        content: [{
          type: 'text',
          text: JSON.stringify({
            enneagramType: 4,
            confidence: 'high',
            ontologicalPhrase: 'A beleza reside na profundidade da alma.',
            observation: 'Sua escrita revela uma sensibilidade profunda e uma busca por autenticidade emocional.',
            readingSuggestion: {
              title: 'O Caminho do Artista',
              author: 'Julia Cameron',
              reason: 'Este livro ajuda a cultivar a criatividade e a autenticidade, alinhados ao tipo 4.'
            }
          })
        }]
      }))
    }
  }))
}))

describe('InsightService', () => {
  let service: InsightService

  beforeEach(() => {
    service = new InsightService()
  })

  it('should generate insight from content', async () => {
    const content = 'Hoje me senti profundamente conectado com minhas emoções...'
    const insight = await service.generateInsight(content)

    expect(insight.enneagramType).toBe(4)
    expect(insight.confidence).toBe('high')
    expect(insight.ontologicalPhrase).toBe('A beleza reside na profundidade da alma.')
    expect(insight.observation).toContain('sensibilidade profunda')
    expect(insight.readingSuggestion.title).toBe('O Caminho do Artista')
  })
})