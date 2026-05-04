import React, { useState, useEffect } from 'react'
import { Box, Text, useInput, type Key } from 'ink'
import { spawn } from 'child_process'
import { tmpdir } from 'os'
import { join } from 'path'
import { writeFileSync, readFileSync, unlinkSync } from 'fs'
import { JournalService } from '../../journal/journal.service.ts'
import { InsightService } from '../../insight/insight.service.ts'
import { InsightRepository } from '../../insight/insight.repository.ts'
import { Insight } from '../../shared/types.ts'
import { InsightCard } from '../components/InsightCard.tsx'
import { StatusBar } from '../components/StatusBar.tsx'

type Props = {
  onBack: () => void
}

type Step = 'editing' | 'saving' | 'analyzing' | 'done'

export function NewEntryScreen({ onBack }: Props) {
  const [step, setStep] = useState<Step>('editing')
  const [error, setError] = useState<string | null>(null)
  const [insight, setInsight] = useState<Insight | null>(null)

  useInput((input: string, key: Key) => {
    if (key.escape) {
      onBack()
    }
  })

  useEffect(() => {
    const openEditor = async () => {
      const tempFile = join(tmpdir(), `diario-${Date.now()}.txt`)
      writeFileSync(tempFile, '', 'utf8')

      const editor = process.env.EDITOR || process.env.VISUAL || (process.platform === 'win32' ? 'notepad' : 'vi')

      const child = spawn(editor, [tempFile], {
        stdio: 'inherit',
        detached: false,
      })

      child.on('exit', async (code) => {
        if (code === 0) {
          try {
            const content = readFileSync(tempFile, 'utf8').trim()
            if (content) {
              setStep('saving')
              const journalService = new JournalService()
              const entry = await journalService.createEntry(content)

              setStep('analyzing')
              const insightService = new InsightService()
              const generatedInsight = await insightService.generateInsight(content)
              const savedInsight = await new InsightRepository().saveInsight(entry.id, generatedInsight)

              setInsight(savedInsight)
              setStep('done')
            } else {
              setError('Entrada vazia. Tente novamente.')
              setStep('done')
            }
          } catch (err) {
            setError(`Erro ao processar a entrada: ${err instanceof Error ? err.message : 'Desconhecido'}`)
            setStep('done')
          }
        } else {
          setError('Editor fechado sem salvar.')
          setStep('done')
        }

        try {
          unlinkSync(tempFile)
        } catch {}
      })

      child.on('error', (err) => {
        setError(`Erro ao abrir editor: ${err.message}`)
        setStep('done')
      })
    }

    openEditor()
  }, [onBack])

  if (step === 'editing') {
    return (
      <Box flexDirection="column" height="100%">
        <Text>Abrindo editor...</Text>
        <StatusBar message="Escreva sua entrada no editor e salve ao fechar" />
      </Box>
    )
  }

  if (step === 'saving') {
    return (
      <Box flexDirection="column" height="100%">
        <Text>Salvando sua entrada...</Text>
        <StatusBar message="Aguarde enquanto salvamos sua entrada" />
      </Box>
    )
  }

  if (step === 'analyzing') {
    return (
      <Box flexDirection="column" height="100%">
        <Text>Analisando sua entrada...</Text>
        <StatusBar message="Aguarde enquanto geramos o insight" />
      </Box>
    )
  }

  return (
    <Box flexDirection="column" height="100%">
      {error ? (
        <Text color="red">{error}</Text>
      ) : insight ? (
        <>
          <Text bold>Insight gerado com sucesso</Text>
          <InsightCard insight={insight} />
        </>
      ) : (
        <Text>Entrada salva. Retornando...</Text>
      )}
      <StatusBar message="Esc voltar" />
    </Box>
  )
}