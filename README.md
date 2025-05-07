# Помощник учащегося

## Обзор
Полнофункциональное веб-приложение для управления образовательными ресурсами и активностями с разграничением прав доступа:
- **Администратор**: управление пользователями (создание, обновление, удаление), настройка ролей, отчёты
- **Преподаватель**: создание и редактирование курсов, планирование расписания, загрузка материалов, взаимодействие со студентами
- **Студент**: просмотр курсов и расписания, доступ к материалам, участие в обсуждениях, получение уведомлений
- **Расписание**: навигация по дням недели, интерактивные карточки занятий, добавление/редактирование через модальные окна
- **Календарь**: drag-and-drop событий, добавление/редактирование/удаление через модальные окна, поддержка повторяющихся событий
- **Уведомления**: использование cogo-toast для информирования пользователя

## Структура проекта
```
course/ (корневая папка проекта)
├── backend/                # Python FastAPI бэкенд
│   ├── main.py             # точка входа приложения
│   └── requirements.txt    # зависимости Python
├── front/                  # React фронтенд (Create React App)
│   ├── public/             # статические файлы
│   ├── src/                # исходный код (components, pages, services, styles)
│   ├── package.json        # npm-скрипты и зависимости
│   └── .gitignore
├── README.md               # этот файл
└── .gitignore              # глобальные исключения Git
```

## Установка и запуск

### Бэкенд
```bash
cd backend
# Создать и активировать виртуальное окружение (Windows)
python -m venv .venv
.\.venv\Scripts\activate  
# или (Mac/Linux)
# source venv/bin/activate

# Установить зависимости
pip install -r requirements.txt

# Запустить сервер разработки
uvicorn main:app --reload --port 3001
```
API будет доступен по адресу `http://localhost:3001/api/...`.

### Фронтенд
```bash
cd front
npm install 
npm start
```
Приложение работает на `http://localhost:3000` и будет отправлять API-запросы на бэкенд.

### Одновременный запуск / Single-command Start (optional)
В **корневой папке проекта** 
```
Затем выполните:
```bash
npm install
npm install --save-dev concurrently
npm run start
```
This will start both backend (port 3001) and frontend (port 3000) together.

## Регистрация ролей, пользователей и получение JWT

### 1. Создание ролей

Роли должны иметь уникальные имена. Пример создания нескольких ролей:

Unix shell:
```bash
curl -X POST http://localhost:3001/api/roles \
  -H "Content-Type: application/json" \
  -d '{ "name":"admin","description":"Администратор" }'

curl -X POST http://localhost:3001/api/roles \
  -H "Content-Type: application/json" \
  -d '{ "name":"teacher","description":"Преподаватель" }'

curl -X POST http://localhost:3001/api/roles \
  -H "Content-Type: application/json" \
  -d '{ "name":"student","description":"Студент" }'
```

PowerShell:
```powershell
curl.exe -X POST "http://localhost:3001/api/roles" -H "Content-Type: application/json" -d '{ "name":"admin","description":"Администратор" }'

Invoke-RestMethod -Uri "http://localhost:3001/api/roles" -Method POST -ContentType "application/json" -Body (@{ name="admin"; description="Администратор" } | ConvertTo-Json -Compress)

Invoke-RestMethod -Uri "http://localhost:3001/api/roles" -Method POST -ContentType "application/json" -Body (@{ name="teacher"; description="Преподаватель" } | ConvertTo-Json -Compress)

Invoke-RestMethod -Uri "http://localhost:3001/api/roles" -Method POST -ContentType "application/json" -Body (@{ name="student"; description="Студент" } | ConvertTo-Json -Compress)
```

### 2. Создание пользователя

Поля `username` и `email` должны быть уникальными. Если вы попытаетесь создать пользователя с уже занятым `username` или `email`, API вернёт `400 Bad Request` с сообщением:

```json
{ "detail": "Username already exists" }
```
или
```json
{ "detail": "Email already exists" }
```

Unix shell:
```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "username":"admin",
    "email":"admin@example.com",
    "password":"adminpass",
    "full_name":"Администратор сайта",
    "is_active":true,
    "roles":[1]
  }'
```

PowerShell:
```powershell
Invoke-RestMethod -Method POST `
  -Uri http://localhost:3001/api/users `
  -Headers @{ "Content-Type"="application/json" } `
  -Body '{"username":"admin","email":"admin@example.com","password":"adminpass","full_name":"Администратор сайта","is_active":true,"roles":[1]}'
```

### 3. Получение JWT-токена

Unix shell:
```bash
curl -X POST http://localhost:3001/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=adminpass"
```

PowerShell:
```powershell
$resp = Invoke-RestMethod -Method POST `
  -Uri http://localhost:3001/token `
  -Body @{ username="admin"; password="adminpass" } `
  -ContentType "application/x-www-form-urlencoded"
$token = $resp.access_token
Write-Host "JWT:" $token
```

### 3.1. Просмотр JWT-токена в браузере

Чтобы увидеть сохранённый JWT-токен в браузере:
1. Откройте DevTools (F12).
2. Перейдите на вкладку «Application» (или «Storage»).
3. В разделе Local Storage выберите `http://localhost:3000`.
4. Найдите ключ `token` — в его значении хранится ваш JWT в формате `header.payload.signature`.

Дополнительно:
- В консоли DevTools выполните:
  ```js
  localStorage.getItem('token')
  ```
- На вкладке «Network» выберите запрос к API и в секции Headers найдите заголовок `Authorization: Bearer <ваш_JWT>`.

### 4. Вызов защищённых эндпоинтов

Unix shell:
```bash
curl -H "Authorization: Bearer <ваш_токен>" http://localhost:3001/api/roles
curl -H "Authorization: Bearer <ваш_токен>" http://localhost:3001/api/users
```

PowerShell:
```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/roles" -Headers @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:3001/api/users" -Headers @{ Authorization = "Bearer $token" }
```

## Защищённые API-эндпоинты

Ниже перечислены эндпоинты, доступ к которым требует заголовок:

```
Authorization: Bearer <token>
```

- **GET  /api/roles**   — получить список всех ролей
- **POST /api/roles**   — создать новую роль
- **GET  /api/users**   — получить список всех пользователей
- **POST /api/users**   — создать нового пользователя

(Чтобы узнать ID роли для создания пользователя, сначала выполните GET `/api/roles`. )

---

