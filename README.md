# es-clinica-backend2

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines Hono, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **Hono** - Lightweight, performant server framework
- **Hono OpenAPI** - For API documentation
- **Bun** - Runtime environment
- **Drizzle** - TypeScript-first ORM
- **SQLite/Turso** - Database engine (using LibSQL client)
- **Authentication** - Better-Auth
- **Validation** - Zod
- **Linting** - Oxlint + ESLint
- **Husky** - Git hooks for code quality

## Getting Started

First, install the dependencies:

```bash
bun install
```
## Database Setup

This project uses SQLite with Drizzle ORM.

1. Start the local SQLite database:
```bash
cd packages/db && bun run db:local
```


2. Update your `.env` file in the `apps/server` directory with the appropriate connection details if needed.

3. Apply the schema to your database:
```bash
bun run db:push
```


Then, run the development server:

```bash
bun run dev
```

The API is running at [http://localhost:3000](http://localhost:3000).







## Project Structure

```
es-clinica-backend2/
├── apps/
│   └── server/      # Backend API (Hono)
├── packages/
│   ├── api/         # API layer / business logic
│   ├── auth/        # Authentication configuration & logic
│   └── db/          # Database schema & queries
```

## Linting and Type Checking

This project uses a robust linting system comprising:
- **Oxlint**: For fast, low-level linting.
- **ESLint**: For comprehensive code quality rules.
- **TypeScript**: For static type checking.

To run the full suite of checks (recommended before pushing):
```bash
bun run lint-all
```

To run only linting (Oxlint + ESLint):
```bash
bun run lint
```

To run only type checking:
```bash
bun run check-types
```

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run lint-all`: Run all lints and type checks
- `bun run lint`: Run Oxlint and ESLint
- `bun run check-types`: Check TypeScript types across all apps
- `bun run dev:web`: Start only the web application
- `bun run dev:server`: Start only the server
- `bun run db:push`: Push schema changes to database
- `bun run db:studio`: Open database studio UI
- `cd packages/db && bun run db:local`: Start the local SQLite database
