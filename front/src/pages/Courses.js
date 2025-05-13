import React from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCourses, deleteCourse, updateCourse, fetchCourseFiles } from '../services/courses';
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

  // redirect to edit page to manage course files and metadata
  const handleEditCourse = (id) => {
    history.push(`/courses/${id}/edit`);
  };

  if (isLoading) return <div>Загрузка курсов...</div>;
  if (error) return <div>Ошибка загрузки курсов: {error.message}</div>;

  const coursesList = data?.data || [];

  // Component to display a single course with its attached files
  const CourseCard = ({ course }) => {
    const { data: filesRes, isLoading: filesLoading, error: filesError } = useQuery({
      queryKey: ['courseFiles', course.id],
      queryFn: () => fetchCourseFiles(course.id),
    });
    const filesList = filesRes?.data || [];
    return (
      <div className="course-card">
        <h2>{course.title}</h2>
        <p>{course.description}</p>
        {filesLoading && <p>Загрузка файлов...</p>}
        {filesError && <p>Ошибка загрузки файлов: {filesError.message}</p>}
        {!filesLoading && !filesError && filesList.length > 0 && (
          <ul>
            {filesList.map(file => (
              <li key={file.id}>
                <a href={file.url} target="_blank" rel="noopener noreferrer">{file.filename}</a>
              </li>
            ))}
          </ul>
        )}
        <div className="course-action-buttons">
          <button className="btn btn-secondary" onClick={() => handleEditCourse(course.id)}>Редактировать</button>
          <button className="btn btn-danger" onClick={() => handleDeleteCourse(course.id)}>Удалить</button>
        </div>
      </div>
    );
  };

  return (
    <div className="courses-page">
      <h1>Курсы</h1>
      <button className="btn btn-primary" onClick={handleAddCourse}>Добавить курс</button>
      <div className="course-list">
        {coursesList.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default Courses;