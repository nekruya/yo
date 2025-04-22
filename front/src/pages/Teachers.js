import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import './Teachers.css';

const Teachers = () => {
  const history = useHistory();

  // Обработчик нажатия на кнопку "Расписание"
  const handleScheduleClick = () => {
    history.push('/schedule');
  };

  // Обработчик нажатия на кнопку "Курсы"
  const handleCoursesClick = () => {
    history.push('/teacher-courses');
  };

  return (
    <div className="teachers-page">
      <h1>Учителя</h1>
      <p>Добро пожаловать в портал учителей. Здесь вы можете управлять своими классами, заданиями и многим другим.</p>
      <div className="teacher-buttons">
        <button className="btn btn-primary" onClick={handleScheduleClick}>Расписание</button>
        <Link to="/courses" className="btn btn-secondary">Курсы</Link>
      </div>
    </div>
  );
};

export default Teachers;