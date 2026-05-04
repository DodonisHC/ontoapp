# Stack Analysis

## Runtime & Language
- **Node.js**: v25.9.0 (engines: >=20.0.0)
- **TypeScript**: 5.3.3 (strict mode, ES2022 target)
- **Module System**: ES modules (type: "module" in package.json)

## Frontend Stack
- **Framework**: React 18.2.0
- **Build Tool**: Vite 5.4.0
- **Language**: TypeScript with JSX (react-jsx transform)
- **Path Aliases**: @/* mapped to src/*

## Backend Stack
- **Runtime**: Node.js with Express 5.2.1
- **API Style**: REST endpoints (/api/entries)
- **Database ORM**: Prisma 5.7.1
- **Database**: SQLite (dev) / PostgreSQL (prod) via DATABASE_URL

## AI/ML Stack
- **Primary**: Anthropic Claude SDK (@anthropic-ai/sdk ^0.17.1)
- **Alternatives**: 
  - Google Generative AI (@google/generative-ai ^0.21.0)
  - OpenAI (openai ^4.71.1)
- **Validation**: Zod 3.22.4 for environment and response validation

## Development Tools
- **Testing**: Vitest 1.0.4
- **Linting**: ESLint 8.57.1 (temporarily disabled due to TypeScript config)
- **Formatting**: Prettier 3.1.1
- **Git Hooks**: Husky 8.0.3
- **TypeScript Runtime**: ts-node 10.9.2 with ESM loader

## Key Dependencies
- **Web Server**: Express + CORS
- **Environment**: dotenv for configuration
- **Database**: Prisma Client for ORM operations
- **Validation**: Zod for schema validation

## Configuration Files
- **TypeScript**: tsconfig.json with strict mode, path aliases, experimental decorators
- **Vite**: vite.config.ts (React plugin)
- **Prisma**: prisma/schema.prisma (SQLite provider)
- **Environment**: .env.example template available

## Build & Deployment
- **Frontend Build**: `npm run build:web` (Vite)
- **Backend Start**: `npm run start:api` (ts-node ESM loader)
- **Development**: Dual server setup (API + Web dev servers)
- **Quality Gates**: `npm run harness` (typecheck + lint + test)

## Notable Configuration Issues
- ESLint disabled due to TypeScript parser configuration conflicts
- tsconfig.json has `allowImportingTsExtensions: true` which requires noEmit or emitDeclarationOnly
- Main entry point still references non-existent src/index.ts
