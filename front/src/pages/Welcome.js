import React from 'react';
import './Welcome.css';

const Welcome = () => {
  return (
    <div className="welcome-container">
      <h1>Добро пожаловать в School's Assistance</h1>
      <p>Ваш универсальный помощник для эффективного управления школьными мероприятиями.</p>
      <ul className="welcome-features">
        <li>Регистрация и вход в систему.</li>
        <li>Просмотр расписания и календаря.</li>
        <li>Управление курсами и загрузка материалов (для преподавателей).</li>
        <li>Просмотр курсов и материалов (для студентов).</li>
        <li>Администрирование пользователей, ролей и активности (для администраторов).</li>
      </ul>
    </div>
  );
};

export default Welcome;