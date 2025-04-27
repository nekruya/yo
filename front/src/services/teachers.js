import { api } from './axios';

// fetch all teachers
export const fetchTeachers = () => api.get('/teachers');

// create a new teacher
export const createTeacher = (teacher) => api.post('/teachers', teacher);

// delete a teacher
export const deleteTeacher = (id) => api.delete(`/teachers/${id}`);

// update a teacher
export const updateTeacher = (teacher) => api.put(`/teachers/${teacher.id}`, teacher); 