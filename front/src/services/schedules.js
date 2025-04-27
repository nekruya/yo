import { api } from './axios';

// fetch all schedules
export const fetchSchedules = () => api.get('/schedules');

// create a new schedule
export const createSchedule = (schedule) => api.post('/schedules', schedule);

// update a schedule
export const updateSchedule = (schedule) => api.put(`/schedules/${schedule.id}`, schedule);

// delete a schedule
export const deleteSchedule = (id) => api.delete(`/schedules/${id}`); 