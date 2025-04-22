// src/services/auth.js

// получить сохраненных пользователей или инициализировать пустой массив
export const getUsers = () => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

// сохранить массив пользователей в localStorage
export const saveUsers = (users) => {
  localStorage.setItem('users', JSON.stringify(users));
};

// зарегистрировать нового пользователя и сохранить в localStorage
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

// войти: проверить учетные данные и выдать простой токен
export const login = (email, password) => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    throw new Error('Неверный email или пароль');
  }
  // сгенерировать простой токен (на основе timestamp)
  const token = Date.now().toString();
  localStorage.setItem('token', token);
  localStorage.setItem('currentUser', JSON.stringify(user));
  return user;
};

// выйти: удалить токен и данные текущего пользователя
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('currentUser');
};

// получить текущий токен из localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// получить залогиненного пользователя из localStorage
export const getCurrentUser = () => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
}; 