FROM node:22 AS builder

ENV NODE_ENV=production
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

COPY --from=builder /app/apps/kochfeinde/.output ./apps/kochfeinde/.output

WORKDIR /app/apps/kochfeinde

CMD ["node", ".output/server/index.mjs"]