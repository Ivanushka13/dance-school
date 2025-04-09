import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NavBar from '../../components/navbar/NavBar';
import './EditProfile.css';

const EditProfile = () => {
    const { user, updateProfile, updatePassword } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        middleName: user?.middleName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        description: user?.description || '',
        level: user?.level || 'Начинающий',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [mainInfoError, setMainInfoError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleMainInfoSubmit = async (e) => {
        e.preventDefault();
        try {
            const mainInfo = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                middleName: formData.middleName,
                email: formData.email,
                phone: formData.phone,
                description: formData.description,
                level: formData.level,
            };
            await updateProfile(mainInfo);
            setMainInfoError('');
            navigate('/profile');
        } catch (err) {
            setMainInfoError('Ошибка при обновлении основной информации');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!formData.newPassword || !formData.confirmPassword) {
            setError('Пожалуйста, заполните оба поля пароля');
            return;
        }
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }
        try {
            await updatePassword(formData.newPassword);
            setFormData(prev => ({
                ...prev,
                newPassword: '',
                confirmPassword: ''
            }));
            setError('');
        } catch (err) {
            setError('Ошибка при обновлении пароля');
        }
    };

    const handleCancel = () => {
        navigate('/profile');
    };

    return (
        <div className="page-wrapper">
            <NavBar />
            <div className="edit-profile-container">
                <form className="edit-profile-form">
                    <div className="form-header">
                        <h2>Редактирование профиля</h2>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Личные данные</h3>
                        <div className="form-group">
                            <label htmlFor="lastName">Фамилия</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="firstName">Имя</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="middleName">Отчество</label>
                            <input
                                type="text"
                                id="middleName"
                                name="middleName"
                                value={formData.middleName}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Контактная информация</h3>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Телефон</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="form-section-title">Дополнительная информация</h3>
                        {user?.role === 'student' && (
                            <div className="form-group">
                                <label htmlFor="level">Уровень подготовки</label>
                                <select
                                    id="level"
                                    name="level"
                                    value={formData.level}
                                    onChange={handleChange}
                                    className="select-input"
                                >
                                    <option value="Начинающий">Начинающий</option>
                                    <option value="Средний">Средний</option>
                                    <option value="Продвинутый">Продвинутый</option>
                                </select>
                            </div>
                        )}
                        <div className="form-group">
                            <label htmlFor="description">О себе</label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Расскажите о своем опыте, интересах и целях"
                            />
                        </div>
                    </div>

                    {mainInfoError && <div className="error-message">{mainInfoError}</div>}
                    <div className="buttons-container main-info-buttons">
                        <button type="button" className="cancel-button" onClick={handleCancel}>
                            Отмена
                        </button>
                        <button type="button" className="save-button" onClick={handleMainInfoSubmit}>
                            Сохранить основную информацию
                        </button>
                    </div>

                    <div className="password-section">
                        <h3 className="password-section-title">Изменение пароля</h3>
                        <div className="form-section">
                            <div className="form-group">
                                <label htmlFor="newPassword">Новый пароль</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Подтверждение пароля</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="buttons-container">
                        <button type="button" className="save-button" onClick={handlePasswordSubmit}>
                            Изменить пароль
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile; 