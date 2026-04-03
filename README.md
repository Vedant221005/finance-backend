# Finance Data Processing and Access Control Backend

Production-ready backend API for finance data processing with role-based access control.

This project is built with Node.js, TypeScript, Express, Prisma, and SQLite. It includes authentication, RBAC, transaction management, dashboard analytics, validation, error handling, Swagger docs, and automated tests.

## Assignment 

This implementation covers all core requirements from the screening assignment:

- User and role management
- Financial records management
- Dashboard summary APIs
- Access control logic
- Validation and error handling
- Data persistence

Optional enhancements included:

- JWT authentication
- Pagination and search
- Soft delete
- Rate limiting on auth routes
- Swagger API documentation
- Unit/integration testing with Jest and Supertest

## Tech Stack

- Runtime: Node.js
- Language: TypeScript
- Framework: Express
- ORM: Prisma
- Database: SQLite
- Validation: Zod
- Auth: JWT + bcrypt
- Security: Helmet + express-rate-limit
- API Docs: Swagger UI + swagger-jsdoc
- Tests: Jest + Supertest

## Project Structure

```text
src/
  config/
  middlewares/
  modules/
    auth/
    users/
    transactions/
    dashboard/
    health/
  utils/
  validators/
  types/
  docs/
  app.ts
  server.ts

prisma/
  schema.prisma
  seed.ts

tests/
```

## Features

### 1. Authentication

- Register user
- Login user
- Password hashing with bcrypt
- JWT token generation and verification
- Token expiry handling

### 2. Role-Based Access Control (RBAC)

Roles:

- VIEWER
- ANALYST
- ADMIN

Permission model:

- VIEWER: Dashboard read access
- ANALYST: Dashboard + transaction read/write access
- ADMIN: Full access, including user management

### 3. User Management (ADMIN)

- List users (pagination)
- Get user by id
- Update user role
- Activate/deactivate user
- Delete user

### 4. Transactions

- Create transaction
- List transactions
- Get transaction by id
- Update transaction
- Soft delete transaction

Filtering support:

- type
- category
- date range
- free-text search
- pagination
- sorting

### 5. Dashboard APIs

- Overview
- Totals (income, expenses, net)
- Category breakdown
- Monthly trends
- Weekly summary
- Recent transactions

### 6. Validation and Error Handling

- Zod request validation
- Centralized error middleware
- Consistent JSON error responses
- Appropriate HTTP status codes

## API Documentation

Swagger UI is available at:

- http://localhost:5000/api-docs

## Environment Variables

Create a `.env` file in the root:

```env
NODE_ENV="development"
PORT="5000"
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-strong-secret-at-least-32-chars"
JWT_EXPIRES_IN="1h"
RATE_LIMIT_WINDOW_MS="900000"
RATE_LIMIT_MAX="20"
```

## Setup and Run

1. Install dependencies

```bash
npm install
```

2. Run Prisma migration

```bash
npx prisma migrate dev --name init
```

3. Seed sample data

```bash
npm run prisma:seed
```

4. Start development server

```bash
npm run dev
```

Server URL:

- http://localhost:5000

## Build and Test

Build:

```bash
npm run build
```

Run tests:

```bash
npm test
```

## Seeded Test Users

After seeding, these users are available:

- admin@finance.local / Admin@123
- analyst@finance.local / Analyst@123
- viewer@finance.local / Viewer@123

## Example Authentication Flow (Swagger)

1. Open Swagger UI at `/api-docs`
2. Execute `POST /api/auth/login`
3. Copy `data.token` from response
4. Click `Authorize`
5. Paste token value

Important:

- Paste only the raw token in Swagger authorize dialog
- Do not add `Bearer ` manually there

## API Route Summary

Auth:

- POST `/api/auth/register`
- POST `/api/auth/login`

Users (ADMIN):

- GET `/api/users`
- GET `/api/users/:id`
- PATCH `/api/users/:id/role`
- PATCH `/api/users/:id/active`
- DELETE `/api/users/:id`

Transactions (ANALYST, ADMIN):

- GET `/api/transactions`
- POST `/api/transactions`
- GET `/api/transactions/:id`
- PATCH `/api/transactions/:id`
- DELETE `/api/transactions/:id`

Dashboard (VIEWER, ANALYST, ADMIN):

- GET `/api/dashboard/overview`
- GET `/api/dashboard/totals`
- GET `/api/dashboard/category-breakdown`
- GET `/api/dashboard/monthly-trends`
- GET `/api/dashboard/weekly-summary`
- GET `/api/dashboard/recent-transactions`

Health:

- GET `/api/health`

## Data Model (Prisma)

- User model
  - id, name, email, password, role, isActive, timestamps
- Transaction model
  - id, amount, type, category, date, notes, soft-delete fields, user relation, timestamps

Enums:

- Role: ADMIN, ANALYST, VIEWER
- TransactionType: INCOME, EXPENSE

## Assumptions and Design Decisions

- JWT access token is used for auth; no refresh token flow in this version.
- SQLite is used for simplicity and local evaluation.
- Soft delete is applied only to transactions.
- User delete is hard delete (ADMIN only).
- VIEWER cannot access transactions list/CRUD endpoints.
- ANALYST can manage transactions but cannot manage users.

## Reliability and Security Notes

- Helmet secures common HTTP headers.
- Auth routes are rate-limited.
- Passwords are stored as bcrypt hashes.
- User activity status is checked during authentication.

## What to Submit

For screening submission, include:

- Repository URL
- This README
- Optional deployed URL and Swagger link
- Notes on assumptions/tradeoffs

## Future Improvements

- Refresh token rotation and logout token invalidation
- Docker and CI pipeline
- Expanded test coverage for edge cases and performance
- Audit logging for sensitive actions
