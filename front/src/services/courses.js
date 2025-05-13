import { api } from './axios';

// получить все курсы
export const fetchCourses = () => api.get('/courses');

// создать новый курс
export const createCourse = (course) => api.post('/courses', course);

// удалить курс
export const deleteCourse = (id) => api.delete(`/courses/${id}`);

// обновить курс (опционально, если поддерживает бэкенд)
export const updateCourse = (course) => api.put(`/courses/${course.id}`, course);

// загрузить файл в курс
export const uploadCourseFile = (courseId, file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post(`/courses/${courseId}/files`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// получить файлы курса
export const fetchCourseFiles = (courseId) => api.get(`/courses/${courseId}/files`);

// fetch a single course by id
export const fetchCourse = (courseId) => api.get(`/courses/${courseId}`);

// delete a file attached to a course
export const deleteCourseFile = (courseId, fileId) => api.delete(`/courses/${courseId}/files/${fileId}`); 