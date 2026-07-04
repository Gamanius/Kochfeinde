FROM node:22 AS builder

WORKDIR /app

# Copy dependency manifests first
COPY package*.json ./
COPY apps/server/package*.json ./apps/server/

RUN npm ci

# Copy the rest of the repository
COPY . .

# Build only the server workspace
RUN npm run build --workspace=apps/server


FROM node:22-slim

WORKDIR /app

COPY package*.json ./
COPY apps/server/package*.json ./apps/server/

RUN npm ci --omit=dev

COPY --from=builder /app/apps/server/dist ./apps/server/dist

WORKDIR /app/apps/server

CMD ["node", "dist/index.mjs"]