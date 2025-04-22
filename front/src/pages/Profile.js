import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import InputField from '../components/common/InputField';
import './Profile.css';
import '../styles.css'; 

const Profile = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        console.log('Profile updated:', userData);
    };

    return (
        <div className="profile-container">
            <h1 className="profile-title">Авторизация</h1>
            <form onSubmit={handleSubmit} className="profile-form">
                <InputField
                    label="Имя"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                />
                <InputField
                    label="Электронная почта"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                />
                <InputField
                    label="Телефон"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                />
                <button type="button" className="btn btn-primary">Войти</button>
            </form>
            <p className="register-link">
                Еще нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
            </p>
        </div>
    );
};

export default Profile;