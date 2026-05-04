# External Integrations

## AI Provider Integrations

### Anthropic Claude (Primary)
- **SDK**: @anthropic-ai/sdk ^0.17.1
- **File**: `src/shared/claude.client.ts`
- **Usage**: Journal entry analysis and insight generation
- **Configuration**: ANTHROPIC_API_KEY environment variable
- **Prompts**: Centralized in `src/shared/claude.prompts.ts`

### Google Gemini (Alternative)
- **SDK**: @google/generative-ai ^0.21.0
- **Usage**: Free tier alternative for insight generation
- **Configuration**: GOOGLE_API_KEY environment variable
- **Status**: Configured but not yet implemented in service layer

### OpenAI (Alternative)
- **SDK**: openai ^4.71.1
- **Usage**: Free tier alternative for insight generation
- **Configuration**: OPENAI_API_KEY environment variable
- **Status**: Configured but not yet implemented in service layer

## Database Integration

### Prisma ORM
- **Version**: 5.7.1
- **Client**: @prisma/client
- **Schema**: `prisma/schema.prisma`
- **Models**: JournalEntry, Insight
- **Relationship**: One-to-one (Entry → Insight)

### Database Providers
- **Development**: SQLite (local file database)
- **Production**: PostgreSQL (cloud database)
- **Configuration**: DATABASE_URL environment variable
- **Migrations**: Prisma migrate for schema changes

## Web Framework Integration

### Express.js Backend
- **Version**: 5.2.1
- **Middleware**: CORS, JSON parsing
- **Routing**: REST API with /api prefix
- **Error Handling**: Try-catch with HTTP status codes

### Vite Frontend
- **Version**: 5.4.0
- **Plugin**: @vitejs/plugin-react
- **Dev Server**: Hot module replacement
- **Build**: Static asset bundling

## Development Tool Integrations

### TypeScript Integration
- **Version**: 5.3.3
- **Runtime**: ts-node 10.9.2 with ESM loader
- **Configuration**: Strict mode, path aliases
- **Compilation**: tsc --noEmit for type checking

### Testing Integration
- **Framework**: Vitest 1.0.4
- **Environment**: Node.js for backend testing
- **Mocking**: Built-in vi.mock functionality
- **Coverage**: Integrated coverage reporting

### Code Quality Integration
- **Linting**: ESLint 8.57.1 (currently disabled)
- **Formatting**: Prettier 3.1.1
- **Git Hooks**: Husky 8.0.3 for pre-commit checks
- **Validation**: Zod 3.22.4 for environment and API responses

## Environment Integration

### Configuration Management
- **Loader**: dotenv 16.3.1
- **Validation**: Zod schemas in `src/shared/env.ts`
- **Required Variables**: DATABASE_URL
- **Optional Variables**: AI provider API keys

### CORS Integration
- **Package**: cors 2.8.6
- **Configuration**: Default permissive settings
- **Usage**: Cross-origin requests from frontend

## Missing Integrations

### Authentication & Authorization
- **Status**: Not implemented
- **Potential**: JWT, OAuth 2.0, session management
- **Needs**: User management, role-based access

### File Storage
- **Status**: Not implemented
- **Potential**: AWS S3, Cloudinary, local storage
- **Use Case**: Media attachments, exports

### Email Services
- **Status**: Not implemented
- **Potential**: SendGrid, AWS SES, Nodemailer
- **Use Case**: User notifications, sharing

### Analytics & Monitoring
- **Status**: Not implemented
- **Potential**: Google Analytics, Sentry, LogRocket
- **Use Case**: Usage tracking, error monitoring

### Search Integration
- **Status**: Not implemented
- **Potential**: Elasticsearch, Algolia, full-text search
- **Use Case**: Advanced journal entry search

## Integration Patterns

### AI Provider Abstraction
```typescript
// Current: Claude-only implementation
// Future: Multi-provider abstraction
interface AIProvider {
  generateInsight(content: string): Promise<Insight>
}
```

### Database Connection
```typescript
// Current: Direct Prisma client usage
// Pattern: Repository abstraction
class JournalRepository {
  async create(entry: JournalEntry): Promise<JournalEntry>
  async findById(id: string): Promise<JournalEntry | null>
  async list(): Promise<JournalEntry[]>
}
```

### API Response Format
```typescript
// Current: Simple JSON responses
// Future: Consistent response wrapper
interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}
```

## Integration Risks

### AI Provider Dependencies
- **Rate Limits**: API quota exhaustion
- **Cost**: Uncontrolled usage costs
- **Reliability**: Provider downtime
- **Data Privacy**: Sensitive journal content

### Database Risks
- **Migration**: Schema changes require careful planning
- **Performance**: Query optimization needed at scale
- **Backups**: Data loss prevention strategy needed

### External Service Risks
- **Network**: Latency and connectivity issues
- **Version Conflicts**: Dependency compatibility
- **Security**: Vulnerabilities in third-party packages

## Integration Monitoring

### Health Checks
- **Database**: Connection status and query performance
- **AI Services**: API response times and success rates
- **External Dependencies**: Availability monitoring

### Error Tracking
- **API Errors**: Failed requests and responses
- **AI Failures**: Insight generation failures
- **Database Errors**: Connection and query failures

### Performance Metrics
- **Response Times**: API endpoint performance
- **AI Processing**: Insight generation latency
- **Database Queries**: Slow query identification
