import { api } from './axios';

// получить всех студентов
export const fetchStudents = () => api.get('/students');

// создать нового студента
export const createStudent = (student) => api.post('/students', student);

// удалить студента
export const deleteStudent = (id) => api.delete(`/students/${id}`);

// обновить студента
export const updateStudent = (student) => api.put(`/students/${student.id}`, student); 