// src/services/auth.js

import axios from 'axios';
import { api } from './axios';

// register a new user using backend API
export const register = async (name, email, password, role) => {
  // fetch available roles to find the matching role ID
  const { data: roles } = await api.get('/roles');
  const roleObj = roles.find(r => r.name === role);
  if (!roleObj) {
    throw new Error(`Role '${role}' not found`);
  }
  const body = {
    username: email,    // use email as username
    email,
    password,
    full_name: name,
    is_active: true,
    roles: [roleObj.id],
  };
  await api.post('/users', body);
};

// login: authenticate via backend and obtain JWT token
export const login = async (username, password) => {
  // request token
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  const resp = await axios.post('http://localhost:3001/token', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  const { access_token } = resp.data;
  // save token
  localStorage.setItem('token', access_token);

  // fetch user details
  const { data: users } = await api.get('/users');
  const user = users.find(u => u.username === username);
  if (!user) {
    throw new Error('Authenticated user data not found');
  }
  localStorage.setItem('currentUser', JSON.stringify(user));
  return user;
};

// logout: clear stored token and user data
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
};

// get saved JWT token
export const getToken = () => localStorage.getItem('token');

// get stored current user data
export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}; 