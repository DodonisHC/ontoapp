import { AIProvider, Insight } from '../shared/types'
import { AIProviderFactory } from '../shared/ai.provider-factory'

export class InsightService {
  async generateInsight(content: string, provider?: AIProvider): Promise<Insight> {
    // Use specified provider or default
    const aiProvider = provider || AIProviderFactory.getDefaultProvider()
    const client = AIProviderFactory.createClient(aiProvider)

    try {
      const insightData = await client.generateInsight(content)
      
      return {
        id: '', // Will be set by repository
        journalEntryId: '', // Will be set by caller
        ...insightData,
        createdAt: new Date(),
      }
    } catch (error) {
      // If primary provider fails, try fallback providers
      if (provider) {
        // This was a specific provider request, don't fallback
        throw error
      }
      
      // Try fallback providers
      const availableProviders = AIProviderFactory.getAvailableProviders()
      const fallbackProviders = availableProviders.filter(p => p !== aiProvider)
      
      for (const fallbackProvider of fallbackProviders) {
        try {
          console.log(`Primary provider ${aiProvider} failed, trying fallback: ${fallbackProvider}`)
          const fallbackClient = AIProviderFactory.createClient(fallbackProvider)
          const insightData = await fallbackClient.generateInsight(content)
          
          return {
            id: '',
            journalEntryId: '',
            ...insightData,
            createdAt: new Date(),
          }
        } catch (fallbackError) {
          console.warn(`Fallback provider ${fallbackProvider} also failed:`, fallbackError)
          continue
        }
      }
      
      // All providers failed
      throw new Error(`All AI providers failed. Last error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async generateInsightWithProvider(content: string, provider: AIProvider): Promise<Insight> {
    return this.generateInsight(content, provider)
  }

  getAvailableProviders(): AIProvider[] {
    return AIProviderFactory.getAvailableProviders()
  }
}