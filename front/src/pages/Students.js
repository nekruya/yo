import React from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchStudents } from '../services/students';
import './Students.css';

const Students = () => {
  const history = useHistory();
  const { data, isLoading, error } = useQuery({ queryKey: ['students'], queryFn: fetchStudents });

  // обработчик нажатия на кнопку "расписание"
  const handleScheduleClick = () => {
    history.push('/schedule');
  };

  // обработчик нажатия на кнопку "курсы"
  const handleCoursesClick = () => {
    history.push('/student-courses');
  };

  if (isLoading) return <div>Loading students...</div>;
  if (error) return <div>Error loading students: {error.message}</div>;

  const studentsList = data?.data || [];

  return (
    <div className="students-page">
      <h1>Студенты</h1>
      <ul className="students-list">
        {studentsList.map(student => (
          <li key={student.id}>{student.name}</li>
        ))}
      </ul>
      <div className="student-buttons">
        <button className="btn btn-primary" onClick={handleScheduleClick}>Расписание</button>
        <button className="btn btn-secondary" onClick={handleCoursesClick}>Курсы</button>
      </div>
    </div>
  );
};

export default Students;