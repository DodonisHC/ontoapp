import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { validateEnv } from './shared/env.ts'
import { JournalService } from './journal/journal.service.ts'
import { InsightService } from './insight/insight.service.ts'
import { InsightRepository } from './insight/insight.repository.ts'
import { 
  corsOptions, 
  rateLimiters, 
  securityHeaders, 
  helmetOptions,
  sanitizeInput,
  isValidUUID,
  requestSizeLimit,
  sanitizeError
} from './shared/security'

validateEnv()

const app = express()

// 🔒 Security middleware (order matters!)
app.use(helmet(helmetOptions))
app.use(securityHeaders)
app.use(cors(corsOptions))
app.use(express.json({ limit: requestSizeLimit }))

// Rate limiting for all API routes
app.use('/api', rateLimiters.api)

const journalService = new JournalService()
const insightService = new InsightService()
const insightRepository = new InsightRepository()

app.get('/api/entries', async (req, res) => {
  try {
    const entries = await journalService.listEntries()
    res.json(entries)
  } catch (error) {
    console.error('[API] Error listing entries:', error)
    const sanitized = sanitizeError(error instanceof Error ? error : new Error(String(error)))
    res.status(500).json({ error: sanitized.message })
  }
})

app.get('/api/entries/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    // 🔒 Validate UUID format
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'ID inválido.' })
    }
    
    const entry = await journalService.getEntryById(id)
    if (!entry) {
      return res.status(404).json({ error: 'Entrada não encontrada.' })
    }
    res.json(entry)
  } catch (error) {
    console.error('[API] Error fetching entry:', error)
    const sanitized = sanitizeError(error instanceof Error ? error : new Error(String(error)))
    res.status(500).json({ error: sanitized.message })
  }
})

app.post('/api/entries', rateLimiters.createEntry, async (req, res) => {
  try {
    const rawContent = String(req.body.content || '').trim()
    
    // 🔒 Validate input
    if (!rawContent) {
      return res.status(400).json({ error: 'Conteúdo da entrada é obrigatório.' })
    }
    
    // 🔒 Sanitize input to prevent XSS
    const content = sanitizeInput(rawContent)
    
    // Validate content length
    if (content.length > 10000) {
      return res.status(400).json({ error: 'Conteúdo muito longo (máximo 10000 caracteres).' })
    }

    const entry = await journalService.createEntry(content)
    const generatedInsight = await insightService.generateInsight(content)
    const savedInsight = await insightRepository.saveInsight(entry.id, generatedInsight)

    res.status(201).json({ ...entry, insight: savedInsight })
  } catch (error) {
    console.error('[API] Error creating entry:', error)
    const sanitized = sanitizeError(error instanceof Error ? error : new Error(String(error)))
    res.status(500).json({ error: sanitized.message })
  }
})

// 🔒 Health check endpoint (no rate limit)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  })
})

// 🔒 Global timeout middleware
app.use((req, res, next) => {
  res.setTimeout(30000, () => {
    res.status(408).json({ error: 'Request timeout' })
  })
  next()
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint não encontrado.' })
})

// Global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[API] Unhandled error:', err)
  const sanitized = sanitizeError(err)
  res.status(500).json({ error: sanitized.message })
})

const port = Number(process.env.PORT || 4000)
app.listen(port, () => {
  console.log(`🔒 API segura rodando em http://localhost:${port}`)
  console.log(`📊 Health check: http://localhost:${port}/api/health`)
})
