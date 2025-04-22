import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <Link to="/" className="logo">School's Assistance</Link>
      <nav className="nav">
        <Link to="/dashboard">Панель управления</Link>
        <Link to="/notifications">Уведомления</Link>
        <Link to="/profile">Авторизация</Link>
      </nav>
    </header>
  );
}

export default Header;