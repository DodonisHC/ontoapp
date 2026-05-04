import React from 'react'

type EntryListProps = {
  entries: { id: string; content: string; createdAt: string }[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function EntryList({ entries, selectedId, onSelect }: EntryListProps) {
  if (entries.length === 0) {
    return <div className="empty-state">Nenhuma entrada encontrada.</div>
  }

  return (
    <div className="entry-list">
      {entries.map(entry => (
        <button
          key={entry.id}
          className={entry.id === selectedId ? 'entry-item selected' : 'entry-item'}
          onClick={() => onSelect(entry.id)}
        >
          <strong>{new Date(entry.createdAt).toLocaleDateString('pt-BR')}</strong>
          <span>{entry.content.slice(0, 80)}{entry.content.length > 80 ? '…' : ''}</span>
        </button>
      ))}
    </div>
  )
}
