# Инструкция по запуску проекта на новом компьютере

## Предварительные требования

1. **Docker Desktop** - установлен и запущен
2. **Git** - для клонирования репозитория (опционально)

## Шаги для запуска

### 1. Убедитесь, что Docker запущен

```bash
docker --version
docker-compose --version
```

### 2. Очистка предыдущих контейнеров (если есть)

```bash
docker-compose down -v
docker system prune -a --volumes
```

### 3. Сборка и запуск проекта

**Вариант 1: Стандартный запуск**

```bash
docker-compose up --build
```

**Вариант 2: Запуск в фоновом режиме**

```bash
docker-compose up --build -d
```

### 4. Если возникают проблемы с сетью при сборке Prisma

**A. Попробуйте собрать с --no-cache:**

```bash
docker-compose build --no-cache
docker-compose up
```

**B. Увеличьте timeout в Docker:**
В Docker Desktop → Settings → Docker Engine добавьте:

```json
{
  "max-concurrent-downloads": 3,
  "max-concurrent-uploads": 3
}
```

**C. Используйте VPN или другую сеть** если проблемы с доступом к binaries.prisma.sh

**D. Альтернативный метод - сборка поэтапно:**

```bash
# Сначала соберите только базу данных
docker-compose up -d db

# Подождите 10 секунд
timeout 10

# Затем соберите сервер
docker-compose up --build server

# И наконец клиент
docker-compose up --build client
```

### 5. Проверка работы

После успешного запуска:

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3001
- **База данных**: localhost:5432

### 6. Первоначальная настройка (выполняется автоматически)

При первом запуске автоматически:

- Создается база данных
- Применяются миграции
- Создается админ-аккаунт: **admin@titan.ru** / **admin123**
- Загружаются тестовые данные

### 7. Остановка проекта

```bash
docker-compose down
```

Для полного удаления включая данные:

```bash
docker-compose down -v
```

## Решение распространенных проблем

### Ошибка "Client network socket disconnected"

Это проблема с загрузкой Prisma бинарников. Решения:

1. Проверьте интернет-соединение
2. Отключите VPN/прокси или наоборот включите
3. Попробуйте другую сеть (мобильный hotspot)
4. Используйте `--no-cache` при сборке

### Ошибка "port already in use"

Порты заняты другими приложениями:

- Порт 80: остановите другие веб-серверы
- Порт 3001: остановите другие Node.js приложения
- Порт 5432: остановите локальный PostgreSQL

### Ошибка "permission denied"

На Linux/Mac может потребоваться sudo:

```bash
sudo docker-compose up --build
```

### Контейнер падает при старте

Проверьте логи:

```bash
docker-compose logs server
docker-compose logs client
docker-compose logs db
```

## Полезные команды

```bash
# Посмотреть запущенные контейнеры
docker ps

# Посмотреть логи конкретного сервиса
docker-compose logs -f server

# Перезапустить конкретный сервис
docker-compose restart server

# Зайти в контейнер
docker exec -it diplom1c_server sh

# Очистить всё Docker
docker system prune -a --volumes
```

## Технологии

- **Frontend**: React + Vite
- **Backend**: NestJS + Prisma
- **Database**: PostgreSQL 15
- **Containerization**: Docker + Docker Compose
