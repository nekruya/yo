# Project Documentation / Документация проекта

## 1. Overview / Общий обзор

This is a full-stack application called **Students Assistant** designed to manage courses, schedules, teachers, students, and administrative tasks. It includes:
- A **FastAPI** backend with JWT-based authentication and role-based access control.
- A **React** frontend using React Router, React Query, and Axios for API communication.
- SQLite database by default, managed via SQLAlchemy ORM.

Это полнофункциональное приложение **Students Assistant** для управления курсами, расписаниями, преподавателями, студентами и административным блоком. Состоит из:
- **FastAPI** бэкенда с аутентификацией на основе JWT и разграничением доступа по ролям.
- **React** фронтенда с React Router, React Query и Axios для работы с API.
- Базы данных SQLite по умолчанию, управляемой через SQLAlchemy ORM.

---

## 2. Technology Stack / Технологический стек

- Python 3.x, FastAPI, Uvicorn
- SQLAlchemy ORM, SQLite
- React 18, React Router DOM, React Query
- Axios, Bootstrap 5, React Bootstrap, React Toastify
- Passlib (bcrypt), python-jose (JWT)

- Python 3.x, FastAPI, Uvicorn
- SQLAlchemy ORM, SQLite
- React 18, React Router DOM, React Query
- Axios, Bootstrap 5, React Bootstrap, React Toastify
- Passlib (bcrypt), python-jose (JWT)

---

## 3. Project Structure / Структура проекта

```
/backend  – FastAPI application
  ├─ main.py          – маршруты и бизнес-логика API
  ├─ models.py        – SQLAlchemy модели
  ├─ schemas.py       – Pydantic схемы
  ├─ crud.py          – функции доступа к БД (CRUD)
  ├─ auth.py          – JWT и аутентификация
  ├─ database.py      – подключение и инициализация БД
  └─ static/          – загружаемые файлы (course files)

/front     – React приложение
  ├─ src/
  │  ├─ pages/       – страницы (Courses, AddCourse, Administration, Profile, etc.)
  │  ├─ services/    – API клиенты (courses.js, users.js, roles.js...)
  │  ├─ components/  – общие компоненты (Sidebar, Header, ProtectedRoute…)
  │  └─ styles.css + CSS модули
  └─ public/         – статические ассеты (favicon, index.html)
```

```
/backend  – приложение FastAPI
/front    – клиент на React
```

---

## 4. Installation & Running / Установка и запуск

### Prerequisites / Предварительные требования

- Python 3.8+ и npm / Node.js

### Backend setup / Настройка бэкенда

```bash
cd backend
python -m venv .venv
.venv/bin/activate    # Linux/Mac   или  .venv\Scripts\activate  в Windows PowerShell
pip install -r requirements.txt
uvicorn main:app --reload --port 3001
```

### Frontend setup / Настройка фронтенда

```bash
cd front
npm install
npm start
```

After both servers start, frontend at http://localhost:3000, backend API at http://localhost:3001/api

После запуска фронтенд доступен по http://localhost:3000, API бэкенда — http://localhost:3001/api

---

## 5. Authentication & Authorization / Аутентификация и авторизация

- **OAuth2PasswordBearer** с JWT (python-jose) в `auth.py`.
- Токен возвращается при `POST /token` с username/password.
- Роли (student, teacher, admin) хранятся в таблице `roles`.
- Разграничение доступа на уровне маршрутов через зависимости и проверку роли по токену.

---

## 6. Database Models / Модели базы данных

### User / Пользователь
```python
class User(Base):
  id, username, email, hashed_password, full_name, is_active
  roles: many-to-many → Role
  activities: one-to-many → UserActivity
```

### Role / Роль
```python
class Role(Base):
  id, name, description
  users: many-to-many → User
```

### UserActivity / Логи активности
```python
class UserActivity(Base):
  id, user_id, event_type, timestamp, details
```

### Course / Курс
```python
class Course(Base):
  id, title, description
  files: one-to-many → CourseFile
```

### CourseFile / Файл курса
```python
class CourseFile(Base):
  id, course_id, filename, filepath, upload_time
  url: property → /static/courses/{course_id}/{filename}
```

---

## 7. Backend API Endpoints / API маршруты

