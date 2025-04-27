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
python -m venv venv
venv\Scripts\activate
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

### Одновременный запуск (опционально)
Вы можете установить `concurrently` и добавить в корневой `package.json`:
```json
"scripts": {
  "start:back": "cd backend && uvicorn main:app --reload --port 3001",
  "start:front": "cd front && npm start",
  "start": "concurrently \"npm run start:back\" \"npm run start:front\""
}
```
Запустите:
```bash
npm install --save-dev concurrently
npm run start
```
Это одновременно запустит бэкенд и фронтенд.

---

# Student’s Assistant

## Overview
A full-stack web application for managing educational resources and activities with role-based access:
- **Admin**: user management (create, update, delete), roles, reporting
- **Teacher**: create/edit courses, schedule planning, content uploads, student interaction
- **Student**: view courses & schedule, access materials, participate in discussions, receive notifications
- **Schedule**: day-by-day navigation, interactive class cards, add/edit via modals
- **Calendar**: drag-and-drop events, add/edit/delete modals, recurring events support
- **Notifications**: using cogo-toast for user feedback

## Project Structure
```
course/ (project root)
├── backend/                # Python FastAPI backend
│   ├── main.py             # application entrypoint
│   └── requirements.txt    # Python dependencies
├── front/                  # React frontend (Create React App)
│   ├── public/             # static files
│   ├── src/                # source code (components, pages, services, styles)
│   ├── package.json        # npm scripts & dependencies
│   └── .gitignore
├── README.md               # this file
└── .gitignore              # root gitignore
```

## Installation & Usage

### Backend
```bash
cd backend
# Create & activate virtual environment (Windows)
python -m venv venv
venv\Scripts\activate
# or (Mac/Linux)
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn main:app --reload --port 3001
```
The API will be available at `http://localhost:3001/api/...`.

### Frontend
```bash
cd front
npm install
npm start
```
The React app runs at `http://localhost:3000` and proxies API calls to the backend.

### Single-command Start (optional)
```json
"scripts": {
  "start:back": "cd backend && uvicorn main:app --reload --port 3001",
  "start:front": "cd front && npm start",
  "start": "concurrently \"npm run start:back\" \"npm run start:front\""
}
```
Then:
```bash
npm install --save-dev concurrently
npm run start
```