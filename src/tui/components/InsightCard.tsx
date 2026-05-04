import React from 'react'
import { Box, Text } from 'ink'
import { Insight } from '../../shared/types.ts'
import { ENNEAGRAM_TYPES } from '../../enneagram/enneagram.data.ts'

type Props = {
  insight: Insight
}

export function InsightCard({ insight }: Props) {
  const profile = ENNEAGRAM_TYPES.find(p => p.type === insight.enneagramType)

  return (
    <Box flexDirection="column" paddingY={1}>
      <Text bold color="cyan">
        Insight do Eneagrama
      </Text>
      <Text>
        Tipo: {profile?.name} ({insight.enneagramType}) - Confiança: {insight.confidence}
      </Text>
      <Text italic color="yellow">
        "{insight.ontologicalPhrase}"
      </Text>
      <Text>{insight.observation}</Text>
      <Text bold>Sugestão de leitura:</Text>
      <Text>
        "{insight.readingSuggestion.title}" por {insight.readingSuggestion.author}
      </Text>
      <Text color="gray">{insight.readingSuggestion.reason}</Text>
    </Box>
  )
}