export type EnneagramType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

export type ReadingSuggestion = {
  title: string
  author: string
  reason: string
}

export type Insight = {
  id: string
  journalEntryId: string
  enneagramType: EnneagramType
  confidence: 'low' | 'medium' | 'high'
  ontologicalPhrase: string
  observation: string
  readingSuggestion: ReadingSuggestion
  rawAnalysis: string
  createdAt: Date
}

export type JournalEntry = {
  id: string
  content: string
  createdAt: Date
  insight?: Insight
}
