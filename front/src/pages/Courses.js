import React from 'react';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCourses } from '../services/courses';
import './Courses.css';
import '../styles.css'; 

const Courses = () => {
  const history = useHistory();
  const { data, isLoading, error } = useQuery({ queryKey: ['courses'], queryFn: fetchCourses });

  const handleAddCourse = () => {
    history.push('/add-course');
  };

  const handleEditCourse = () => {
    console.log('Edit Course');
  };

  const handleDeleteCourse = () => {
    console.log('Delete Course');
  };

  if (isLoading) return <div>Loading courses...</div>;
  if (error) return <div>Error loading courses: {error.message}</div>;

  const coursesList = data?.data || [];

  return (
    <div className="courses-page">
      <h1>Courses</h1>
      <div className="course-controls">
        <button className="btn btn-primary" onClick={handleAddCourse}>Add Course</button>
        <button className="btn btn-secondary" onClick={handleEditCourse}>Edit Course</button>
        <button className="btn btn-danger" onClick={handleDeleteCourse}>Delete Course</button>
      </div>
      <ul className="course-list">
        {coursesList.map(course => (
          <li key={course.id}>{course.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Courses;