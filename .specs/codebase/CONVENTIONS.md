# Code Conventions

## Naming Conventions
- **Types/Interfaces**: PascalCase (e.g., `JournalEntry`, `InsightCard`)
- **Functions/Variables**: camelCase (e.g., `createEntry`, `journalService`)
- **Files**: kebab-case for non-components (e.g., `journal.service.ts`)
- **Components**: PascalCase (e.g., `EntryList.tsx`, `InsightCard.tsx`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `DATABASE_URL`)

## File Organization
- **Domain files**: `*.model.ts`, `*.service.ts`, `*.repository.ts`
- **Test files**: `__tests__/*.test.ts` (co-located with source)
- **Components**: `components/*.tsx` (React components)
- **Shared utilities**: `shared/*.ts` (cross-cutting concerns)

## TypeScript Conventions
- **Strict Mode**: Enabled in tsconfig.json
- **Type Safety**: No `any` types, prefer `unknown` when necessary
- **Exports**: Named exports preferred over default exports
- **Import Extensions**: TypeScript extensions allowed in imports
- **Path Aliases**: `@/*` mapped to `src/*`

## Code Style
- **Indentation**: 2 spaces (Prettier default)
- **Semicolons**: Required (Prettier enforced)
- **Quotes**: Single quotes for strings
- **Trailing Commas**: Multi-line objects/arrays have trailing commas

## Domain Patterns
- **Model Files**: Pure type definitions and interfaces
- **Service Files**: Business logic, no direct database access
- **Repository Files**: Database operations only
- **Separation of Concerns**: Clear boundaries between layers

## React Conventions
- **Components**: Functional components with hooks
- **Props**: TypeScript interfaces for component props
- **State**: Local state with useState, no global state library
- **JSX**: react-jsx transform (no React import needed)

## API Conventions
- **Routes**: RESTful with `/api/` prefix
- **Error Handling**: Consistent HTTP status codes
- **Responses**: JSON format with error messages in Portuguese
- **Validation**: Input validation in route handlers

## Database Conventions
- **Schema**: Prisma schema with snake_case table names
- **Models**: PascalCase model names (@map to snake_case)
- **Relations**: Explicit foreign key relationships
- **Migrations**: Prisma migrate for schema changes

## Testing Conventions
- **Framework**: Vitest
- **Test Structure**: Arrange-Act-Assert pattern
- **Mocks**: Mock external dependencies (APIs, database)
- **Coverage**: Test business logic in service layers

## Environment Conventions
- **Variables**: `.env` file for local development
- **Validation**: Zod schemas for environment validation
- **Required**: DATABASE_URL always required
- **Optional**: API keys for AI providers

## Git Conventions
- **Commits**: Conventional commits (`feat:`, `fix:`, `chore:`)
- **Pre-commit**: Husky hooks for quality checks
- **Branching**: Feature branches for development
- **Messages**: Portuguese for user-facing messages

## Documentation Conventions
- **Comments**: JSDoc for complex functions
- **README**: Project overview and setup instructions
- **API Docs**: Inline comments for endpoint documentation
- **Code**: Self-documenting code preferred over comments
