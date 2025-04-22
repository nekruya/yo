import React from 'react';
import { useHistory } from 'react-router-dom';
import './Students.css';

const Students = () => {
  const history = useHistory();

  // Обработчик нажатия на кнопку "Расписание"
  const handleScheduleClick = () => {
    history.push('/schedule');
  };

  // Обработчик нажатия на кнопку "Курсы"
  const handleCoursesClick = () => {
    history.push('/student-courses');
  };

  return (
    <div className="students-page">
      <h1>Студенты</h1>
      <p>Добро пожаловать в портал студентов. Здесь вы можете просматривать свои курсы, задания и многое другое.</p>
      <div className="student-buttons">
        <button className="btn btn-primary" onClick={handleScheduleClick}>Расписание</button>
        <button className="btn btn-secondary" onClick={handleCoursesClick}>Курсы</button>
      </div>
    </div>
  );
};

export default Students;