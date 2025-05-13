import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { createCourse, uploadCourseFile } from '../services/courses';
import './AddCourse.css';

const AddCourse = () => {
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);

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

  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
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
          <div
            className="file-dropzone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            {files.length > 0 ? (
              files.map((file, idx) => <p key={idx}>{file.name}</p>)
            ) : (
              <p>Перетащите файлы сюда или нажмите для выбора</p>
            )}
          </div>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFilesChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">Создать курс</button>
      </form>
    </div>
  );
};

export default AddCourse;