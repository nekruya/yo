# Помощник учащегося

Высокоуровневое веб-приложение для удобного управления образовательными ресурсами и активностями с разграничением прав доступа.

## Возможности
- Управление ролями и пользователями (создание, редактирование, удаление)
- Создание, редактирование и удаление курсов
- Загрузка и просмотр материалов курсов
- Просмотр и управление расписанием занятий
- Интерактивный календарь событий
- Система уведомлений
- Аутентификация и авторизация по JWT

## Требования
- Python 3.9+
- Node.js 14+ и npm
- Docker и Docker Compose (рекомендуется для развёртывания)

## Структура репозитория

```
/backend               — FastAPI (API, модели, схемы, CRUD, аутентификация, инициализация БД)
  ├─ main.py            — маршруты и события старта
  ├─ models.py          — SQLAlchemy-модели
  ├─ schemas.py         — Pydantic-схемы
  ├─ crud.py            — функции работы с БД
  ├─ auth.py            — JWT, безопасность
  ├─ database.py        — настройка подключения и инициализация БД
  └─ Dockerfile         — контейнеризация сервиса

/front                 — React (страницы, компоненты, стили)
  ├─ src/
  │  ├─ pages/         — основные страницы (Courses, Profile и т.д.)
  │  ├─ components/    — общие UI-компоненты (Header, Sidebar)
  │  ├─ services/      — API-клиенты для работы с бэкендом
  │  └─ styles/        — глобальные и модульные CSS
  ├─ public/           — статические файлы и HTML-шаблон
  └─ Dockerfile        — сборка фронтенда и Nginx

/docker-compose.yml    — настройки для одновременного запуска бэкенда и фронтенда в контейнерах
```

## Установка и запуск

### 1. Локальная разработка
#### 1.1 Бэкенд
```bash
cd backend
python -m venv .venv            # создать виртуальное окружение
# Windows
.\.venv\Scripts\activate      # активировать окружение
# macOS/Linux
# source .venv/bin/activate
pip install -r requirements.txt  # установить зависимости
uvicorn main:app --reload --port 3001
```
API доступно по адресу: `http://localhost:3001`.

#### 1.2 Фронтенд
```bash
cd front
npm install                      # установить зависимости
npm start                        # запустить приложение
```
Приложение доступно по адресу: `http://localhost:3000`.

### 2. Развёртывание в Docker
```bash
docker-compose up --build
```
- Бэкенд: `http://localhost:3001`
- Фронтенд: `http://localhost:3000`

## Структура проекта
```
/ backend   — FastAPI (API, модели, схемы, CRUD, инициализация БД)
/ front     — React (страницы, компоненты, сервисы для API)
/ docker-compose.yml — конфигурация Docker
```

## Технологии
- FastAPI, Uvicorn, SQLAlchemy, Pydantic
- React, React Router, React Query
- SQLite (по умолчанию), поддержка кастомного `DATABASE_URL`
- Docker, Docker Compose

## Основные API-эндпоинты
### Аутентификация
- **POST** `/token` — получить JWT-токен
  - Параметры формы: `username`, `password`

### Роли
- **GET** `/api/roles` — список ролей
- **POST** `/api/roles` — создать роль

### Пользователи
- **GET** `/api/users` — список пользователей
- **POST** `/api/users` — создать пользователя
- **GET** `/api/users/{id}` — получить пользователя по ID
- **PUT** `/api/users/{id}` — обновить данные пользователя
- **DELETE** `/api/users/{id}` — удалить пользователя

### Курсы
- **GET** `/api/courses` — список курсов
- **POST** `/api/courses` — создать курс
- **GET** `/api/courses/{id}` — получить курс по ID
- **PUT** `/api/courses/{id}` — обновить курс
- **DELETE** `/api/courses/{id}` — удалить курс

### Файлы курсов
- **GET** `/api/courses/{id}/files` — список файлов курса
- **POST** `/api/courses/{id}/files` — загрузить файл
- **DELETE** `/api/courses/{course_id}/files/{file_id}` — удалить файл

## Контакты
- **Автор**: Немцова Анастасия Павловна
---
