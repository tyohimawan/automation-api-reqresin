# API Test Automation — reqres.in

API integration test suite for the [reqres.in](https://reqres.in) mock REST API, built with **Mocha + Chai + TypeScript** using the Service Object Pattern.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Mocha](https://mochajs.org/) | Test runner |
| [Chai](https://www.chaijs.com/) | Assertion library (BDD `expect` style) |
| [TypeScript](https://www.typescriptlang.org/) | Type safety across tests and source |
| [Axios](https://axios-http.com/) | HTTP client |
| [Mochawesome](https://github.com/adamgruber/mochawesome) | HTML test report generation |
| [ESLint](https://eslint.org/) + [@typescript-eslint](https://typescript-eslint.io/) | Static code analysis |
| [dotenv](https://github.com/motdotla/dotenv) | Environment variable management |

---

## Prerequisites

- Node.js >= 18
- npm >= 9
- A free API key from [app.reqres.in](https://app.reqres.in)

---

## Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd automation-api-reqresin

# 2. Install dependencies
npm install

# 3. Configure environment variables
# macOS / Linux
cp .env.example .env
# Windows
copy .env.example .env

# Edit .env and replace the placeholder with your actual API key
```

---

## Running Tests

### Console output (default)
```bash
npm test
```

### Watch mode (re-runs on file change)
```bash
npm run test:watch
```

### Generate HTML report
```bash
npm run test:report
```
Then open `mochawesome-report/test-report.html` in a browser.

---

## Linting

```bash
# Check for lint errors
npm run lint

# Auto-fix fixable issues
npm run lint:fix
```

---

## Project Structure

```
automation-api-reqresin/
├── src/
│   ├── services/
│   │   └── UserService.ts       # Service layer — wraps all /users API calls
│   ├── types/
│   │   └── user.types.ts        # TypeScript interfaces for requests and responses
│   └── utils/
│       └── httpClient.ts        # Axios instance with base URL, headers, and timeout
├── test/
│   ├── testCases/
│   │   └── user.testcases.ts    # Data-driven test case definitions (positive + negative)
│   └── users.test.ts            # Main test suite — 25 test cases across all CRUD operations
├── .env.example                 # Environment variable template
├── .eslintignore                # ESLint ignore rules
├── .eslintrc.json               # ESLint configuration
├── .gitignore
├── .mocharc.json                # Mocha runner configuration (timeout, reporter, spec pattern)
├── package.json
├── README.md
└── tsconfig.json                # TypeScript compiler configuration
```

---

## Test Suite

| Step | Endpoint | Method | Cases |
|---|---|---|---|
| 1 | `/api/users` | POST | Create user (valid, empty fields, concurrent uniqueness) |
| 2 | `/api/users?page=2` | GET | List users (pagination, meta fields, user fields, out-of-range page) |
| 3 | `/api/users/:id` | PUT | Update user (full update, partial update, non-existent user) |
| 4 | `/api/users/:id` | GET | Get single user (valid ID, user fields, 404 for missing user) |
| 5 | `/api/users/:id` | DELETE | Delete user (204 response, non-existent user) |

Each step covers both **positive** and **negative** scenarios. Test cases are data-driven and defined separately from test logic in `test/testCases/user.testcases.ts`.

---

## Architecture

### Service Object Pattern
`UserService` encapsulates all HTTP calls. Tests never call Axios directly — they go through the service layer, which makes the suite resilient to transport-layer changes.

### Data-Driven Test Cases
Test inputs and expected values are declared as typed arrays in `user.testcases.ts` and iterated with `forEach` in the test suite. Adding a new scenario requires only adding a new object to the relevant array.

### HTTP Client Configuration
The Axios instance in `httpClient.ts` sets `validateStatus: () => true`, which prevents Axios from throwing on non-2xx responses. This lets tests assert on all HTTP status codes (including 404, 204) without try/catch blocks.
