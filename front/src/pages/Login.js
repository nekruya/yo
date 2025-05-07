import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login } from '../services/auth';
import InputField from '../components/common/InputField';
import './Profile.css';

const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Успешный вход');
      history.push('/dashboard');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Вход в систему</h1>
      <form onSubmit={handleSubmit} className="profile-form">
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
        <button type="submit" className="btn btn-primary">Войти</button>
      </form>
      <p className="register-link">
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </p>
    </div>
  );
};

export default Login; 