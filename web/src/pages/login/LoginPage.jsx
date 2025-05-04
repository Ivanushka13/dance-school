import "./LoginPage.css"
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {login} from "../../util/apiService";
import {useDispatch} from 'react-redux';
import {setUser} from '../../redux/slices/userSlice';
import {apiRequest} from "../../util/apiService";
import {setSession} from "../../redux/slices/sessionSlice";
import {setLevel} from "../../redux/slices/levelSlice";
import InformationModal from "../../components/modal/info/InformationModal";
import PageLoader from "../../components/PageLoader/PageLoader";

const LoginPage = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateEmail(email)) {
      setEmailError("Пожалуйста, введите корректный email");
      setLoading(false);
      return;
    }

    try {
      const loginData = await login({
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

      dispatch(setSession(meResponse));
      dispatch(setUser(meResponse.user));

      if (meResponse.role === 'student') {
        dispatch(setLevel(meResponse.level));
      }

      navigate('/profile');

    } catch (error) {
      setModalInfo({
        title: 'Ошибка при авторизации',
        message: error.message || String(error),
      });
      setShowModal(true);
      setLoading(false);
    }
  }

  return (
    <div className="login-page-wrapper">
      <PageLoader loading={loading} text="Авторизация..." minHeight="100vh">
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
                      name="email"
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
                      name="password"
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
      </PageLoader>
      <InformationModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title={modalInfo.title}
        message={modalInfo.message}
      />
    </div>
  )
}

export default LoginPage;