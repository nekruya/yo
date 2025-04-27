import { api } from './axios';

// fetch all students
export const fetchStudents = () => api.get('/students');

// create a new student
export const createStudent = (student) => api.post('/students', student);

// delete a student
export const deleteStudent = (id) => api.delete(`/students/${id}`);

// update a student
export const updateStudent = (student) => api.put(`/students/${student.id}`, student); 