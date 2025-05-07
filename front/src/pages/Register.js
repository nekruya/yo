import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import cogoToast from 'cogo-toast';
import { register, login } from '../services/auth';
import InputField from '../components/common/InputField';
import './Profile.css';
import '../styles.css';

const Register = () => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Register the user
      await register(name, email, password, role);
      // Automatically log in to retrieve JWT
      await login(email, password);
      cogoToast.success('Регистрация и вход выполнены успешно');
      history.push('/dashboard');
    } catch (error) {
      // Display server-provided detail or generic error
      const serverMessage = error.response?.data?.detail || JSON.stringify(error.response?.data) || error.message;
      console.error('Registration error:', error.response?.data || error);
      cogoToast.error(serverMessage);
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Регистрация</h1>
      <form onSubmit={handleSubmit} className="profile-form">
        <InputField
          label="Имя"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          label="Пароль"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="input-field">
          <label htmlFor="role">Роль</label>
          <select
            id="role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Студент</option>
            <option value="teacher">Преподаватель</option>
            <option value="admin">Администратор</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Зарегистрироваться</button>
      </form>
      <p className="register-link">
        Уже есть аккаунт? <Link to="/login">Войти</Link>
      </p>
    </div>
  );
};

export default Register; 