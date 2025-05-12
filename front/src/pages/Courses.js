import React from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCourses, deleteCourse, updateCourse } from '../services/courses';
import './Courses.css';
import '../styles.css'; 

const Courses = () => {
  const history = useHistory();
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ['courses'], queryFn: fetchCourses });

  const handleAddCourse = () => history.push('/add-course');

  const handleDeleteCourse = async (id) => {
    try {
      await deleteCourse(id);
      refetch();
    } catch (err) {
      console.error('Ошибка удаления курса', err);
    }
  };

  const handleEditCourse = async (id, currentTitle, currentDescription) => {
    const newTitle = window.prompt('Введите новое название курса', currentTitle);
    if (newTitle === null) return;
    const newDescription = window.prompt('Введите новое описание курса', currentDescription || '');
    if (newDescription === null) return;
    try {
      await updateCourse({ id, title: newTitle, description: newDescription });
      refetch();
    } catch (err) {
      console.error('Ошибка обновления курса', err);
    }
  };

  if (isLoading) return <div>Загрузка курсов...</div>;
  if (error) return <div>Ошибка загрузки курсов: {error.message}</div>;

  const coursesList = data?.data || [];

  return (
    <div className="courses-page">
      <h1>Курсы</h1>
      <button className="btn btn-primary" onClick={handleAddCourse}>Добавить курс</button>
      <div className="course-list">
        {coursesList.map(course => (
          <div key={course.id} className="course-card">
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <div className="course-action-buttons">
              <button className="btn btn-secondary" onClick={() => handleEditCourse(course.id, course.title, course.description)}>Редактировать</button>
              <button className="btn btn-danger" onClick={() => handleDeleteCourse(course.id)}>Удалить</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;