# Testing Strategy

## Current Test Setup
- **Framework**: Vitest 1.0.4
- **Configuration**: vitest.config.ts
- **Test Pattern**: `__tests__/*.test.ts` co-located with source files

## Existing Tests

### Journal Service Tests
**File**: `src/journal/__tests__/journal.service.test.ts`
- **Test Count**: 2 tests
- **Coverage**: Journal service CRUD operations
- **Mocking**: Likely mocks database operations

### Insight Service Tests  
**File**: `src/insight/__tests__/insight.service.test.ts`
- **Test Count**: 1 test
- **Coverage**: Insight generation logic
- **Mocking**: Likely mocks AI API calls

## Test Categories

### Unit Tests (Current)
- **Service Layer**: Business logic testing
- **Repository Layer**: Database operation testing
- **Domain Logic**: Enneagram analysis testing

### Missing Test Types

#### Integration Tests
- **API Endpoints**: Test full request/response cycle
- **Database Integration**: Test Prisma operations with real database
- **AI Integration**: Test actual AI provider calls (with test keys)

#### Frontend Tests
- **Component Tests**: React component rendering and interaction
- **User Interaction**: Form submission, navigation, data display
- **Integration Tests**: Full user workflows

#### End-to-End Tests
- **User Workflows**: Create entry → Generate insight → View result
- **Multi-Provider Tests**: Test Claude, Gemini, OpenAI integration
- **Error Scenarios**: Network failures, AI errors, database issues

## Test Configuration

### Vitest Setup
```typescript
// vitest.config.ts (assumed)
export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: [],
  },
})
```

### Test Database
- **Strategy**: In-memory SQLite for test isolation
- **Migrations**: Prisma test database setup
- **Cleanup**: Transaction rollback after each test

### Mocking Strategy
- **AI APIs**: Mock Claude, Gemini, OpenAI responses
- **Database**: Mock or use test database
- **Environment**: Test environment variables

## Recommended Test Structure

### Domain Tests
```
src/
├── enneagram/
│   ├── __tests__/
│   │   └── enneagram.service.test.ts    # Missing
├── insight/
│   ├── __tests__/
│   │   └── insight.service.test.ts     # ✅ Exists
├── journal/
│   ├── __tests__/
│   │   └── journal.service.test.ts     # ✅ Exists
└── shared/
    ├── __tests__/
    │   ├── env.test.ts                  # Missing
    │   └── claude.client.test.ts        # Missing
```

### API Tests
```
src/
├── __tests__/
│   ├── api.test.ts                      # Missing
│   ├── entries.test.ts                  # Missing
│   └── insights.test.ts                 # Missing
```

### Frontend Tests
```
src/web/
├── __tests__/
│   ├── App.test.tsx                     # Missing
│   ├── components/
│   │   ├── EntryList.test.tsx           # Missing
│   │   └── InsightCard.test.tsx         # Missing
│   └── integration/
│       └── journal-workflow.test.tsx    # Missing
```

## Test Data Management

### Fixtures
- **Journal Entries**: Sample entries for testing
- **Insights**: Pre-generated insight responses
- **Enneagram Data**: Test enneagram type scenarios

### Factories
- **Journal Entry Factory**: Create test entries
- **Insight Factory**: Create test insights
- **User Factory**: Future user management tests

## CI/CD Integration

### Quality Gates
- **Unit Tests**: Must pass before merge
- **Integration Tests**: Run on PR creation
- **E2E Tests**: Run on main branch

### Coverage Requirements
- **Target**: 80% code coverage minimum
- **Critical**: 100% coverage for service layer
- **Frontend**: 70% coverage for components

## Testing Best Practices

### Test Organization
- **AAA Pattern**: Arrange, Act, Assert
- **Descriptive Names**: Test what, not how
- **Single Responsibility**: One assertion per test
- **Isolation**: Independent test execution

### Mock Management
- **Realistic Mocks**: Mirror actual API responses
- **Reset Between Tests**: Clean mock state
- **Version Control**: Update mocks when APIs change

### Error Testing
- **Happy Path**: Normal operation scenarios
- **Error Cases**: Network failures, invalid input
- **Edge Cases**: Empty data, maximum limits
- **Recovery**: Error handling and fallbacks

## Performance Testing

### Load Testing
- **API Endpoints**: Concurrent request handling
- **Database**: Query performance under load
- **AI Integration**: Rate limiting and timeout handling

### Frontend Performance
- **Rendering**: Component mount/unmount performance
- **Data Loading**: Large entry list handling
- **Memory Leaks**: Component cleanup verification

## Current Gaps

### Immediate Needs
1. **Enneagram Service Tests**: No test coverage
2. **API Endpoint Tests**: No integration testing
3. **Frontend Tests**: No component testing
4. **Error Scenario Tests**: Limited error handling validation

### Future Enhancements
1. **Visual Regression**: UI component testing
2. **Accessibility Testing**: Screen reader and keyboard navigation
3. **Security Testing**: Input validation and XSS prevention
4. **Performance Monitoring**: Response time and resource usage
