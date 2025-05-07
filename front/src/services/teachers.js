import { api } from './axios';

// получить всех преподавателей
export const fetchTeachers = () => api.get('/teachers');

// создать нового преподавателя
export const createTeacher = (teacher) => api.post('/teachers', teacher);

// удалить преподавателя
export const deleteTeacher = (id) => api.delete(`/teachers/${id}`);

// обновить преподавателя
export const updateTeacher = (teacher) => api.put(`/teachers/${teacher.id}`, teacher); 