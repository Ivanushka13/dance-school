import React, { useState } from 'react';
import './Profile.css';


import SideBar from '../../Components/SideBar/SideBar';
import NavBar from '../../Components/NavBar/NavBar';


import EditRoundedIcon from '@mui/icons-material/EditRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';

const Profile = () => {
    const [userData, setUserData] = useState({
        fullName: 'Иван Иванов',
        email: 'ivan.ivanov@elcentro.com',
        phone: '+7 (999) 123-45-67'
    });

    const [isEditing, setIsEditing] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const handleSaveProfile = () => {
        // Здесь будет логика сохранения данных профиля
        setIsEditing(false);
    };


    const handleSavePassword = () => {
        // Здесь будет логика сохранения нового пароля
        setPasswords({ newPassword: '', confirmPassword: '' });
    };


    const isPasswordsMatch = passwords.newPassword && passwords.confirmPassword && 
                           passwords.newPassword === passwords.confirmPassword;

    return (
        <div className="list">
            <SideBar />
            <div className="list-container">
                <NavBar />
                <div className="profile-page">
                    <div className="profile-header">
                        <div className="header-content">
                            <div className="header-icon">
                                <PersonRoundedIcon />
                            </div>
                            <div className="header-text">
                                <h1>Профиль</h1>
                            </div>
                        </div>
                    </div>

                    <div className="profile-content">
                        <div className="profile-section">
                            <h2>Личные данные</h2>
                            <div className="form-group">
                                <label>ФИО</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={userData.fullName}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="Введите ФИО"
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={userData.email}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="Введите email"
                                />
                            </div>

                            <div className="form-group">
                                <label>Телефон</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={userData.phone}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    placeholder="Введите номер телефона"
                                />
                            </div>

                            {!isEditing ? (
                                <button className="edit-button" onClick={() => setIsEditing(true)}>
                                    <EditRoundedIcon />
                                    <span>Редактировать</span>
                                </button>
                            ) : (
                                <button className="save-button" onClick={handleSaveProfile}>
                                    <SaveRoundedIcon />
                                    <span>Сохранить изменения</span>
                                </button>
                            )}
                        </div>

                        {isEditing && (
                            <div className="profile-section">
                                <h2>Изменение пароля</h2>
                                <div className="form-group">
                                    <label>Новый пароль</label>
                                    <div className="password-input">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="newPassword"
                                            value={passwords.newPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Введите новый пароль"
                                        />
                                        <button
                                            type="button"
                                            className="visibility-toggle"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                                        </button>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Подтверждение пароля</label>
                                    <div className="password-input">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={passwords.confirmPassword}
                                            onChange={handlePasswordChange}
                                            placeholder="Подтвердите новый пароль"
                                        />
                                        <button
                                            type="button"
                                            className="visibility-toggle"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <VisibilityOffRoundedIcon /> : <VisibilityRoundedIcon />}
                                        </button>
                                    </div>
                                </div>

                                <button 
                                    className="save-password-button"
                                    onClick={handleSavePassword}
                                    disabled={!isPasswordsMatch}
                                >
                                    <SaveRoundedIcon />
                                    <span>Сохранить пароль</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile; 