# Agent Guide

## Overview
- `app/` is the React + Vite frontend.
- `cli/` is the Bun-based CLI entrypoint.
- `db/` holds local database assets (DuckDB, Postgres, SQLite).

## Tooling
- Package manager/runtime: `bun`.
- Lint/format: `biome`.
- TypeScript: `~5.9` with ESM (`"type": "module"`).
- Styling: Tailwind CSS v4; global styles live in `app/index.css`.

## Common Commands
- `bun run app:dev` runs the Vite dev server.
- `bun run app:build` builds the frontend (includes TypeScript type checking).
- `bun run app:lint` runs Biome on `app/`.
- `bun run app:fix` formats and fixes `app/`.
- `bun run cli:dev` runs the CLI directly.
- `bun run cli:build` builds the CLI binary.
- `bun run lint` runs Biome on the whole repo.
- `bun run fix` formats and fixes the whole repo.
- `bun run build` builds app then CLI.

## Conventions
- Only use `bun` (no `npm` or `pnpm`).
- Always run `bun run lint`, `bun run fix`, and TypeScript type checking before finishing work.
- Never write custom CSS; always use Tailwind and shadcn/ui components.
