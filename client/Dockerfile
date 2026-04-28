# Dockerfile для клиента (React + Vite + Bun)
FROM oven/bun:1 AS builder

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

# Копируем исходники
COPY . .

# Собираем production build
RUN bun run build

# Production образ с Nginx
FROM nginx:alpine

# Копируем собранные файлы
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
