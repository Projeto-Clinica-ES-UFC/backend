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
bun run db:local
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
es-clinica-backend/
├── src/
│   ├── db/          # Database configuration & schema
│   ├── features/    # Domain-specific features (modules)
│   │   ├── appointment/
│   │   ├── config/
│   │   ├── patient/
│   │   ├── professional/
│   │   └── user/
│   ├── shared/      # Shared utilities, middlewares, and types
│   ├── better-auth.ts # Authentication configuration
│   ├── env.ts       # Environment variable validation
│   └── index.ts     # Application entry point
├── drizzle.config.ts # Drizzle ORM configuration
├── tsdown.config.ts  # Build configuration
└── package.json
```

## Linting and Type Checking

This project uses a robust linting system comprising:
- **Oxlint**: For fast, low-level linting.
- **ESLint**: For comprehensive code quality rules.
- **TypeScript**: For static type checking.


To run only linting (Oxlint + ESLint):
```bash
bun run lint
```

To run only type checking:
```bash
bun run check-types
```

## Available Scripts

- `bun run dev`: Start server in development mode
- `bun run build`: Build the application
- `bun run start`: Start the production server
- `bun run lint`: Run Oxlint and ESLint
- `bun run check-types`: Check TypeScript types
- `bun run db:push`: Push schema changes to database
- `bun run db:studio`: Open database studio UI
- `bun run db:local`: Start the local SQLite database
