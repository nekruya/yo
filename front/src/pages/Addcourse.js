import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { createCourse, uploadCourseFile } from '../services/courses';
import './AddCourse.css';

const AddCourse = () => {
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createCourse({ title, description });
      const courseId = res.data.id;
      for (let file of files) {
        await uploadCourseFile(courseId, file);
      }
      history.push('/courses');
    } catch (error) {
      console.error('Error creating course', error);
    }
  };

  return (
    <div className="add-course-page">
      <h1>Добавить курс</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Название</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Описание</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Файлы</label>
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files))}
          />
        </div>
        <button type="submit" className="btn btn-primary">Создать курс</button>
      </form>
    </div>
  );
};

export default AddCourse;