### Authentication / Аутентификация
- `POST /token` → получить JWT токен

### Users / Пользователи
- `GET /api/users` → список всех
- `POST /api/users` → создать
- `GET /api/users/{id}` → получить
- `PUT /api/users/{id}` → обновить (имя, is_active, roles)
- `DELETE /api/users/{id}` → удалить
- `GET /api/users/{id}/activities` → логи активности

### Roles / Роли
- `GET /api/roles` → список ролей
- `POST /api/roles` → создать роль

### Courses / Курсы
- `GET /api/courses` → список курсов
- `POST /api/courses` → создать курс
- `GET /api/courses/{id}` → получить курс
- `PUT /api/courses/{id}` → обновить курс
- `DELETE /api/courses/{id}` → удалить курс

#### Course Files / Файлы курсов
- `POST /api/courses/{id}/files` → загрузить файл
- `GET /api/courses/{id}/files` → список файлов

### Schedules, Teachers, Students / Расписания, Преподаватели, Студенты
- Простые CRUD на /api/schedules, /api/teachers, /api/students

---

## 8. Frontend Structure / Фронтенд

- **React Router** для SPA навигации
- **ProtectedRoute** обёртка для защищённых страниц (требует JWT токен)
- **React Query** для асинхронных запросов к API и кеширования
- **services/**: модули для работы с API (axios + interceptors для JWT)

### Основные Pages / Страницы
- `Welcome`, `Login`, `Register`, `Profile`
- `Dashboard` – домашняя страница после входа
- `Courses` – управление курсами (учитель)
- `AddCourse` – форма создания курса + загрузка файлов
- `StudentCourses` – просмотр доступных курсов (студент)
- `Teachers`, `Students` – списки преподавателей/студентов (админ)
- `Schedule`, `Calendar` – расписание и календарь
- `Administration` – админка: управление пользователями и ролями

---

## 9. User Roles & Rights / Роли и права

- **Admin**: общая админка → управление пользователями, ролями, просмотр логов
- **Teacher**: CRUD курсов, загрузка материалов
- **Student**: просмотр курсов, скачивание файлов, расписание

---

## 10. Static & File Upload / Статика и загрузка файлов

- Файлы курсов сохраняются в `backend/static/courses/{course_id}/`
- Доступ через `/static/courses/{course_id}/{filename}`
- FastAPI монтирует папку `static` на `/static` пути

---

## 11. Conclusion / Заключение

This documentation provides a comprehensive guide for understanding, running, and presenting the Students Assistant project. It covers all major components, architecture, and usage scenarios for different user roles.

Данная документация содержит полное описание архитектуры, установки, работы и возможностей проекта Students Assistant, а также сценарии использования для разных ролей пользователей.

---

## 12. Containerization / Контейнеризация

To simplify deployment, both backend and frontend can be containerized using Docker and orchestrated with docker-compose.

### Backend Dockerfile
Located at `backend/Dockerfile`:
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 3001
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3001"]
```

### Frontend Dockerfile
Located at `front/Dockerfile`, multi-stage build with nginx:
```dockerfile
# Build stage
FROM node:16-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
# nginx config serves index.html for SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration
Located at `front/nginx.conf`:
```nginx
server {
  listen 80;
  server_name localhost;
  location / {
    root /usr/share/nginx/html;
    index index.html;
    try_files $uri $uri/ /index.html;
  }
}
```

### Docker Compose
Create `docker-compose.yml` in project root:
```yaml
version: '3.8'
services:
  backend:
    build:
      context: ./backend
    container_name: students-backend
    ports:
      - "3001:3001"
    volumes:
      - ./backend:/app
      - ./backend/users.db:/app/users.db
    environment:
      - DATABASE_URL=sqlite:///./users.db

  frontend:
    build:
      context: ./front
    container_name: students-frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```

### Running with Docker Compose
In the project root, run:
```bash
docker-compose up --build
```

- Backend will be available at `http://localhost:3001`
- Frontend (served by nginx) at `http://localhost:3000`

Для запуска контейнеров выполнить в корне проекта:
```bash
docker-compose up --build
```
Контейнер с бекендом будет доступен по `http://localhost:3001`, а фронтенд по `http://localhost:3000`. 