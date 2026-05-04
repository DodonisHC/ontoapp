import { describe, it, expect, vi, beforeEach } from 'vitest'
import { JournalService } from '../journal.service.ts'

// Mock the repository
vi.mock('../journal.repository', () => ({
  JournalRepository: vi.fn().mockImplementation(() => ({
    createEntry: vi.fn((content: string) => Promise.resolve({
      id: 'test-id',
      content,
      createdAt: new Date(),
      insight: null
    })),
    listEntries: vi.fn(() => Promise.resolve([
      {
        id: '1',
        content: 'Test entry',
        createdAt: new Date(),
        insight: null
      }
    ]))
  }))
}))

describe('JournalService', () => {
  let service: JournalService

  beforeEach(() => {
    service = new JournalService()
  })

  it('should create entry', async () => {
    const content = 'New journal entry'
    const entry = await service.createEntry(content)

    expect(entry.content).toBe(content)
    expect(entry.id).toBe('test-id')
  })

  it('should list entries', async () => {
    const entries = await service.listEntries()

    expect(entries).toHaveLength(1)
    expect(entries[0].content).toBe('Test entry')
  })
})