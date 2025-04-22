import React from 'react';
import { useHistory } from 'react-router-dom';
import './Administration.css';

const Administration = () => {
  const history = useHistory();

 
  const handleScheduleClick = () => {
    history.push('/schedule');
  };

  
  const handleCoursesClick = () => {
    history.push('/admin-courses');
  };

  return (
    <div className="administration-page">
      <h1>Администрация</h1>
      <p>Добро пожаловать в портал администрации. Здесь вы можете управлять школьными операциями, персоналом и многим другим.</p>
    </div>
  );
};

export default Administration;