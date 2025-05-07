import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import InputField from '../components/common/InputField';
import './Profile.css';
import '../styles.css'; 
import cogoToast from 'cogo-toast';
import { login, logout, getCurrentUser } from '../services/auth';

const Profile = () => {
    const history = useHistory();
    const [currentUser, setCurrentUser] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');

    useEffect(() => {
        const u = getCurrentUser();
        if (u) {
            setCurrentUser(u);
            setFullName(u.full_name);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            // login flow
            try {
                const u = await login(email, password);
                setCurrentUser(u);
                setFullName(u.full_name);
                cogoToast.success('Успешный вход');
            } catch (err) {
                const msg = err.response?.data?.detail || err.message;
                cogoToast.error(msg);
            }
        } else {
            // profile update (not implemented) - just notify
            cogoToast.info('Профиль обновлён');
        }
    };

    const handleLogout = () => {
        logout();
        setCurrentUser(null);
        setEmail('');
        setPassword('');
        setFullName('');
        history.push('/');
    };

    return (
        <div className="profile-container">
            <h1 className="profile-title">
                {currentUser ? 'Профиль' : 'Авторизация'}
            </h1>
            <form onSubmit={handleSubmit} className="profile-form">
                {!currentUser && (
                    <> 
                        <InputField
                            label="Email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <InputField
                            label="Пароль"
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </>
                )}
                {currentUser && (
                    <>
                        <InputField
                            label="Имя"
                            name="name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                        <InputField
                            label="Email"
                            name="email"
                            value={currentUser.email}
                            disabled
                        />
                    </>
                )}
                <button type="submit" className="btn btn-primary">
                    {currentUser ? 'Обновить профиль' : 'Войти'}
                </button>
                {currentUser && (
                    <button type="button" className="btn btn-secondary" onClick={handleLogout}>
                        Выйти
                    </button>
                )}
            </form>
            {!currentUser && (
                <p className="register-link">
                    Еще нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
                </p>
            )}
        </div>
    );
};

export default Profile;