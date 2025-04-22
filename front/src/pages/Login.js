import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom';
import cogoToast from 'cogo-toast';
import { login } from '../services/auth';
import './Welcome.css';

const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      cogoToast.success('Успешный вход');
      history.push('/dashboard');
    } catch (error) {
      cogoToast.error(error.message);
    }
  };

  return (
    <div className="welcome-container">
      <h1>Вход в систему</h1>
      <form onSubmit={handleSubmit} className="welcome-form">
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
        <button type="submit">Войти</button>
      </form>
      <p>
        Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
      </p>
    </div>
  );
};

export default Login; 