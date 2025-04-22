// src/services/auth.js

// Retrieve stored users or initialize empty array
export const getUsers = () => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

// Save users array to localStorage
export const saveUsers = (users) => {
  localStorage.setItem('users', JSON.stringify(users));
};

// Register a new user and store in localStorage
export const register = (name, email, password, role) => {
  const users = getUsers();
  if (users.some(u => u.email === email)) {
    throw new Error('Пользователь с таким email уже существует');
  }
  const newUser = { id: Date.now(), name, email, password, role };
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

// Login: check credentials and issue a simple token
export const login = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    throw new Error('Неверный email или пароль');
  }
  // generate simple token (timestamp-based)
  const token = Date.now().toString();
  localStorage.setItem('token', token);
  localStorage.setItem('currentUser', JSON.stringify(user));
  return user;
};

// Logout: clear token and current user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
};

// Get current stored token
export const getToken = () => {
  return localStorage.getItem('token');
};

// Get current logged in user
export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}; 