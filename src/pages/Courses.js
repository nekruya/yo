import React from 'react';
import { useHistory } from 'react-router-dom';
import './Courses.css';
import '../styles.css'; 

const Courses = () => {
  const history = useHistory();

  const handleAddCourse = () => {
    
    history.push('/add-course');
  };

  const handleEditCourse = () => {
    
    console.log('Edit Course');
  };

  const handleDeleteCourse = () => {
    
    console.log('Delete Course');
  };

  return (
    <div className="courses-page">
      <h1>Courses</h1>
      <div className="course-controls">
        <button className="btn btn-primary" onClick={handleAddCourse}>Add Course</button>
        <button className="btn btn-secondary" onClick={handleEditCourse}>Edit Course</button>
        <button className="btn btn-danger" onClick={handleDeleteCourse}>Delete Course</button>
      </div>
      {/* */}
    </div>
  );
};

export default Courses;