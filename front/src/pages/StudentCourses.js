import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCourses, fetchCourseFiles } from '../services/courses';
import './StudentCourses.css';

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
      {filesLoading && <p>Loading files...</p>}
      {filesError && <p>Error loading files: {filesError.message}</p>}
      {!filesLoading && !filesError && filesList.length > 0 && (
        <ul>
          {filesList.map(file => (
            <li key={file.id}>
              <a href={file.url} target="_blank" rel="noopener noreferrer">{file.filename}</a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const StudentCourses = () => {
  const { data: coursesRes, isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });
  const coursesList = coursesRes?.data || [];
  if (isLoading) return <div>Loading courses...</div>;
  if (error) return <div>Error loading courses: {error.message}</div>;
  return (
    <div className="student-courses-page">
      <h1>Курсы</h1>
      <div className="courses-grid">
        {coursesList.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
};

export default StudentCourses;