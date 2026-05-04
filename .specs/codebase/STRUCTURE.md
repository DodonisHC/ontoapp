# Codebase Structure

## Directory Overview
```
ontoapp/
├── .specs/                    # Spec-driven development docs
├── .windsurf/                 # IDE configuration
├── prisma/                    # Database schema and migrations
├── src/                       # Source code
├── AGENTS.md                  # Repository reference guide
├── README.md                  # Project documentation
├── package.json               # Dependencies and scripts
└── tsconfig.json              # TypeScript configuration
```

## Source Code Structure
```
src/
├── enneagram/                 # Enneagram domain logic
│   ├── enneagram.data.ts      # Static enneagram type data
│   ├── enneagram.model.ts     # Type definitions
│   └── enneagram.service.ts   # Business logic
├── insight/                   # AI insight generation
│   ├── __tests__/
│   │   └── insight.service.test.ts
│   ├── insight.model.ts        # Insight type definitions
│   ├── insight.repository.ts   # Database operations
│   └── insight.service.ts      # AI analysis logic
├── journal/                   # Journal entry management
│   ├── __tests__/
│   │   └── journal.service.test.ts
│   ├── journal.model.ts        # Entry type definitions
│   ├── journal.repository.ts   # Database operations
│   └── journal.service.ts      # Business logic
├── server.ts                  # Express API server
├── shared/                    # Cross-cutting concerns
│   ├── claude.client.ts       # Claude API wrapper
│   ├── claude.prompts.ts      # AI prompt templates
│   ├── env.ts                 # Environment validation
│   └── types.ts               # Common type definitions
└── web/                       # React frontend
    ├── App.tsx                # Main React component
    ├── components/
    │   ├── EntryList.tsx       # Entry listing component
    │   └── InsightCard.tsx     # Insight display component
    └── main.tsx               # React entry point
```

## File Details

### Core Domain Files

#### Journal Domain
- **journal.model.ts**: Defines `JournalEntry` interface
- **journal.service.ts**: CRUD operations and business logic
- **journal.repository.ts**: Direct Prisma database operations
- **journal.service.test.ts**: Unit tests for journal service

#### Insight Domain  
- **insight.model.ts**: Defines `Insight` interface and related types
- **insight.service.ts**: AI integration and insight generation
- **insight.repository.ts**: Insight persistence operations
- **insight.service.test.ts**: Unit tests for insight service

#### Enneagram Domain
- **enneagram.model.ts**: Enneagram type definitions
- **enneagram.data.ts**: Static data for 9 enneagram types
- **enneagram.service.ts**: Enneagram analysis logic

### Shared Infrastructure

#### AI Integration
- **claude.client.ts**: Anthropic Claude API wrapper
- **claude.prompts.ts**: System prompts for journal analysis

#### Configuration
- **env.ts**: Environment variable validation with Zod
- **types.ts**: Shared type definitions across domains

### Frontend Structure

#### React Components
- **App.tsx**: Main application component (root)
- **main.tsx**: React DOM entry point
- **EntryList.tsx**: Component for displaying journal entries
- **InsightCard.tsx**: Component for displaying AI-generated insights

### Backend Structure

#### API Server
- **server.ts**: Express server with REST endpoints
  - GET /api/entries - List all entries
  - GET /api/entries/:id - Get specific entry  
  - POST /api/entries - Create entry with insight

## Database Schema

### Prisma Configuration
- **Provider**: SQLite (development) / PostgreSQL (production)
- **Schema Location**: prisma/schema.prisma

### Data Models
```sql
JournalEntry {
  id: String (primary)
  content: String
  createdAt: DateTime
  insight: Insight? (one-to-one)
}

Insight {
  id: String (primary)
  journalEntryId: String (foreign key, unique)
  enneagramType: Int
  confidence: String
  ontologicalPhrase: String
  observation: String
  readingSuggestion: String
  rawAnalysis: String
  createdAt: DateTime
}
```

## Configuration Files

### Build & Development
- **package.json**: Dependencies, scripts, and project metadata
- **tsconfig.json**: TypeScript compiler configuration
- **vite.config.ts**: Vite build tool configuration
- **vitest.config.ts**: Test runner configuration

### Code Quality
- **.eslintrc.cjs**: ESLint configuration (currently disabled)
- **.prettierrc**: Code formatting rules
- **.husky/**: Git hooks for pre-commit quality checks

### Environment
- **.env.example**: Template for environment variables
- **.env**: Local environment variables (gitignored)

## Missing Components

### Frontend Gaps
- No routing system (single-page application)
- No navigation components
- No settings/configuration UI
- No form components for new entries

### Backend Gaps
- No authentication system
- No user management
- No file upload for media
- No export functionality

### Infrastructure Gaps
- No caching layer
- No logging system
- No monitoring/health checks
- No deployment configuration

## Test Coverage

### Current Tests
- **journal.service.test.ts**: 2 test cases
- **insight.service.test.ts**: 1 test case
- Total: 3 passing tests

### Missing Tests
- No integration tests
- No API endpoint tests
- No frontend component tests
- No enneagram service tests
