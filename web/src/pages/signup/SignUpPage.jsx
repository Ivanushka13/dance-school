import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignUpPage.css';
import { MdError } from 'react-icons/md';

const SignUpPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        middleName: '',
        email: '',
        phone: '',
        description: '',
        level: 'beginner',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const phoneRegex = /^\+?[1-9]\d{10,14}$/;

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Введите имя';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Введите фамилию';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Введите email';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Введите корректный email';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Введите номер телефона';
        } else if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Введите корректный номер телефона';
        }

        if (!formData.password) {
            newErrors.password = 'Введите пароль';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Пароль должен быть не менее 6 символов';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Подтвердите пароль';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form submitted:', formData);
            navigate('/login');
        }
    };

    const handleReset = () => {
        setFormData({
            firstName: '',
            lastName: '',
            middleName: '',
            email: '',
            phone: '',
            description: '',
            level: 'beginner',
            password: '',
            confirmPassword: ''
        });
        setErrors({});
    };

    return (
        <div className="signup-container">
            <div className="signup-form-wrapper">
                <div className="signup-header">
                    <h1 className="signup-title">Регистрация</h1>
                </div>
                
                <form className="signup-form" onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label className="form-label required">Имя</label>
                            <input
                                type="text"
                                name="firstName"
                                className={`form-control ${errors.firstName ? 'error' : ''}`}
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                            {errors.firstName && (
                                <div className="error-text">
                                    <MdError />
                                    <span>{errors.firstName}</span>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label required">Фамилия</label>
                            <input
                                type="text"
                                name="lastName"
                                className={`form-control ${errors.lastName ? 'error' : ''}`}
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                            {errors.lastName && (
                                <div className="error-text">
                                    <MdError />
                                    <span>{errors.lastName}</span>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Отчество</label>
                            <input
                                type="text"
                                name="middleName"
                                className="form-control"
                                value={formData.middleName}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label required">Email</label>
                            <input
                                type="email"
                                name="email"
                                className={`form-control ${errors.email ? 'error' : ''}`}
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && (
                                <div className="error-text">
                                    <MdError />
                                    <span>{errors.email}</span>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label required">Телефон</label>
                            <input
                                type="tel"
                                name="phone"
                                className={`form-control ${errors.phone ? 'error' : ''}`}
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+7XXXXXXXXXX"
                            />
                            {errors.phone && (
                                <div className="error-text">
                                    <MdError />
                                    <span>{errors.phone}</span>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label required">Уровень подготовки</label>
                            <select
                                name="level"
                                className="form-control"
                                value={formData.level}
                                onChange={handleChange}
                            >
                                <option value="beginner">Начинающий</option>
                                <option value="intermediate">Средний</option>
                                <option value="advanced">Продвинутый</option>
                            </select>
                        </div>

                        <div className="form-group full-width">
                            <label className="form-label">Описание профиля</label>
                            <textarea
                                name="description"
                                className="form-control"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Расскажите о себе и своем танцевальном опыте..."
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label required">Пароль</label>
                            <input
                                type="password"
                                name="password"
                                className={`form-control ${errors.password ? 'error' : ''}`}
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {errors.password && (
                                <div className="error-text">
                                    <MdError />
                                    <span>{errors.password}</span>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label required">Подтверждение пароля</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            {errors.confirmPassword && (
                                <div className="error-text">
                                    <MdError />
                                    <span>{errors.confirmPassword}</span>
                                </div>
                            )}
                        </div>

                        <div className="buttons-container">
                            <button type="button" onClick={handleReset} className="btn btn-secondary">
                                Очистить
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Зарегистрироваться
                            </button>
                        </div>
                    </div>

                    <div className="login-link">
                        Уже есть аккаунт? <Link to="/login">Войти</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SignUpPage;