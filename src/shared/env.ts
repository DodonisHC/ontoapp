import { z } from 'zod'

const envSchema = z.object({
  ANTHROPIC_API_KEY: z.string().min(1).optional(),
  GOOGLE_API_KEY: z.string().min(1).optional(),
  OPENAI_API_KEY: z.string().min(1).optional(),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
})

export type Env = z.infer<typeof envSchema>

let env: Env

function maskSensitiveValue(value: string | undefined): string {
  if (!value) return '[NOT SET]'
  if (value.length <= 8) return '***'
  return value.slice(0, 4) + '****' + value.slice(-4)
}

function formatEnvError(error: z.ZodError): Record<string, string> {
  const issues = error.issues
  const formatted: Record<string, string> = {}
  
  for (const issue of issues) {
    const path = issue.path[0] as string
    if (path.includes('KEY') || path.includes('URL')) {
      formatted[path] = `[MASKED] ${issue.message}`
    } else {
      formatted[path] = issue.message
    }
  }
  
  return formatted
}

export function validateEnv(): Env {
  if (!env) {
    const result = envSchema.safeParse(process.env)
    if (!result.success) {
      // 🔒 Security: mask sensitive values in logs
      console.error('❌ Invalid environment variables:')
      const formatted = formatEnvError(result.error)
      Object.entries(formatted).forEach(([key, message]) => {
        console.error(`  - ${key}: ${message}`)
      })
      console.error('\n🔑 API Keys status (masked):')
      console.error(`  ANTHROPIC_API_KEY: ${maskSensitiveValue(process.env.ANTHROPIC_API_KEY)}`)
      console.error(`  GOOGLE_API_KEY: ${maskSensitiveValue(process.env.GOOGLE_API_KEY)}`)
      console.error(`  OPENAI_API_KEY: ${maskSensitiveValue(process.env.OPENAI_API_KEY)}`)
      console.error(`  DATABASE_URL: ${process.env.DATABASE_URL ? '[CONFIGURED]' : '[NOT SET]'}`)
      process.exit(1)
    }
    env = result.data
  }
  return env
}

export function getAvailableProviders(): string[] {
  const env = validateEnv()
  const providers: string[] = []

  if (env.ANTHROPIC_API_KEY) providers.push('claude')
  if (env.GOOGLE_API_KEY) providers.push('gemini')
  if (env.OPENAI_API_KEY) providers.push('openai')

  return providers
}

export function hasAnyProvider(): boolean {
  return getAvailableProviders().length > 0
}