import './Login.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ErrorIcon from '@mui/icons-material/Error';
import {login, logout} from '../../util/apiService';
import { apiRequest } from "../../util/apiService";
import {useDispatch} from "react-redux";
import {setSession} from "../../redux/sessionSlice";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const dispatch = useDispatch();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!email || !password) {
            setError('Пожалуйста, заполните все поля');
            setLoading(false);
            return;
        }

        try {
            const loginData = await login ({
                username: email,
                password: password,
                grant_type: null,
                scope: null,
                client_id: null,
                client_secret: null
            });

            const meResponse = await apiRequest({
                method: 'get',
                url: '/auth/me',
            });

            if(meResponse.role === 'admin') {
                dispatch(setSession(meResponse));
                navigate('/home');
            } else {
                setError(`Доступ запрещен`);
                setLoading(false);
            }
        } catch (error) {
            setError(`Ошибка при авторизации: ${error}`)
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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

export default Login;