import React, { useState, useEffect } from 'react'
import { Box, Text, useInput, type Key } from 'ink'
import { JournalService } from '../../journal/journal.service.ts'
import { JournalEntry } from '../../journal/journal.model.ts'
import { EntryList } from '../components/EntryList.tsx'
import { StatusBar } from '../components/StatusBar.tsx'

type Props = {
  onSelectEntry: (entry: JournalEntry) => void
  onNewEntry: () => void
  onQuit: () => void
}

export function HomeScreen({ onSelectEntry, onNewEntry, onQuit }: Props) {
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const journalService = new JournalService()
    journalService.listEntries().then(setEntries).finally(() => setLoading(false))
  }, [])

  useInput((input: string, key: Key) => {
    if (key.upArrow) {
      setSelectedIndex(Math.max(0, selectedIndex - 1))
    } else if (key.downArrow) {
      setSelectedIndex(Math.min(entries.length - 1, selectedIndex + 1))
    } else if (input === 'n') {
      onNewEntry()
    } else if (key.return) {
      if (entries[selectedIndex]) {
        onSelectEntry(entries[selectedIndex])
      }
    } else if (input === 'q') {
      onQuit()
    }
  })

  if (loading) {
    return <Text>Carregando entradas...</Text>
  }

  return (
    <Box flexDirection="column" height="100%">
      <Text bold>Diário do Ser</Text>
      <Text>Entradas recentes:</Text>
      {entries.length > 0 ? (
        <EntryList entries={entries} selectedIndex={selectedIndex} />
      ) : (
        <Text color="gray">Nenhuma entrada ainda. Pressione 'n' para criar a primeira.</Text>
      )}
      <StatusBar message="↑↓ navegar | Enter selecionar | n nova entrada | q sair" />
    </Box>
  )
}