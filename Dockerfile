FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS builder
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build
RUN npx prisma generate

FROM base AS tester
RUN npm ci --legacy-peer-deps --only=dev
COPY . .
RUN npx prisma generate

FROM node:18-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./
COPY prisma/seed.js ./prisma/
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && node dist/main.js"]