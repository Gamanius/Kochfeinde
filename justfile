BACKEND_DIR := "./apps/server"
FRONTEND_DIR := "./apps/kochfeinde"

default:
  just --list

[group("Backend")]
[group("dev")]
devserver:
    cd {{BACKEND_DIR}} && npm run dev

[group("Frontend")]
[group("dev")]
vite:
    cd {{FRONTEND_DIR}} && npm run dev

[group("dev")]
caddy: 
    caddy run --config Caddyfile-dev

[group("dev")]
[parallel]
dev: devserver vite caddy

# ── Database ───────────────────────────────────────

[group("Database")]
db-push:
    cd {{BACKEND_DIR}} && npx drizzle-kit push

[group("Database")]
db-generate:
    cd {{BACKEND_DIR}} && npx drizzle-kit generate

[group("Database")]
db-studio:
    cd {{BACKEND_DIR}} && npx drizzle-kit studio

[group("Database")]
db-seed:
    cd {{BACKEND_DIR}} && npx tsx seed.ts

# ── Install ────────────────────────────────────────

[group("Install")]
install:
    npm install