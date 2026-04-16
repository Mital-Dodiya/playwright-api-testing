# Contributing Guide

Thank you for your interest in contributing to this framework.

---

## Project Setup

```bash
git clone https://github.com/Mital-Dodiya/playwright-api-testing.git
cd playwright-api-testing
npm install
npx playwright install
```

---

## Folder Structure

```
src/utils/
  ApiHelper.ts        — Reusable HTTP methods (GET, POST, PUT, PATCH, DELETE)
  SchemaValidator.ts  — Response schema validation utilities
tests/
  users.api.spec.ts   — User endpoint tests
  posts.api.spec.ts   — Posts CRUD tests
  auth.api.spec.ts    — Nested resources and header tests
  todos.api.spec.ts   — Todos endpoint tests
  albums.api.spec.ts  — Albums and photos tests
  schema.validation.spec.ts — Schema validation tests
```

---

## Adding a New API Test File

1. Create a new file in `tests/` — e.g. `newresource.api.spec.ts`
2. Import `ApiHelper` and `SchemaValidator`

```typescript
import { test, expect } from '@playwright/test';
import { ApiHelper } from '../src/utils/ApiHelper';
import { SchemaValidator } from '../src/utils/SchemaValidator';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

test.describe('New Resource API', () => {
  let api: ApiHelper;

  test.beforeEach(({ request }) => {
    api = new ApiHelper(request, BASE_URL);
  });

  test('should return status 200', async () => {
    const response = await api.get('/newresource');
    await api.verifyStatusCode(response, 200);
  });
});
```

---

## Running Tests

```bash
npm test              # All API tests
npm run test:users    # Users tests only
npm run test:posts    # Posts tests only
npm run test:auth     # Nested resource tests
npm run report        # View HTML report
```

---

## Coding Standards

- Use TypeScript — no plain JavaScript
- Use `ApiHelper` for all HTTP requests — no direct `request.get()`
- Use `SchemaValidator` for schema checks
- Group tests using `test.describe` blocks
- Always verify status code first, then response body
- Add negative and boundary tests for every endpoint

---

## Commit Message Format

```
test: add GET /newresource endpoint tests
feat: add new validation method to SchemaValidator
fix: update base URL for staging environment
docs: update README with new test coverage
```
