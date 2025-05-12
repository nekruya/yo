import { api } from './axios';

// получить все роли
export const fetchRoles = () => api.get('/roles');

// создать новую роль
export const createRole = (role) => api.post('/roles', role);

// (доп.) удалить роль
export const deleteRole = (id) => api.delete(`/roles/${id}`);

// (доп.) обновить роль
export const updateRole = (role) => api.put(`/roles/${role.id}`, role); 