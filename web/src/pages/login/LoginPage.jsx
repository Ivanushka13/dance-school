import "./LoginPage.css"
import {useState} from "react";
import {useAuth, MOCK_USERS} from "../../context/AuthContext";
import {useNavigate} from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if(!validateEmail(email)) {
            setEmailError("Пожалуйста, введите корректный email");
            return;
        }


        const user = MOCK_USERS.find(
            user => user.email === email && user.password === password && (user.role === 'teacher' || user.role === 'student')
        );

        if (user) {
            const { password, ...userWithoutPassword } = user;
            login(userWithoutPassword);
            

            if (user.role === 'teacher') {
                navigate('/events');
            } else {
                navigate('/events');
            }
        } else {
            setError('Неверный email или пароль');
        }
    }

    return (
        <div className="login-container">
            <div className="login-overlay">
                <div className="login-form-container">
                    <div className="login-form">
                        <h2 className="login-title">Вход в систему</h2>
                        {error && (
                            <div className="error-text">{error}</div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={emailError ? 'error' : ''}
                                />
                                {emailError && <p className="error-text">{emailError}</p>}
                            </div>
                            <div className="input-group">
                                <input
                                    type="password"
                                    placeholder="Пароль"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="sign-in-button">
                                Войти
                            </button>
                        </form>
                        <div className="links">
                            <a href="/signup" className="sign-up-link">Зарегистрироваться</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage;