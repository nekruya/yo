import React, { useState, useRef, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchCourse, fetchCourseFiles, updateCourse, uploadCourseFile, deleteCourseFile } from '../services/courses';
import './AddCourse.css';

const EditCourse = () => {
  const { courseId } = useParams();
  const history = useHistory();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [newFiles, setNewFiles] = useState([]);
  const fileInputRef = useRef(null);

  const { data: courseRes, isLoading: courseLoading, error: courseError } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourse(courseId),
  });

  const {
    data: filesRes,
    isLoading: filesLoading,
    error: filesError,
    refetch: refetchFiles,
  } = useQuery({
    queryKey: ['courseFiles', courseId],
    queryFn: () => fetchCourseFiles(courseId),
  });

  useEffect(() => {
    if (courseRes) {
      setTitle(courseRes.data.title);
      setDescription(courseRes.data.description || '');
    }
  }, [courseRes]);

  const handleFilesChange = (e) => {
    const selected = Array.from(e.target.files);
    setNewFiles(prev => [...prev, ...selected]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    setNewFiles(prev => [...prev, ...dropped]);
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await deleteCourseFile(courseId, fileId);
      refetchFiles();
    } catch (err) {
      console.error('Ошибка удаления файла', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCourse({ id: parseInt(courseId), title, description });
      for (let f of newFiles) {
        await uploadCourseFile(courseId, f);
      }
      history.push('/courses');
    } catch (err) {
      console.error('Ошибка обновления курса', err);
    }
  };

  if (courseLoading || filesLoading) return <div>Загрузка...</div>;
  if (courseError) return <div>Ошибка загрузки курса: {courseError.message}</div>;
  if (filesError) return <div>Ошибка загрузки файлов: {filesError.message}</div>;

  const existingFiles = filesRes?.data || [];

  return (
    <div className="add-course-page">
      <h1>Редактировать курс</h1>
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
          <label>Существующие файлы</label>
          <ul>
            {existingFiles.map(f => (
              <li key={f.id}>
                <a href={f.url} target="_blank" rel="noopener noreferrer">{f.filename}</a>
                <button type="button" className="btn btn-sm btn-danger ml-2" onClick={() => handleDeleteFile(f.id)}>Удалить</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="form-group">
          <label>Добавить новые файлы</label>
          <div
            className="file-dropzone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
          >
            {newFiles.length > 0 ? (
              newFiles.map((f, idx) => <p key={idx}>{f.name}</p>)
            ) : (
              <p>Перетащите файлы или нажмите для выбора</p>
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
        <button type="submit" className="btn btn-primary">Сохранить изменения</button>
      </form>
    </div>
  );
};

export default EditCourse; 