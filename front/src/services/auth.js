// служба аутентификации

import axios from 'axios';
import { api } from './axios';

// зарегистрировать нового пользователя через api бэкенда
export const register = async (name, email, password, role) => {
  // получить доступные роли для определения идентификатора роли
  const { data: roles } = await api.get('/roles');
  const roleObj = roles.find(r => r.name === role);
  if (!roleObj) {
    throw new Error(`Role '${role}' not found`);
  }
  const body = {
    username: email,    // использовать email в качестве имени пользователя
    email,
    password,
    full_name: name,
    is_active: true,
    roles: [roleObj.id],
  };
  await api.post('/users', body);
};

// вход: аутентификация через бэкенд и получение jwt-токена
export const login = async (username, password) => {
  // запрос токена
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  const resp = await axios.post('http://localhost:3001/token', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  const { access_token } = resp.data;
  // сохранить токен
  localStorage.setItem('token', access_token);

  // получить данные пользователя
  const { data: users } = await api.get('/users');
  const user = users.find(u => u.username === username);
  if (!user) {
    throw new Error('Authenticated user data not found');
  }
  localStorage.setItem('currentUser', JSON.stringify(user));
  return user;
};

// выход: очистить сохраненный токен и данные пользователя
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
};

// получить сохраненный jwt-токен
export const getToken = () => localStorage.getItem('token');

// получить сохраненные данные текущего пользователя
export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}; 