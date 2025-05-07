import { api } from './axios';

// получить все расписания
export const fetchSchedules = () => api.get('/schedules');

// создать новое расписание
export const createSchedule = (schedule) => api.post('/schedules', schedule);

// обновить расписание
export const updateSchedule = (schedule) => api.put(`/schedules/${schedule.id}`, schedule);

// удалить расписание
export const deleteSchedule = (id) => api.delete(`/schedules/${id}`); 