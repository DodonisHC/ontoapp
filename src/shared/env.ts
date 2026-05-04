import { z } from 'zod'

const envSchema = z.object({
  ANTHROPIC_API_KEY: z.string().min(1).optional(),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
})

export type Env = z.infer<typeof envSchema>

let env: Env

export function validateEnv(): Env {
  if (!env) {
    const result = envSchema.safeParse(process.env)
    if (!result.success) {
      console.error('Invalid environment variables:', result.error.format())
      process.exit(1)
    }
    env = result.data
  }
  return env
}