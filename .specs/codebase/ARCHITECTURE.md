# Architecture Analysis

## High-Level Architecture
```
┌─────────────────┐    HTTP API    ┌─────────────────┐
│   React Web     │ ◄──────────────► │   Express API   │
│   (Frontend)    │                │   (Backend)     │
└─────────────────┘                └─────────────────┘
                                           │
                                           ▼
                                  ┌─────────────────┐
                                  │   Prisma ORM    │
                                  │   + Database    │
                                  └─────────────────┘
```

## Frontend Architecture
- **Framework**: React 18 with functional components and hooks
- **Structure**: Component-based with separation of pages and components
- **State Management**: Local component state (no global state library)
- **Routing**: Not yet implemented (single-page implied)
- **Build**: Vite for bundling and development server

### Frontend Directory Structure
```
src/web/
├── App.tsx              # Main React application
├── main.tsx             # React entry point
└── components/
    ├── EntryList.tsx    # Lists journal entries
    └── InsightCard.tsx  # Displays insight data
```

## Backend Architecture
- **Framework**: Express.js with REST API design
- **Pattern**: Service layer pattern with repository abstraction
- **Error Handling**: Try-catch blocks with HTTP status codes
- **Validation**: Input validation in route handlers

### API Endpoints
- `GET /api/entries` - List all journal entries
- `GET /api/entries/:id` - Get specific entry
- `POST /api/entries` - Create entry + generate insight

## Domain Architecture (Bounded Contexts)

### Journal Domain
```
src/journal/
├── journal.model.ts      # JournalEntry type definition
├── journal.service.ts    # Business logic for entries
└── journal.repository.ts # Database operations
```

### Insight Domain  
```
src/insight/
├── insight.model.ts      # Insight type definition
├── insight.service.ts    # AI analysis logic
└── insight.repository.ts # Insight persistence
```

### Enneagram Domain
```
src/enneagram/
├── enneagram.model.ts    # Type definitions
├── enneagram.data.ts     # Static enneagram data
└── enneagram.service.ts  # Enneagram business logic
```

### Shared Domain
```
src/shared/
├── types.ts              # Common type definitions
├── env.ts                # Environment validation
├── claude.client.ts      # Claude API wrapper
└── claude.prompts.ts     # AI prompt templates
```

## Data Flow Architecture
1. **User Input** → React Component → HTTP Request
2. **Express API** → Service Layer → Repository Layer → Database
3. **AI Analysis** → Service Layer → External API (Claude/Gemini/OpenAI)
4. **Response** → Database → API → Frontend → UI Update

## Database Architecture
- **ORM**: Prisma with SQLite (development) / PostgreSQL (production)
- **Schema**: Two main entities with one-to-one relationship
  - `JournalEntry`: Core journal content
  - `Insight`: AI-generated analysis linked to entry

## AI Integration Architecture
- **Multi-Provider**: Abstracted service supporting Claude, Gemini, OpenAI
- **Validation**: Zod schemas for API responses
- **Error Handling**: Graceful degradation for AI failures
- **Prompts**: Centralized prompt templates

## Configuration Architecture
- **Environment**: dotenv with Zod validation
- **Build**: TypeScript compilation with strict mode
- **Development**: Hot reload with Vite and ts-node
- **Quality**: Type checking, testing, linting pipeline

## Security Architecture
- **CORS**: Configured for cross-origin requests
- **Input Validation**: Basic string validation in API routes
- **Environment Variables**: Sensitive data in .env files
- **Database**: Parameterized queries via Prisma ORM

## Deployment Architecture
- **Frontend**: Static files from Vite build
- **Backend**: Node.js server process
- **Database**: External PostgreSQL (production) or local SQLite
- **Environment**: Configurable via DATABASE_URL

## Architectural Concerns
- No authentication/authorization system
- No global state management for complex UI state
- Limited error recovery mechanisms
- No caching layer for AI responses
- Missing routing system for multi-page navigation
