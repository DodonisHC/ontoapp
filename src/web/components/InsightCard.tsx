import React from 'react'

type ReadingSuggestion = {
  title: string
  author: string
  reason: string
}

type Insight = {
  enneagramType: number
  confidence: 'low' | 'medium' | 'high'
  ontologicalPhrase: string
  observation: string
  readingSuggestion: ReadingSuggestion
}

type InsightCardProps = {
  insight: Insight
}

export function InsightCard({ insight }: InsightCardProps) {
  return (
    <div className="insight-card">
      <h3>Insight do Eneagrama</h3>
      <p className="insight-meta">
        Tipo <strong>{insight.enneagramType}</strong> · Confiança <strong>{insight.confidence}</strong>
      </p>
      <blockquote>{insight.ontologicalPhrase}</blockquote>
      <p>{insight.observation}</p>
      <div className="reading-suggestion">
        <strong>{insight.readingSuggestion.title}</strong> — {insight.readingSuggestion.author}
        <p>{insight.readingSuggestion.reason}</p>
      </div>
    </div>
  )
}
