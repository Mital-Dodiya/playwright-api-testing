# Playwright API Testing Framework

![API Tests](https://github.com/Mital-Dodiya/playwright-api-testing/actions/workflows/api.yml/badge.svg)
![Playwright](https://img.shields.io/badge/Playwright-v1.44-green)
![TypeScript](https://img.shields.io/badge/TypeScript-v5.4-blue)
![Tests](https://img.shields.io/badge/Tests-60%2B%20API%20Tests-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

API test automation framework built with **Playwright + TypeScript** covering REST API validation — GET, POST, PUT, PATCH, DELETE, nested resources and response header validation.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Playwright | API request handling |
| TypeScript | Type-safe scripting |
| JSONPlaceholder | Free public REST API for testing |
| GitHub Actions | CI/CD pipeline |

---

## Project Structure

```
playwright-api-testing/
├── .github/workflows/       # CI/CD - GitHub Actions
├── src/
│   └── utils/
│       └── ApiHelper.ts     # Reusable API helper class
├── tests/
│   ├── users.api.spec.ts    # User API tests
│   ├── posts.api.spec.ts    # Posts CRUD tests
│   └── auth.api.spec.ts     # Nested resources & headers
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

---

## Getting Started

```bash
git clone https://github.com/Mital-Dodiya/playwright-api-testing.git
cd playwright-api-testing
npm install
npx playwright install
```

## Run Tests

```bash
# Run all API tests
npm test

# Run users tests only
npm run test:users

# Run posts tests only
npm run test:posts

# Run nested resource tests
npm run test:auth

# View HTML report
npm run report
```

---

## Test Coverage

| Suite | Tests | Coverage |
|---|---|---|
| Users API | GET list, GET by id, 404 validation, field validation | 7 tests |
| Posts API | GET, POST, PUT, PATCH, DELETE, filter by userId | 10 tests |
| Nested Resources | Comments, user posts, todos, headers, response time | 7 tests |

**Total: 24 tests**

---

## Key Concepts Demonstrated

- Reusable `ApiHelper` class for all HTTP methods
- Status code validation (200, 201, 404)
- Response body field validation
- Query parameter filtering
- Nested resource testing
- Response header validation
- Response time assertion

---

## Author

**Mital Dodiya** — Module Lead, Test Engineer

[LinkedIn](https://linkedin.com/in/mitaldodiya) | [GitHub](https://github.com/Mital-Dodiya)
