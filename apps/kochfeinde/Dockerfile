FROM node:22 AS builder

WORKDIR /app

COPY package*.json ./
COPY apps/kochfeinde/package*.json ./apps/kochfeinde/

RUN npm ci

COPY . .

RUN npm run build --workspace=apps/kochfeinde


FROM node:22-slim

WORKDIR /app

COPY package*.json ./
COPY apps/kochfeinde/package*.json ./apps/kochfeinde/

RUN npm ci --omit=dev

COPY --from=builder /app/apps/kochfeinde/dist ./apps/kochfeinde/dist

WORKDIR /app/apps/kochfeinde

CMD ["node", "dist/server/server.js"]