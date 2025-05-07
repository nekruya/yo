import React from 'react';
import { useHistory, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchTeachers } from '../services/teachers';
import './Teachers.css';

const Teachers = () => {
  const history = useHistory();
  const { data, isLoading, error } = useQuery({ queryKey: ['teachers'], queryFn: fetchTeachers });

  // обработчик нажатия на кнопку "расписание"
  const handleScheduleClick = () => {
    history.push('/schedule');
  };

  // обработчик нажатия на кнопку "курсы"
  const handleCoursesClick = () => {
    history.push('/teacher-courses');
  };

  if (isLoading) return <div>Loading teachers...</div>;
  if (error) return <div>Error loading teachers: {error.message}</div>;
  
  const teachersList = data?.data || [];

  return (
    <div className="teachers-page">
      <h1>Учителя</h1>
      <ul className="teachers-list">
        {teachersList.map(teacher => (
          <li key={teacher.id}>{teacher.name}</li>
        ))}
      </ul>
      <div className="teacher-buttons">
        <button className="btn btn-primary" onClick={handleScheduleClick}>Расписание</button>
        <Link to="/courses" className="btn btn-secondary">Курсы</Link>
      </div>
    </div>
  );
};

export default Teachers;