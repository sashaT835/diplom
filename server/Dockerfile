# Dockerfile для сервера (NestJS)
FROM node:20-alpine AS builder

WORKDIR /app

# Установка зависимостей для Prisma и утилит
RUN apk add --no-cache openssl ca-certificates curl

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
COPY prisma ./prisma/

# Устанавливаем зависимости с retry и увеличенным таймаутом
RUN npm config set fetch-retry-maxtimeout 600000 && \
    npm config set fetch-retry-mintimeout 100000 && \
    npm config set fetch-timeout 600000 && \
    npm config set maxsockets 5 && \
    npm ci --legacy-peer-deps

# Генерируем Prisma Client для Alpine Linux
ENV PRISMA_ENGINES_MIRROR="https://binaries.prisma.sh"
RUN npx prisma generate --schema=./prisma/schema.prisma

# Копируем исходники
COPY . .

# Собираем приложение
RUN npm run build

# Production образ
FROM node:20-alpine

WORKDIR /app

# Установка зависимостей для Prisma
RUN apk add --no-cache openssl ca-certificates

# Копируем package.json и устанавливаем только production зависимости
COPY package*.json ./

# Настройка npm для повышения стабильности
RUN npm config set fetch-retry-maxtimeout 600000 && \
    npm config set fetch-timeout 600000 && \
    npm ci --omit=dev --legacy-peer-deps

# Устанавливаем Prisma CLI для миграций
RUN npm install prisma@5.8.0 --save-dev --legacy-peer-deps

# Устанавливаем ts-node для выполнения seed
RUN npm install ts-node@10.9.2 typescript@5.3.3 --save-dev --legacy-peer-deps

# Копируем Prisma схему, миграции и сгенерированный клиент
COPY --from=builder /app/prisma ./prisma/
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Копируем собранное приложение
COPY --from=builder /app/dist ./dist

# Создаем директорию для uploads
RUN mkdir -p uploads

EXPOSE 3001

# Запуск с миграциями и seed
CMD ["sh", "-c", "echo 'Waiting for database...' && sleep 5 && echo 'Running migrations...' && npx prisma migrate deploy && echo 'Running seed...' && (npx prisma db seed || echo 'Seed skipped') && echo 'Starting application...' && node dist/src/main.js"]
