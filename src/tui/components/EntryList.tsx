import React from 'react'
import { Box, Text } from 'ink'
import { JournalEntry } from '../../journal/journal.model'

type Props = {
  entries: JournalEntry[]
  selectedIndex: number
}

export function EntryList({ entries, selectedIndex }: Props) {
  return (
    <Box flexDirection="column">
      {entries.map((entry, index) => (
        <Box key={entry.id} marginY={0}>
          <Text
            color={index === selectedIndex ? 'green' : 'white'}
            backgroundColor={index === selectedIndex ? 'gray' : undefined}
          >
            {entry.createdAt.toLocaleDateString()} - {entry.content.slice(0, 50)}...
            {entry.insight ? ' [Com insight]' : ''}
          </Text>
        </Box>
      ))}
    </Box>
  )
}