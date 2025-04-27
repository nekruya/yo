import { api } from './axios';

// fetch all courses
export const fetchCourses = () => api.get('/courses');

// create a new course
export const createCourse = (course) => api.post('/courses', course);

// delete a course
export const deleteCourse = (id) => api.delete(`/courses/${id}`);

// update a course (optional, if backend supports it)
export const updateCourse = (course) => api.put(`/courses/${course.id}`, course); 