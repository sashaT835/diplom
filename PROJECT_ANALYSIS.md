# Полный анализ проекта diplom1c

## 📋 Содержание
- [Общая информация](#общая-информация)
- [Технологический стек](#технологический-стек)
- [Архитектура проекта](#архитектура-проекта)
- [База данных](#база-данных)
- [Клиентская часть (Frontend)](#клиентская-часть-frontend)
- [Серверная часть (Backend)](#серверная-часть-backend)
- [Логика взаимодействия](#логика-взаимодействия)
- [Функциональность страниц](#функциональность-страниц)
- [Деплой и запуск](#деплой-и-запуск)

---

## Общая информация

**Название проекта:** diplom1c (Titan Products)

**Тип проекта:** Полнофункциональный веб-магазин с административной панелью, системой аутентификации, корзиной, чатом и аналитикой.

**Назначение:** Интернет-магазин по продаже рулонной травы и сопутствующих услуг компании Titan.

**Архитектура:** Fullstack приложение с разделением на frontend (React + Vite + Nginx) и backend (NestJS + PostgreSQL + Prisma ORM), контейнеризированное с помощью Docker.

---

## Технологический стек

### Frontend (Client)

#### Основные технологии
- **React 19.2.0** - JavaScript библиотека для построения пользовательского интерфейса
- **Vite (rolldown-vite 7.2.5)** - Современный сборщик и dev-сервер с быстрой горячей перезагрузкой
- **React Router DOM 7.10.1** - Маршрутизация на стороне клиента
- **Bun** - Используется в Docker для сборки (альтернатива npm/yarn)
- **Nginx** - Веб-сервер для отдачи статики и проксирования API запросов

#### Библиотеки и инструменты
- **axios 1.13.2** - HTTP клиент для запросов к API
- **react-hot-toast 2.6.0** - Уведомления и тосты
- **react-icons 5.5.0** - Библиотека иконок
- **leaflet 1.9.4** + **react-leaflet 5.0.0** - Интерактивные карты (для страницы контактов)
- **recharts 3.7.0** - Библиотека для визуализации данных и графиков (аналитика)
- **@vitejs/plugin-react-swc 4.2.2** - Плагин Vite с использованием SWC компилятора
- **ESLint 9.39.1** - Линтер для проверки качества кода

### Backend (Server)

#### Основные технологии
- **NestJS 10.3.0** - Прогрессивный Node.js фреймворк для создания серверных приложений
- **TypeScript 5.3.3** - Типизированный JavaScript
- **Prisma ORM 5.8.0** - Современная ORM для работы с базой данных
- **PostgreSQL 15** - Реляционная база данных
- **Node.js ≥18.0.0** - Серверная платформа

#### Библиотеки и инструменты
- **@nestjs/jwt 11.0.2** + **passport-jwt 4.0.1** - JWT авторизация
- **@nestjs/passport 11.0.5** + **passport 0.7.0** - Стратегии аутентификации
- **bcrypt 6.0.0** - Хеширование паролей
- **@nestjs/swagger 11.2.4** - Автоматическая генерация документации API
- **class-validator 0.14.0** + **class-transformer 0.5.1** - Валидация DTO
- **multer 2.0.2** - Загрузка файлов
- **axios 1.13.2** - HTTP клиент (для интеграции с Telegram Bot API)

### DevOps и инфраструктура

- **Docker** - Контейнеризация приложения
- **Docker Compose** - Оркестрация контейнеров
- **PostgreSQL 15 Alpine** - Легковесный образ базы данных
- **Nginx Alpine** - Легковесный веб-сервер

---

## Архитектура проекта

### Структура проекта

```
diplom1c/
├── client/                    # Frontend приложение
│   ├── public/               # Статические ресурсы
│   │   ├── fonts/           # Шрифты
│   │   └── img/             # Изображения
│   ├── src/
│   │   ├── api/             # API клиенты
│   │   ├── components/      # React компоненты
│   │   ├── contexts/        # React контексты
│   │   ├── hooks/           # Кастомные хуки
│   │   ├── pages/           # Страницы приложения
│   │   ├── utils/           # Утилиты
│   │   ├── App.jsx          # Главный компонент
│   │   └── main.jsx         # Точка входа
│   ├── Dockerfile           # Docker образ для frontend
│   ├── nginx.conf           # Конфигурация Nginx
│   ├── package.json         # Зависимости frontend
│   └── vite.config.js       # Конфигурация Vite
│
├── server/                   # Backend приложение
│   ├── prisma/              # Prisma ORM
│   │   ├── schema.prisma    # Схема базы данных
│   │   ├── seed.ts          # Seed данные
│   │   └── migrations/      # Миграции БД
│   ├── src/
│   │   ├── auth/            # Модуль авторизации
│   │   ├── cart/            # Модуль корзины
│   │   ├── messages/        # Модуль сообщений (чат)
│   │   ├── prisma/          # Prisma сервис
│   │   ├── products/        # Модуль товаров
│   │   ├── requests/        # Модуль заявок
│   │   ├── services/        # Модуль услуг
│   │   ├── upload/          # Модуль загрузки файлов
│   │   ├── users/           # Модуль пользователей
│   │   ├── app.module.ts    # Главный модуль
│   │   └── main.ts          # Точка входа
│   ├── uploads/             # Загруженные файлы
│   ├── Dockerfile           # Docker образ для backend
│   ├── entrypoint.sh        # Скрипт инициализации
│   └── package.json         # Зависимости backend
│
├── docker-compose.yml        # Оркестрация контейнеров
├── DEPLOYMENT.md            # Инструкции по деплою
└── PROJECT_OVERVIEW.md      # Обзор проекта
```

### Паттерны проектирования

#### Frontend
- **Component-based architecture** - Разделение UI на переиспользуемые компоненты
- **Context API** - Глобальное управление состоянием авторизации
- **Custom Hooks** - Переиспользуемая логика (useProducts, useServices)
- **Protected Routes** - Защита маршрутов через компонент-обертку
- **API Layer** - Централизованная работа с API через отдельные модули

#### Backend
- **Modular architecture** - Разделение по функциональным модулям
- **Dependency Injection** - Внедрение зависимостей через NestJS
- **DTO Pattern** - Data Transfer Objects для валидации данных
- **Repository Pattern** - Работа с БД через Prisma ORM
- **Guards & Decorators** - Защита маршрутов и проверка ролей
- **Interceptors** - Обработка запросов и ответов

---

## База данных

### Технология
- **PostgreSQL 15** - Реляционная база данных
- **Prisma ORM** - ORM с автогенерацией типов TypeScript

### Модели данных

#### Product (Товары)
```prisma
model Product {
  id            Int        @id @default(autoincrement())
  name          String     # Название товара
  price         Float      # Цена
  image         String?    # URL изображения
  description   String?    # Описание
  category      String?    # Категория
  variants      String[]   # Варианты (массив)
  benefits      String[]   # Преимущества (массив)
  features      String[]   # Характеристики (массив)
  viewCount     Int        # Счетчик просмотров
  purchaseCount Int        # Счетчик покупок
  createdAt     DateTime   # Дата создания
  updatedAt     DateTime   # Дата обновления
  cartItems     CartItem[] # Связь с корзиной
  purchases     Purchase[] # Связь с покупками
}
```

**Использование:**
- Хранение каталога товаров
- Аналитика просмотров и покупок
- Поддержка нескольких категорий
- Гибкое описание через массивы свойств

#### Service (Услуги)
```prisma
model Service {
  id          Int      @id @default(autoincrement())
  name        String   # Название услуги
  price       Float    # Цена
  description String?  # Описание
  createdAt   DateTime
  updatedAt   DateTime
}
```

**Использование:**
- Каталог дополнительных услуг (укладка, уход и т.д.)
- Простая структура без аналитики

#### User (Пользователи)
```prisma
model User {
  id        Int        @id @default(autoincrement())
  email     String     @unique  # Email (логин)
  password  String              # Хешированный пароль
  firstName String?             # Имя
  lastName  String?             # Фамилия
  phone     String?             # Телефон
  birthDate DateTime?           # Дата рождения
  language  String     @default("ru")  # Язык интерфейса
  role      String     @default("user") # Роль (user/admin)
  createdAt DateTime
  updatedAt DateTime
  cartItems CartItem[]          # Корзина пользователя
  purchases Purchase[]          # История покупок
  sentMessages     Message[]    # Отправленные сообщения
  receivedMessages Message[]    # Полученные сообщения
}
```

**Роли:**
- `user` - обычный пользователь
- `admin` - администратор с полными правами

**Использование:**
- Аутентификация через email/password
- Профиль пользователя с персональными данными
- Ролевая модель доступа

#### CartItem (Корзина)
```prisma
model CartItem {
  id        Int      @id @default(autoincrement())
  userId    Int      # ID пользователя
  productId Int      # ID товара
  quantity  Int      @default(1)  # Количество
  createdAt DateTime
  updatedAt DateTime
  user      User     # Связь с пользователем
  product   Product  # Связь с товаром
  
  @@unique([userId, productId])  # Один товар один раз в корзине
}
```

**Использование:**
- Временное хранение выбранных товаров
- Управление количеством
- Уникальность по паре user+product

#### Purchase (Покупки)
```prisma
model Purchase {
  id         Int      @id @default(autoincrement())
  productId  Int      # ID товара
  userId     Int?     # ID пользователя (может быть null)
  quantity   Int      @default(1)      # Количество
  totalPrice Float    @default(0)      # Общая стоимость
  createdAt  DateTime
  product    Product  # Связь с товаром
  user       User?    # Связь с пользователем
}
```

**Использование:**
- История покупок для аналитики
- Связь с пользователем и товаром
- Данные для построения статистики

#### Message (Сообщения чата)
```prisma
model Message {
  id         Int      @id @default(autoincrement())
  content    String   # Текст сообщения
  senderId   Int      # ID отправителя
  receiverId Int      # ID получателя
  isRead     Boolean  @default(false)  # Прочитано ли
  createdAt  DateTime
  updatedAt  DateTime
  sender     User     # Связь с отправителем
  receiver   User     # Связь с получателем
  
  @@index([senderId, receiverId])  # Индекс для быстрого поиска
}
```

**Использование:**
- Личные сообщения между пользователями и админом
- Статус прочтения
- Система поддержки

### Миграции

База данных развивалась через следующие миграции:
1. **20260109162529_init** - Инициализация базовых таблиц
2. **20260109163727_add_product_details** - Детали товаров
3. **20260112105505_add_services_table** - Таблица услуг
4. **20260112115130_add_users_table** - Таблица пользователей
5. **20260112124236_add_cart_items** - Корзина
6. **20260113085711_add_user_role** - Роли пользователей
7. **20260113092245_make_product_image_optional** - Опциональное изображение
8. **20260114072009_add_messages_table** - Чат
9. **20260209065448_add_analytics_views_purchases** - Аналитика

---

## Клиентская часть (Frontend)

### Точка входа и маршрутизация

#### main.jsx
- Рендеринг корневого компонента React
- Подключение глобальных стилей

#### App.jsx
- **BrowserRouter** - клиентская маршрутизация
- **AuthProvider** - контекст авторизации для всего приложения
- **Toaster** - глобальные уведомления с кастомными стилями
- Определение всех маршрутов приложения

**Маршруты:**
- `/` - Главная страница (HomePage)
- `/catalog` - Каталог товаров (CatalogPage)
- `/services` - Услуги (ServicesPage)
- `/about` - О компании (AboutPage)
- `/contacts` - Контакты (ContactsPage)
- `/profile` 🔒 - Профиль пользователя (защищенный)
- `/checkout` 🔒 - Оформление заказа (защищенный)
- `/admin` 🔒 - Админ панель (защищенный)
- `/chat` 🔒 - Чат поддержки (защищенный)

### API Layer (client/src/api/)

Централизованная работа с backend через отдельные модули.

#### axios.js
**Назначение:** Базовая настройка HTTP клиента

**Функциональность:**
- Создание экземпляра axios с базовым URL
- **Request interceptor** - автоматическое добавление JWT токена к каждому запросу
- **Response interceptor** - обработка ошибок авторизации (401)
- При 401 ошибке - удаление токенов и редирект на главную

```javascript
// Автоматическое добавление токена
config.headers.Authorization = `Bearer ${token}`;

// Обработка 401
if (error.response?.status === 401) {
  deleteCookie("token");
  deleteCookie("user");
  window.location.href = "/";
}
```

#### auth.js
**Методы:**
- `register(userData)` - Регистрация нового пользователя
- `login(credentials)` - Вход в систему
- `logout()` - Выход (удаление cookies)
- `getCurrentUser()` - Получение текущего пользователя из cookies
- `getToken()` - Получение JWT токена
- `isAuthenticated()` - Проверка авторизации

**Работа с токенами:**
- Сохранение JWT токена в cookies (7 дней)
- Сохранение данных пользователя в cookies
- Автоматическая очистка при logout

#### cart.js
**Методы:**
- `getCart()` - Получить корзину
- `addToCart(productId, quantity)` - Добавить товар
- `updateCartItemQuantity(itemId, quantity)` - Обновить количество
- `removeFromCart(itemId)` - Удалить товар
- `clearCart()` - Очистить корзину

#### user.js
**Методы:**
- `getProfile()` - Получить профиль
- `updateProfile(data)` - Обновить профиль

#### messages.js
**Методы:**
- `getMyChat()` - Получить свой чат (для пользователя)
- `getAdminChats()` - Получить все чаты (для админа)
- `getConversation(userId)` - Получить переписку с пользователем
- `sendMessage(receiverId, content)` - Отправить сообщение
- `markAsRead(userId)` - Пометить как прочитанное

#### analytics.js
**Методы:**
- `trackView(productId)` - Отследить просмотр товара
- `checkoutProducts()` - Зафиксировать покупку (при оформлении заказа)

### Contexts (Управление состоянием)

#### AuthContext.jsx
**Назначение:** Глобальное управление состоянием авторизации

**State:**
- `user` - данные текущего пользователя
- `isAuthenticated` - флаг авторизации
- `loading` - загрузка при инициализации

**Методы:**
- `login(credentials)` - вход в систему
- `register(userData)` - регистрация
- `logout()` - выход
- `updateUser(updatedUser)` - обновление данных пользователя

**Логика:**
- При загрузке приложения проверяет cookies
- Автоматическое восстановление сессии
- Провайдер оборачивает все приложение

### Custom Hooks

#### useProducts.js
**Назначение:** Загрузка и управление списком товаров

**Возвращает:**
- `products` - массив товаров
- `loading` - состояние загрузки
- `error` - ошибка загрузки
- `refetch` - функция перезагрузки

#### useServices.js
**Назначение:** Загрузка и управление списком услуг

**Возвращает:**
- `services` - массив услуг
- `loading` - состояние загрузки
- `error` - ошибка загрузки
- `refetch` - функция перезагрузки

### Components (Компоненты)

#### Header
**Функциональность:**
- Навигационное меню
- Отображение корзины с счетчиком товаров
- Иконка пользователя (логин/профиль)
- Модальные окна авторизации и регистрации
- Модальное окно корзины
- Адаптивное мобильное меню

**Логика:**
- Проверка авторизации для доступа к корзине
- Автоматическое обновление счетчика корзины
- Переключение между модалками

#### Footer
**Функциональность:**
- Контактная информация
- Ссылки на социальные сети
- Копирайт

#### AuthModal
**Функциональность:**
- Форма входа (email, password)
- Валидация полей
- Отправка данных через AuthContext
- Переключение на регистрацию

#### RegisterModal
**Функциональность:**
- Форма регистрации (email, firstName, password)
- Валидация полей
- Создание аккаунта через AuthContext
- Переключение на вход

#### CartModal
**Функциональность:**
- Отображение товаров в корзине
- Изменение количества (+/-)
- Удаление товаров
- Подсчет общей суммы
- Переход к оформлению заказа

#### ProductModal
**Функциональность:**
- Детальная информация о товаре
- Выбор варианта товара
- Добавление в корзину
- Галерея изображений (если есть)
- Список характеристик и преимуществ

#### OrderSuccessModal
**Функциональность:**
- Поздравление с успешным заказом
- Номер заказа
- Информация о дальнейших шагах
- Кнопка возврата в каталог

#### RequestModal
**Функциональность:**
- Форма заявки на услугу
- Поля: имя, телефон, email
- Отправка заявки через API

#### ProtectedRoute
**Функциональность:**
- Защита маршрутов от неавторизованных пользователей
- Редирект на главную при отсутствии авторизации
- Показ loader во время проверки

### Pages (Страницы)

#### HomePage (/)
**Секции:**
1. **MainSection** - Главный баннер с CTA кнопками
2. **PopularProduct** - Популярные товары (топ по покупкам)
3. **InfoSection** - Информация о компании/преимуществах
4. **VideoBlock** - Видео презентация
5. **ContactSection** - Форма обратной связи
6. **Footer** - Подвал сайта

**Особенности:**
- Динамическая загрузка популярных товаров через API
- Плавная анимация при скролле
- CTA кнопки для перехода в каталог

#### CatalogPage (/catalog)
**Компоненты:**
1. **HeroSection** - Заголовок страницы
2. **CatalogContent** - Сетка товаров с фильтрами

**Функциональность:**
- Отображение всех товаров из БД
- Фильтрация по категориям
- Поиск по названию
- Сортировка (по цене, по популярности)
- Открытие ProductModal при клике на товар
- Добавление в корзину
- Отслеживание просмотров (analytics)

**Логика фильтрации:**
- Клиентская фильтрация после загрузки всех товаров
- Возможность комбинации фильтров

#### ServicesPage (/services)
**Функциональность:**
- Список всех услуг
- Карточки с описанием и ценой
- Кнопка "Заказать услугу" открывает RequestModal
- Информация о процессе заказа

#### AboutPage (/about)
**Секции:**
- История компании
- Миссия и ценности
- Команда
- Достижения

#### ContactsPage (/contacts)
**Функциональность:**
- Интерактивная карта (Leaflet)
- Контактная информация (адрес, телефон, email)
- Часы работы
- Форма обратной связи

#### ProfilePage (/profile) 🔒
**Функциональность:**
- Редактирование профиля (имя, фамилия, телефон, дата рождения)
- Изменение языка интерфейса
- Смена пароля
- История заказов (если реализовано)
- Кнопка выхода из аккаунта

**Доступ:**
- Только для авторизованных пользователей
- Редирект при отсутствии авторизации

#### CheckoutPage (/checkout) 🔒
**Функциональность:**
- Отображение товаров из корзины
- Редактирование количества
- Удаление товаров
- Форма контактных данных (имя, телефон, email)
- Согласие на обработку данных
- Подсчет итоговой суммы
- Оформление заказа

**Логика оформления:**
1. Валидация формы
2. Запись покупок в аналитику (Purchase)
3. Очистка корзины
4. Отправка уведомления в Telegram (опционально)
5. Показ OrderSuccessModal

**Доступ:**
- Только для авторизованных пользователей
- Редирект если корзина пуста

#### AdminPage (/admin) 🔒
**Функциональность:**
1. **Управление товарами:**
   - Просмотр всех товаров в таблице
   - Создание нового товара
   - Редактирование существующего
   - Удаление товара
   - Загрузка изображений (drag & drop или выбор файла)
   - Управление категориями, вариантами, характеристиками

2. **Управление услугами:**
   - Просмотр всех услуг
   - Создание/редактирование/удаление услуг

3. **Аналитика (AnalyticsTab):**
   - Топ просматриваемых товаров
   - Топ покупаемых товаров
   - Графики и диаграммы (Recharts)
   - Статистика по категориям

**Доступ:**
- Только для пользователей с ролью `admin`
- Проверка роли на клиенте и сервере
- Редирект при недостаточных правах

**Интерфейс:**
- Вкладки для переключения между разделами
- Модальные окна для создания/редактирования
- Превью изображений при загрузке
- Подтверждение удаления

#### ChatPage (/chat) 🔒
**Функциональность:**

**Для обычного пользователя:**
- Чат с администрацией/поддержкой
- Отправка сообщений админу
- Получение ответов
- История переписки
- Автообновление сообщений (polling каждые 3 секунды)

**Для администратора:**
- Список всех пользователей с непрочитанными сообщениями
- Выбор пользователя для ответа
- Отправка сообщений пользователю
- Счетчики непрочитанных сообщений
- Автоматическая пометка как прочитанное

**Логика:**
- Polling для обновления сообщений
- Автоскролл к последнему сообщению
- Визуальное разделение входящих/исходящих сообщений
- Метки времени

**Доступ:**
- Только для авторизованных пользователей

### Utilities

#### cookies.js
**Функции:**
- `setCookie(name, value, days)` - Установка cookie
- `getCookie(name)` - Получение cookie
- `deleteCookie(name)` - Удаление cookie

**Использование:**
- Хранение JWT токена
- Хранение данных пользователя
- Персистентная авторизация

### Стили

- **CSS Modules** - изолированные стили для каждого компонента
- **Глобальные стили** - в index.css и App.css
- **Кастомные шрифты** - Intro (из папки public/fonts)
- **Адаптивный дизайн** - медиа-запросы для мобильных устройств

### Конфигурация Nginx

```nginx
location / {
    try_files $uri $uri/ /index.html;  # SPA fallback
}

location /api {
    proxy_pass http://server:3001;  # Проксирование на backend
}
```

**Возможности:**
- Отдача статических файлов
- Проксирование API запросов на backend
- Поддержка SPA маршрутизации
- Gzip сжатие

---

## Серверная часть (Backend)

### Точка входа

#### main.ts
**Конфигурация:**
- Создание NestJS приложения
- Отдача статических файлов из папки `uploads/`
- **CORS** - разрешение запросов с frontend
- **Global Validation Pipe** - автоматическая валидация DTO
- **Swagger** - документация API на `/api`
- Запуск на порту 3001

```typescript
app.enableCors({
  origin: [
    "http://localhost:5173", // Dev
    "http://localhost",      // Production
  ],
  credentials: true,
});
```

### Модульная архитектура

#### app.module.ts
**Импортированные модули:**
- ConfigModule - переменные окружения
- PrismaModule - работа с БД
- ProductsModule - управление товарами
- ServicesModule - управление услугами
- RequestsModule - обработка заявок
- AuthModule - аутентификация
- UsersModule - управление пользователями
- CartModule - корзина
- UploadModule - загрузка файлов
- MessagesModule - чат

### Модули (Modules)

#### AuthModule
**Компоненты:**
- AuthController - эндпоинты авторизации
- AuthService - бизнес-логика
- JwtStrategy - стратегия JWT
- JwtAuthGuard - Guard для защиты маршрутов
- RolesGuard - Guard для проверки ролей

**Эндпоинты:**
- `POST /auth/register` - Регистрация
- `POST /auth/login` - Вход

**Логика регистрации:**
1. Проверка существования пользователя по email
2. Хеширование пароля (bcrypt, 10 раундов)
3. Создание пользователя в БД
4. Генерация JWT токена
5. Возврат токена и данных пользователя

**Логика входа:**
1. Поиск пользователя по email
2. Проверка пароля (bcrypt.compare)
3. Генерация JWT токена
4. Возврат токена и данных пользователя

**JWT токен содержит:**
- `sub` - ID пользователя
- `email` - Email пользователя

**Стратегия JWT:**
- Извлечение токена из заголовка Authorization
- Валидация через secret key
- Получение пользователя из БД

#### ProductsModule
**Компоненты:**
- ProductsController - CRUD операции
- ProductsService - бизнес-логика
- DTO: CreateProductDto, UpdateProductDto

**Эндпоинты:**
```
GET    /products              - Получить все товары (фильтр по категории)
GET    /products/popular      - Топ популярных товаров
GET    /products/analytics    - Аналитика (только admin)
GET    /products/:id          - Получить товар по ID
POST   /products              - Создать товар (только admin)
PATCH  /products/:id          - Обновить товар (только admin)
DELETE /products/:id          - Удалить товар (только admin)
POST   /products/:id/view     - Отследить просмотр
POST   /products/checkout     - Оформить покупку (из корзины)
```

**Аналитика:**
- Счетчик просмотров (viewCount) - увеличивается при открытии товара
- Счетчик покупок (purchaseCount) - увеличивается при оформлении заказа
- Таблица Purchase для детальной истории

**Логика checkout:**
1. Получить корзину пользователя
2. Для каждого товара создать Purchase запись
3. Увеличить purchaseCount у товаров
4. Возврат статистики

**Обработка изображений:**
- Относительные пути сохраняются в БД
- При возврате добавляется BASE_URL
- Поддержка полных URL (http/https)

#### ServicesModule
**Компоненты:**
- ServicesController - CRUD операции
- ServicesService - бизнес-логика
- DTO: CreateServiceDto, UpdateServiceDto

**Эндпоинты:**
```
GET    /services     - Получить все услуги
GET    /services/:id - Получить услугу по ID
POST   /services     - Создать услугу (только admin)
PATCH  /services/:id - Обновить услугу (только admin)
DELETE /services/:id - Удалить услугу (только admin)
```

#### CartModule
**Компоненты:**
- CartController - операции с корзиной
- CartService - бизнес-логика
- DTO: AddToCartDto, UpdateCartItemDto

**Эндпоинты:**
```
GET    /cart          - Получить корзину пользователя
POST   /cart          - Добавить товар в корзину
PUT    /cart/:itemId  - Обновить количество
DELETE /cart/:itemId  - Удалить товар
DELETE /cart          - Очистить корзину
```

**Логика:**
- Автоматическое связывание с текущим пользователем (из JWT)
- Проверка существования товара
- Если товар уже в корзине - увеличение количества
- Уникальность по паре userId+productId
- При количестве 0 - удаление из корзины

**Возвращаемые данные:**
```typescript
{
  items: CartItem[],     // Товары с полной информацией
  total: number,         // Общая сумма
  count: number          // Общее количество товаров
}
```

#### UsersModule
**Компоненты:**
- UsersController - управление профилем
- UsersService - бизнес-логика
- DTO: UpdateUserDto

**Эндпоинты:**
```
GET    /users/profile       - Получить свой профиль
PATCH  /users/profile       - Обновить свой профиль
GET    /users/:id           - Получить пользователя по ID (только admin)
```

**Функциональность:**
- Получение и обновление профиля текущего пользователя
- Возможность смены пароля
- Защита личных данных (пароль не возвращается)

#### MessagesModule
**Компоненты:**
- MessagesController - работа с чатом
- MessagesService - бизнес-логика
- DTO: CreateMessageDto

**Эндпоинты:**
```
POST   /messages                    - Отправить сообщение
GET    /messages/my-chat            - Получить свой чат (для user)
GET    /messages/admin-chats        - Получить все чаты (для admin)
GET    /messages/conversation/:userId - Получить переписку с пользователем
POST   /messages/mark-read/:userId   - Пометить сообщения как прочитанные
```

**Логика для пользователя:**
- Может отправлять сообщения только админу
- Видит только свою переписку
- Получает первого админа автоматически

**Логика для админа:**
- Видит список всех чатов с пользователями
- Может отвечать любому пользователю
- Счетчик непрочитанных сообщений на чат
- Группировка сообщений по пользователям

**Структура чата админа:**
```typescript
{
  user: User,              // Пользователь
  lastMessage: Message,    // Последнее сообщение
  unreadCount: number,     // Кол-во непрочитанных
}
```

#### RequestsModule
**Компоненты:**
- RequestsController - обработка заявок
- RequestsService - бизнес-логика

**Функциональность:**
- Прием заявок с сайта (форма обратной связи, заказ услуг)
- Отправка уведомлений в Telegram Bot
- Сохранение заявок в БД (если требуется)

**Интеграция с Telegram:**
```typescript
TELEGRAM_BOT_TOKEN=8704894584:AAFQxTWE8Z_kowJav-CGlNdsArclI1Mar0o
TELEGRAM_CHAT_ID=-5138935561
```

#### UploadModule
**Компоненты:**
- UploadController - загрузка файлов

**Эндпоинты:**
```
POST /upload/image - Загрузить изображение (только admin)
```

**Функциональность:**
- Использование Multer для обработки multipart/form-data
- Сохранение в папку `uploads/`
- Генерация уникальных имен файлов
- Возврат URL загруженного файла
- Валидация типов файлов (только изображения)

**Конфигурация:**
- Максимальный размер файла: 5MB (настраивается)
- Разрешенные форматы: jpg, jpeg, png, gif, webp
- Хранение: локальная файловая система

#### PrismaModule
**Компоненты:**
- PrismaService - сервис для работы с БД

**Функциональность:**
- Singleton подключение к PostgreSQL
- Автоматическое закрытие соединения при завершении
- Инъекция в другие модули

### Guards & Decorators

#### JwtAuthGuard
**Назначение:** Защита маршрутов, требующих авторизации

**Использование:**
```typescript
@UseGuards(JwtAuthGuard)
@Get('profile')
getProfile(@Request() req) {
  return req.user; // user из JWT
}
```

#### RolesGuard
**Назначение:** Проверка роли пользователя

**Использование:**
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Post()
create() {
  // Доступно только для admin
}
```

#### @Roles() Decorator
**Назначение:** Указание требуемых ролей для маршрута

### DTO (Data Transfer Objects)

#### Валидация
Все DTO используют class-validator для валидации:
```typescript
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  image?: string;

  // ...
}
```

**Преимущества:**
- Автоматическая валидация на входе
- Типизация для TypeScript
- Документация в Swagger
- Защита от некорректных данных

### Swagger документация

**Доступ:** `http://localhost:3001/api`

**Возможности:**
- Интерактивная документация всех эндпоинтов
- Схемы запросов и ответов
- Возможность тестирования API прямо из браузера
- Автогенерация из декораторов

**Декораторы:**
- @ApiTags() - группировка эндпоинтов
- @ApiOperation() - описание операции
- @ApiResponse() - возможные ответы
- @ApiParam() - параметры пути
- @ApiQuery() - query параметры
- @ApiBody() - тело запроса

---

## Логика взаимодействия клиента с сервером

### Аутентификация

1. **Регистрация:**
   ```
   Client → POST /auth/register {email, password, firstName}
   Server → hash password, create user, generate JWT
   Server → {access_token, user}
   Client → save token to cookies, update AuthContext
   ```

2. **Вход:**
   ```
   Client → POST /auth/login {email, password}
   Server → find user, verify password, generate JWT
   Server → {access_token, user}
   Client → save token to cookies, update AuthContext
   ```

3. **Защищенные запросы:**
   ```
   Client → GET /cart (Authorization: Bearer <token>)
   Server → verify JWT, extract userId
   Server → execute query with userId
   Server → return data
   ```

### Работа с корзиной

1. **Добавление товара:**
   ```
   User → clicks "Add to cart" on product
   Client → POST /cart {productId, quantity}
   Server → check if exists, create/update CartItem
   Server → return CartItem
   Client → show toast "Added to cart"
   Client → update cart counter
   ```

2. **Просмотр корзины:**
   ```
   User → clicks cart icon
   Client → GET /cart
   Server → find CartItems for userId, include products
   Server → calculate total and count
   Server → {items, total, count}
   Client → display CartModal with items
   ```

3. **Оформление заказа:**
   ```
   User → fills checkout form, clicks "Order"
   Client → POST /products/checkout
   Server → get cart items
   Server → create Purchase records
   Server → increment purchaseCount
   Server → send notification to Telegram
   Client → DELETE /cart (clear cart)
   Server → delete all CartItems for user
   Client → show OrderSuccessModal
   ```

### Работа с товарами

1. **Просмотр каталога:**
   ```
   User → navigates to /catalog
   Client → GET /products
   Server → find all products, format images
   Server → [{id, name, price, image, ...}]
   Client → render grid with products
   ```

2. **Фильтрация:**
   ```
   User → selects category
   Client → GET /products?category=Рулонная трава
   Server → filter by category
   Server → [filtered products]
   Client → update grid
   ```

3. **Открытие товара:**
   ```
   User → clicks on product
   Client → POST /products/:id/view
   Server → increment viewCount
   Client → open ProductModal with details
   ```

### Админ панель

1. **Создание товара:**
   ```
   Admin → fills form, uploads image
   Client → POST /upload/image (multipart)
   Server → save file, return URL
   Client → POST /products {name, price, image: URL, ...}
   Server → create product in DB
   Server → return created product
   Client → refresh products list
   Client → show success toast
   ```

2. **Редактирование товара:**
   ```
   Admin → clicks edit, modifies fields
   Client → PATCH /products/:id {updated fields}
   Server → update product
   Server → return updated product
   Client → refresh list
   ```

3. **Просмотр аналитики:**
   ```
   Admin → opens Analytics tab
   Client → GET /products/analytics
   Server → aggregate viewCount and purchaseCount
   Server → sort by metrics
   Server → {topViewed, topPurchased, stats}
   Client → render charts with Recharts
   ```

### Чат поддержки

1. **Пользователь отправляет сообщение:**
   ```
   User → types message, clicks send
   Client → POST /messages {receiverId: adminId, content}
   Server → create Message record
   Server → return message with sender/receiver
   Client → append to messages list
   Client → scroll to bottom
   ```

2. **Админ видит новый чат:**
   ```
   Admin → opens Chat page
   Client → GET /messages/admin-chats
   Server → find all messages with admin
   Server → group by user
   Server → count unread messages
   Server → [{user, lastMessage, unreadCount}]
   Client → display list of chats with badges
   ```

3. **Админ отвечает:**
   ```
   Admin → selects user, types reply
   Client → POST /messages {receiverId: userId, content}
   Server → create Message record
   Server → return message
   Client → append to conversation
   ```

4. **Автообновление (Polling):**
   ```
   Client → setInterval(3000)
   Client → GET /messages/conversation/:userId
   Server → return updated messages
   Client → update messages state
   Client → POST /messages/mark-read/:userId
   Server → mark all as read
   ```

### Профиль пользователя

1. **Загрузка профиля:**
   ```
   User → navigates to /profile
   Client → GET /users/profile
   Server → find user by JWT userId
   Server → return user (without password)
   Client → populate form fields
   ```

2. **Обновление профиля:**
   ```
   User → modifies fields, clicks save
   Client → PATCH /users/profile {firstName, phone, ...}
   Server → update user in DB
   Server → return updated user
   Client → updateUser in AuthContext
   Client → show success message
   ```

---

## Функциональность страниц

### Открытые страницы (Без авторизации)

| Страница | Путь | Основной функционал |
|----------|------|---------------------|
| Главная | `/` | Баннер, популярные товары, информация, видео, контакты |
| Каталог | `/catalog` | Список всех товаров, фильтры, поиск, добавление в корзину |
| Услуги | `/services` | Список услуг, заказ услуг через форму |
| О компании | `/about` | История, миссия, команда, достижения |
| Контакты | `/contacts` | Карта, контактная информация, форма связи |

### Защищенные страницы (Требуют авторизации)

| Страница | Путь | Требования | Функционал |
|----------|------|------------|------------|
| Профиль | `/profile` | Авторизация | Редактирование данных, смена пароля, история |
| Оформление заказа | `/checkout` | Авторизация | Корзина, форма контактов, оплата |
| Чат | `/chat` | Авторизация | Переписка с поддержкой, история сообщений |
| Админ панель | `/admin` | Авторизация + роль admin | Управление товарами, услугами, аналитика |

### Модальные окна

| Компонент | Триггер | Функционал |
|-----------|---------|------------|
| AuthModal | Клик на иконку пользователя | Форма входа |
| RegisterModal | "Регистрация" в AuthModal | Форма регистрации |
| CartModal | Клик на иконку корзины | Просмотр корзины, изменение количества |
| ProductModal | Клик на товар | Детали товара, добавление в корзину |
| OrderSuccessModal | После оформления заказа | Подтверждение заказа |
| RequestModal | "Заказать" на странице услуг | Форма заявки на услугу |

---

## Деплой и запуск

### Docker Compose архитектура

Проект состоит из 3 сервисов:

#### 1. Database (PostgreSQL)
```yaml
services:
  db:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: Titan
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
```

**Особенности:**
- Alpine версия (легковесная)
- Персистентное хранилище через volume
- Healthcheck для зависимостей

#### 2. Server (NestJS Backend)
```yaml
services:
  server:
    build: ./server
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://postgres:postgres@db:5432/Titan
      PORT: 3001
      TELEGRAM_BOT_TOKEN: ...
      TELEGRAM_CHAT_ID: ...
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./server/uploads:/app/uploads
```

**Особенности:**
- Ждет готовности БД (healthcheck)
- Автоматический запуск миграций Prisma (через entrypoint.sh)
- Персистентное хранилище для uploads
- Интеграция с Telegram Bot

#### 3. Client (React Frontend)
```yaml
services:
  client:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - server
```

**Особенности:**
- Двухэтапная сборка (Bun + Nginx)
- Nginx проксирует /api на backend
- SPA fallback для React Router

### Процесс запуска

**Команда:**
```bash
docker-compose up --build
```

**Последовательность:**
1. Запуск PostgreSQL контейнера
2. Ожидание healthcheck БД
3. Сборка и запуск backend:
   - Установка зависимостей (npm install)
   - Генерация Prisma Client
   - Применение миграций (prisma migrate deploy)
   - Запуск seed (опционально)
   - Старт NestJS сервера
4. Сборка и запуск frontend:
   - Установка зависимостей (bun install)
   - Сборка production build (bun run build)
   - Копирование в Nginx
   - Старт Nginx

### Доступность

После запуска:
- **Frontend:** http://localhost
- **Backend API:** http://localhost:3001
- **Swagger Docs:** http://localhost:3001/api
- **Database:** localhost:5432

### Переменные окружения

#### Server (.env)
```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/Titan?schema=public
PORT=3001
JWT_SECRET=your-secret-key
TELEGRAM_BOT_TOKEN=bot-token
TELEGRAM_CHAT_ID=chat-id
BASE_URL=http://localhost:3001
```

#### Client (.env)
```env
VITE_API_URL=http://localhost:3001
```

### Скрипты

#### Backend (package.json)
```json
{
  "start:prod": "node dist/main",
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate dev",
  "prisma:studio": "prisma studio",
  "prisma:seed": "prisma db seed"
}
```

#### Frontend (package.json)
```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

### Миграции базы данных

**Создание миграции:**
```bash
cd server
npx prisma migrate dev --name migration_name
```

**Применение миграций:**
```bash
npx prisma migrate deploy
```

**Seed данных:**
```bash
npm run prisma:seed
```

### Backup и восстановление

**Backup базы:**
```bash
docker exec diplom1c_db pg_dump -U postgres Titan > backup.sql
```

**Восстановление:**
```bash
docker exec -i diplom1c_db psql -U postgres Titan < backup.sql
```

---

## Дополнительная функциональность

### Аналитика

**Метрики товаров:**
- **viewCount** - счетчик просмотров (увеличивается при открытии ProductModal)
- **purchaseCount** - счетчик покупок (увеличивается при checkout)

**Таблица Purchase:**
- Детальная история всех покупок
- Связь с пользователем и товаром
- Количество и общая стоимость
- Временные метки

**Визуализация:**
- Топ просматриваемых товаров
- Топ покупаемых товаров
- Графики тенденций (Recharts)
- Статистика по категориям

### Интеграция с Telegram

**Функциональность:**
- Отправка уведомлений о новых заказах
- Отправка заявок на услуги
- Настраивается через environment variables

**Пример:**
```typescript
await axios.post(
  `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
  {
    chat_id: TELEGRAM_CHAT_ID,
    text: `Новый заказ #${orderId}...`,
  }
);
```

### Загрузка изображений

**Поддержка:**
- Drag & Drop файлов
- Выбор через input
- Превью перед отправкой
- Валидация типа и размера
- Хранение в `/uploads`

**Ограничения:**
- Максимальный размер: 5MB
- Форматы: jpg, jpeg, png, gif, webp

### Карты (Leaflet)

**Использование:**
- Интерактивная карта на странице контактов
- Маркер местоположения офиса
- Возможность перемещения и масштабирования

---

## Безопасность

### Аутентификация и авторизация

1. **JWT токены:**
   - Хранятся в cookies (HttpOnly опционально)
   - Срок действия: 7 дней
   - Автоматическое добавление к запросам

2. **Хеширование паролей:**
   - Bcrypt с 10 раундами
   - Пароли никогда не возвращаются в ответах

3. **Защита маршрутов:**
   - JwtAuthGuard для авторизации
   - RolesGuard для проверки ролей
   - ProtectedRoute на клиенте

### Валидация данных

1. **Backend:**
   - Class-validator для всех DTO
   - Автоматическая валидация через ValidationPipe
   - Whitelist для удаления лишних полей

2. **Frontend:**
   - Валидация форм перед отправкой
   - Проверка типов и форматов
   - Пользовательские сообщения об ошибках

### CORS

Настроен для разрешения запросов только с:
- http://localhost:5173 (development)
- http://localhost (production)

### SQL Injection

Защита через Prisma ORM:
- Параметризованные запросы
- Автоматическое экранирование
- Типобезопасность

---

## Производительность

### Frontend оптимизации

1. **Сборка:**
   - Vite (Rolldown) для быстрой сборки
   - Code splitting
   - Tree shaking
   - Минификация

2. **Изображения:**
   - Lazy loading
   - Оптимизация размеров
   - WebP формат

3. **Кеширование:**
   - Browser cache для статики
   - Service Worker (опционально)

### Backend оптимизации

1. **База данных:**
   - Индексы на часто запрашиваемые поля
   - Efficient queries через Prisma
   - Connection pooling

2. **Статика:**
   - Nginx для отдачи файлов
   - Gzip сжатие

3. **API:**
   - Pagination для больших списков (можно добавить)
   - Select только нужные поля

---

## Возможные улучшения

### Функциональные
- [ ] Pagination для каталога
- [ ] Wishlist (избранное)
- [ ] Сравнение товаров
- [ ] Рейтинги и отзывы
- [ ] Реальная система оплаты
- [ ] Email уведомления
- [ ] WebSocket для чата (вместо polling)
- [ ] Продвинутая аналитика (Google Analytics)
- [ ] SEO оптимизация (мета-теги, SSR)
- [ ] Мультиязычность (i18n)

### Технические
- [ ] Unit и E2E тесты
- [ ] CI/CD pipeline
- [ ] Логирование (Winston, Pino)
- [ ] Мониторинг (Prometheus, Grafana)
- [ ] Rate limiting
- [ ] Redis для кеширования
- [ ] S3 для хранения изображений
- [ ] CDN для статики
- [ ] Kubernetes для оркестрации
- [ ] SSL сертификаты

---

## Заключение

**diplom1c** — это полнофункциональный современный веб-магазин, построенный на актуальных технологиях:

**Ключевые особенности:**
- ✅ Полный CRUD для товаров и услуг
- ✅ Система авторизации с JWT
- ✅ Ролевая модель (user/admin)
- ✅ Корзина и оформление заказов
- ✅ Чат поддержки
- ✅ Админ панель с аналитикой
- ✅ Адаптивный дизайн
- ✅ Контейнеризация через Docker
- ✅ Полная документация API (Swagger)
- ✅ Типобезопасность (TypeScript, Prisma)

**Архитектурные преимущества:**
- Четкое разделение frontend и backend
- Модульная архитектура на обеих сторонах
- Централизованная работа с API
- Переиспользуемые компоненты и хуки
- Валидация данных на всех уровнях
- Безопасное хранение паролей
- Защита маршрутов и ролевой доступ

**Технологический стек:**
- React 19 + Vite для современного frontend
- NestJS + Prisma для надежного backend
- PostgreSQL для реляционных данных
- Docker для простого деплоя
- Nginx для production-ready hosting

Проект готов к дальнейшему развитию и масштабированию.
