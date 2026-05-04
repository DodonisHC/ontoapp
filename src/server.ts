import express from 'express'
import cors from 'cors'
import { validateEnv } from './shared/env.ts'
import { JournalService } from './journal/journal.service.ts'
import { InsightService } from './insight/insight.service.ts'
import { InsightRepository } from './insight/insight.repository.ts'

validateEnv()

const app = express()
app.use(cors())
app.use(express.json())

const journalService = new JournalService()
const insightService = new InsightService()
const insightRepository = new InsightRepository()

app.get('/api/entries', async (req, res) => {
  try {
    const entries = await journalService.listEntries()
    res.json(entries)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Não foi possível listar as entradas.' })
  }
})

app.get('/api/entries/:id', async (req, res) => {
  try {
    const entry = await journalService.getEntryById(req.params.id)
    if (!entry) {
      return res.status(404).json({ error: 'Entrada não encontrada.' })
    }
    res.json(entry)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Não foi possível recuperar a entrada.' })
  }
})

app.post('/api/entries', async (req, res) => {
  try {
    const content = String(req.body.content || '').trim()
    if (!content) {
      return res.status(400).json({ error: 'Conteúdo da entrada é obrigatório.' })
    }

    const entry = await journalService.createEntry(content)
    const generatedInsight = await insightService.generateInsight(content)
    const savedInsight = await insightRepository.saveInsight(entry.id, generatedInsight)

    res.status(201).json({ ...entry, insight: savedInsight })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Não foi possível salvar a entrada.' })
  }
})

const port = Number(process.env.PORT || 4000)
app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`)
})
