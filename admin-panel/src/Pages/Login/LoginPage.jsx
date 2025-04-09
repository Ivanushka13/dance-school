import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ErrorIcon from '@mui/icons-material/Error';
import './LoginPage.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Валидация полей
        if (!formData.username || !formData.password) {
            setError('Пожалуйста, заполните все поля');
            setLoading(false);
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Временная проверка для демонстрации
            if (formData.username === 'admin' && formData.password === 'admin') {
                // Здесь будет реальная авторизация
                navigate('/home');
            } else {
                setError('Неверное имя пользователя или пароль');
            }
        } catch (err) {
            setError('Произошла ошибка при входе в систему');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-content">
                <div className="login-header">
                    <h1>Elcentro</h1>
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="input-label">Имя пользователя</label>
                        <div className="input-container">
                            <div className="input-icon-wrapper">
                                <PersonIcon className="input-icon" />
                            </div>
                            <input
                                type="text"
                                name="username"
                                className="input-field"
                                placeholder="Введите имя пользователя"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="input-label">Пароль</label>
                        <div className="input-container">
                            <div className="input-icon-wrapper">
                                <LockIcon className="input-icon" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                className="input-field"
                                placeholder="Введите пароль"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <VisibilityOffIcon className="password-icon" />
                                ) : (
                                    <VisibilityIcon className="password-icon" />
                                )}
                            </button>
                        </div>
                    </div>
                    {error && (
                        <div className="error-message">
                            <ErrorIcon style={{ fontSize: 16 }} />
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage; 