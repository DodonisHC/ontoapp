import React, { useState } from 'react'
import { HomeScreen } from './screens/HomeScreen'
import { EntryScreen } from './screens/EntryScreen'
import { NewEntryScreen } from './screens/NewEntryScreen'
import { JournalEntry } from '../journal/journal.model'

type Screen = 'home' | 'entry' | 'new-entry'

export function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)

  const handleSelectEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry)
    setScreen('entry')
  }

  const handleNewEntry = () => {
    setScreen('new-entry')
  }

  const handleBack = () => {
    setScreen('home')
  }

  const handleQuit = () => {
    process.exit(0)
  }

  switch (screen) {
    case 'home':
      return (
        <HomeScreen
          onSelectEntry={handleSelectEntry}
          onNewEntry={handleNewEntry}
          onQuit={handleQuit}
        />
      )
    case 'entry':
      return selectedEntry ? (
        <EntryScreen entry={selectedEntry} onBack={handleBack} />
      ) : (
        <HomeScreen
          onSelectEntry={handleSelectEntry}
          onNewEntry={handleNewEntry}
          onQuit={handleQuit}
        />
      )
    case 'new-entry':
      return <NewEntryScreen onBack={handleBack} />
    default:
      return (
        <HomeScreen
          onSelectEntry={handleSelectEntry}
          onNewEntry={handleNewEntry}
          onQuit={handleQuit}
        />
      )
  }
}