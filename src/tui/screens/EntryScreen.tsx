import React, { useState } from 'react'
import { Box, Text, useInput, type Key } from 'ink'
import { JournalEntry } from '../../journal/journal.model'
import { InsightCard } from '../components/InsightCard'
import { StatusBar } from '../components/StatusBar'
import { InsightService } from '../../insight/insight.service'
import { InsightRepository } from '../../insight/insight.repository'

type Props = {
  entry: JournalEntry
  onBack: () => void
}

export function EntryScreen({ entry, onBack }: Props) {
  const [insight, setInsight] = useState(entry.insight)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useInput((input: string, key: Key) => {
    if (key.escape || input === 'b') {
      onBack()
      return
    }

    if (input === 'i' && !loading && !insight) {
      setLoading(true)
      setError(null)

      ;(async () => {
        try {
          const insightService = new InsightService()
          const generatedInsight = await insightService.generateInsight(entry.content)
          const savedInsight = await new InsightRepository().saveInsight(entry.id, generatedInsight)
          setInsight(savedInsight)
        } catch (err) {
          setError(`Erro ao gerar insight: ${err instanceof Error ? err.message : 'Desconhecido'}`)
        } finally {
          setLoading(false)
        }
      })()
    }
  })

  return (
    <Box flexDirection="column" height="100%">
      <Text bold>Entrada de {entry.createdAt.toLocaleString()}</Text>
      <Box borderStyle="single" padding={1} marginY={1}>
        <Text>{entry.content}</Text>
      </Box>
      {loading && <Text>Analisando e gerando insight...</Text>}
      {error && <Text color="red">{error}</Text>}
      {!insight && !loading && <Text color="gray">Pressione 'i' para gerar insight</Text>}
      {insight && <InsightCard insight={insight} />}
      <StatusBar message={insight ? 'Esc voltar' : 'i gerar insight | Esc voltar'} />
    </Box>
  )
}