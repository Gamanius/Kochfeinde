# Kochfeinde — Agent Instructions

A full-stack recipe management web app (tRPC + Drizzle + PostgreSQL backend, React 19 + TypeScript frontend). npm workspaces monorepo.

## Quick Start

```bash
just dev          # Run all: tRPC backend (tsx watch) + Vite + Caddy (reverse proxy)
just install      # npm install from root (all workspaces)
just db-push      # Push Drizzle schema to PostgreSQL
just db-generate  # Generate Drizzle migrations
just db-studio    # Open Drizzle Studio
just db-seed      # Run seed script
```

**Dev URL**: `http://localhost:8000` — Caddy proxies `/api/*` → tRPC (`:3000`), everything else → Vite (`:5173`).

## Architecture

### Backend (`backend/`)

| Layer | Location | Pattern |
|---|---|---|
| Entry | `backend/src/index.ts` | Re-exports router/types for workspace consumers |
| Server | `backend/src/server.ts` | tRPC standalone HTTP server (port 3000) |
| tRPC init | `backend/src/trpc.ts` | Context builder, `publicProcedure`, `router` factories |
| Routers | `backend/src/routers/*.ts` | tRPC procedure definitions (e.g. `hello.ts`) |
| Router merge | `backend/src/routers/index.ts` | Merges all sub-routers into `appRouter` |
| DB schema | `backend/src/db/schema.ts` | Drizzle ORM `pgTable` definitions |
| DB connection | `backend/src/db/connection.ts` | Drizzle client from `DATABASE_URL` |
| Drizzle config | `backend/drizzle.config.ts` | Drizzle Kit config |

**Data flow**: `HTTP → CORS → tRPC server → Procedure handler → DB (Drizzle/PostgreSQL)`

### Frontend (`kochfeinde/`)

| Layer | Location | Pattern |
|---|---|---|
| Entry | `kochfeinde/src/main.tsx` | tRPC + QueryClient providers wrapping `<App />` |
| tRPC client | `kochfeinde/src/api/trpc.ts` | `createTRPCReact<AppRouter>()` — full type safety |
| Components | `kochfeinde/src/components/` | React components, functional components |
| Styling | To be decided (Tailwind planned) | |
| App | `kochfeinde/src/App.tsx` | Root component |

### Shared (`packages/shared/`)

| Layer | Location | Pattern |
|---|---|---|
| Zod schemas | `packages/shared/src/index.ts` | Shared validation schemas & TypeScript types |
| Consumed by | `@kochfeinde/shared` | Imported by both backend and frontend |

### Database

- PostgreSQL via Docker Compose (`postgres:latest`)
- Drizzle ORM — SQL-like query building with full TypeScript inference
- Connection via `DATABASE_URL=postgres://postgres@localhost:5432/`
- Tables (planned): `users`, `ingredients`, `recipes`, `recipe_step`, `recipe_ingredients`

### Conventions

- **TypeScript**: `noUnusedLocals`/`noUnusedParameters` strict — clean up unused code. `verbatimModuleSyntax: true` — use `import type` for type-only imports. `jsx: "react-jsx"`.
- **Monorepo**: npm workspaces. Root `package.json` orchestrates `kochfeinde/`, `backend/`, `packages/*`.
- **Packages**: `@kochfeinde/shared` (shared Zod schemas), `@kochfeinde/backend` (tRPC server).
- **API**: tRPC under `/api/*`, proxied through Caddy. Server runs on port 3000.
- **Testing**: None exist yet — create as needed.

## Authentication (Planned)

Not yet implemented. Design intent: JWT-based cookie auth with refresh tokens and OTP/2FA support via the `users` table.