import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import cogoToast from 'cogo-toast';
import { register } from '../services/auth';
import './Welcome.css';

const Register = () => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password, role);
      cogoToast.success('Регистрация успешна');
      history.push('/login');
    } catch (error) {
      cogoToast.error(error.message);
    }
  };

  return (
    <div className="welcome-container">
      <h1>Регистрация</h1>
      <form onSubmit={handleSubmit} className="welcome-form">
        <div className="form-group">
          <label>Имя:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Роль:</label>
          <select value={role} onChange={e => setRole(e.target.value)}>
            <option value="student">Студент</option>
            <option value="teacher">Преподаватель</option>
            <option value="admin">Администратор</option>
          </select>
        </div>
        <button type="submit">Зарегистрироваться</button>
      </form>
      <p>
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
};

export default Register; 