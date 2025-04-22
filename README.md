# Student’s Assistant

## обзор
«Помощник учащегося» — это веб‑приложение на React с управлением учебным процессом и разделением прав по ролям:
- регистрация и вход (хранение JWT‑токена в localStorage);
- администратор: управление пользователями (создание, редактирование, удаление), настройка ролей и отчёты;
- преподаватель: создание и редактирование курсов, планирование расписания, загрузка материалов, общение со студентами;
- студент: просмотр курсов и расписания, доступ к материалам, участие в обсуждениях, получение уведомлений;
- расписание: навигация по дням недели, интерактивные карточки занятий, модальные формы добавления/редактирования;
- календарь: drag-and-drop событий, модальные формы добавления/редактирования/удаления, поддержка повторов;
- уведомления: cogo-toast для информирования пользователя;
- единый бело‑зеленый фирменный стиль и адаптивный дизайн.

## структура проекта
```
front/
├── public/                 # статические файлы (index.html, favicon и др.)
├── src/                    # исходный код React
│   ├── components/         # общие компоненты (Header, Sidebar, ProtectedRoute и др.)
│   ├── pages/              # страницы (Dashboard, Calendar, Schedule, Login, Register и др.)
│   ├── services/           # работа с localStorage (auth, schedule)
│   ├── styles/             # глобальные стили и css-переменные
│   ├── App.js              # главный компонент
│   └── index.js            # входная точка
├── package.json            # зависимости и скрипты
└── .gitignore              # исключения Git
``` 

## установка и запуск
```bash
cd front
npm install
npm start
```
приложение будет доступно по адресу http://localhost:3000

---

# Student’s Assistant

## overview
Student’s Assistant is a React web application with role-based access control and features for managing the educational workflow:
- registration and login (JWT token in localStorage);
- admin: user management (create, update, delete), roles and reporting;
- teacher: course creation/editing, schedule planning, content uploads, student interaction;
- student: course and schedule viewing, access to materials, discussions, notifications;
- schedule: day‑by‑day navigation, interactive class cards, add/edit via modals;
- calendar: drag‑and‑drop events, add/edit/delete modals, recurring events support;
- notifications using cogo‑toast;
- consistent white‑and‑green branding and responsive layout.

## project structure
```
front/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   ├── App.js
│   └── index.js
├── package.json
└── .gitignore
```

## installation & usage
```bash
cd front
npm install
npm start
```
app will run at http://localhost:3000