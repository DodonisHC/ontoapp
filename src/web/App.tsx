import React, { useEffect, useMemo, useState } from 'react'
import { EntryList } from './components/EntryList'
import { InsightCard } from './components/InsightCard'

type ReadingSuggestion = {
  title: string
  author: string
  reason: string
}

type Insight = {
  id: string
  journalEntryId: string
  enneagramType: number
  confidence: 'low' | 'medium' | 'high'
  ontologicalPhrase: string
  observation: string
  readingSuggestion: ReadingSuggestion
  rawAnalysis: string
  createdAt: string
}

type JournalEntry = {
  id: string
  content: string
  createdAt: string
  insight?: Insight
}

type ApiError = {
  error: string
}

function formatDate(value: string) {
  return new Date(value).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function App() {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedEntry = useMemo(
    () => entries.find(entry => entry.id === selectedId) ?? null,
    [entries, selectedId],
  )

  const loadEntries = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/entries')
      if (!response.ok) {
        const payload = (await response.json()) as ApiError
        throw new Error(payload.error || 'Não foi possível carregar as entradas.')
      }
      const data = (await response.json()) as JournalEntry[]
      setEntries(data)
      if (!selectedId && data.length > 0) {
        setSelectedId(data[0].id)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEntries()
  }, [])

  const handleCreateEntry = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!content.trim()) {
      setError('O conteúdo da entrada é obrigatório.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim() }),
      })

      if (!response.ok) {
        const payload = (await response.json()) as ApiError
        throw new Error(payload.error || 'Não foi possível criar a entrada.')
      }

      const createdEntry = (await response.json()) as JournalEntry
      setEntries(prev => [createdEntry, ...prev])
      setSelectedId(createdEntry.id)
      setContent('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Diário do Ser</h1>
        <p>Escreva, salve e receba um insight baseado no Eneagrama.</p>
      </header>

      <main className="app-main">
        <section className="app-form">
          <h2>Nova Entrada</h2>
          <form onSubmit={handleCreateEntry}>
            <textarea
              value={content}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setContent(event.target.value)}
              placeholder="Escreva sua reflexão aqui..."
              rows={8}
            />
            <button type="submit" disabled={loading}>Salvar e gerar insight</button>
          </form>
          {error && <div className="alert">{error}</div>}
        </section>

        <section className="app-content">
          <div className="app-sidebar">
            <div className="sidebar-header">
              <h2>Entradas recentes</h2>
              <button onClick={loadEntries} disabled={loading}>Atualizar</button>
            </div>
            {loading ? (
              <div className="loading">Carregando...</div>
            ) : (
              <EntryList
                entries={entries}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            )}
          </div>

          <div className="app-detail">
            {selectedEntry ? (
              <>
                <div className="entry-meta">
                  <h2>Entrada</h2>
                  <span>{formatDate(selectedEntry.createdAt)}</span>
                </div>
                <pre className="entry-content">{selectedEntry.content}</pre>
                {selectedEntry.insight ? (
                  <InsightCard insight={selectedEntry.insight} />
                ) : (
                  <div className="empty-state">Nenhum insight disponível ainda.</div>
                )}
              </>
            ) : (
              <div className="empty-state">Selecione uma entrada para ver os detalhes.</div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
