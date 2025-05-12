import { api } from './axios';

// получить всех пользователей
export const fetchUsers = () => api.get('/users');

// получить одного пользователя
export const fetchUser = (id) => api.get(`/users/${id}`);

// создать нового пользователя { username, email, password, full_name, roles: [id,...] }
export const createUser = (user) => api.post('/users', user);

// обновить пользователя { full_name, is_active, roles }
export const updateUser = (id, user) => api.put(`/users/${id}`, user);

// удалить пользователя
export const deleteUser = (id) => api.delete(`/users/${id}`);

// получить активность пользователя
export const fetchUserActivities = (id) => api.get(`/users/${id}/activities`); 