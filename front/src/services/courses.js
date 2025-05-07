import { api } from './axios';

// получить все курсы
export const fetchCourses = () => api.get('/courses');

// создать новый курс
export const createCourse = (course) => api.post('/courses', course);

// удалить курс
export const deleteCourse = (id) => api.delete(`/courses/${id}`);

// обновить курс (опционально, если поддерживает бэкенд)
export const updateCourse = (course) => api.put(`/courses/${course.id}`, course); 