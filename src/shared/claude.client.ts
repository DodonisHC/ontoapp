import Anthropic from '@anthropic-ai/sdk'
import { validateEnv } from './env.ts'

let client: Anthropic

export function getClaudeClient(): Anthropic {
  if (!client) {
    const env = validateEnv()
    if (!env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is required to generate insights')
    }
    client = new Anthropic({
      apiKey: env.ANTHROPIC_API_KEY,
    })
  }
  return client
}