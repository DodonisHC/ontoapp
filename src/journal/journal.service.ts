import { JournalRepository } from './journal.repository'
import { JournalEntry } from './journal.model'

export class JournalService {
  private repository = new JournalRepository()

  async createEntry(content: string): Promise<JournalEntry> {
    return this.repository.createEntry(content)
  }

  async listEntries(limit = 10): Promise<JournalEntry[]> {
    return this.repository.listEntries(limit)
  }

  async getEntryById(id: string): Promise<JournalEntry | null> {
    return this.repository.getEntryById(id)
  }
}