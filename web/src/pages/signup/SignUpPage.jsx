import React, {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import './SignUpPage.css';
import {MdError} from 'react-icons/md';
import {apiRequest} from '../../util/apiService';
import PageLoader from "../../components/PageLoader/PageLoader";

const SignUpPage = () => {

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phone: '',
    description: '',
    level: '',
    password: '',
    confirmPassword: ''
  });


  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await apiRequest({
          method: 'GET',
          url: '/levels',
          requiresAuth: false
        });

        setLevels(response);

        setUserData(prev => ({
          ...prev,
          level: response[0]?.id || ''
        }));

        setLoading(false);

      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }

    fetchLevels();
  }, []);


  const handleChange = (e) => {
    const {name, value} = e.target;
    setUserData(prev => ({
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

    if (!userData.firstName.trim()) {
      newErrors.firstName = 'Введите имя';
    }

    if (!userData.lastName.trim()) {
      newErrors.lastName = 'Введите фамилию';
    }

    if (!userData.email.trim()) {
      newErrors.email = 'Введите email';
    } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (!userData.phone.trim()) {
      newErrors.phone = 'Введите номер телефона';
    } else if (!phoneRegex.test(userData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Введите корректный номер телефона';
    }

    if (!userData.password) {
      newErrors.password = 'Введите пароль';
    } else if (userData.password.length < 6) {
      newErrors.password = 'Пароль должен быть не менее 6 символов';
    }

    if (!userData.confirmPassword) {
      newErrors.confirmPassword = 'Подтвердите пароль';
    } else if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (validateForm()) {

      const data = {
        first_name: userData.firstName,
        last_name: userData.lastName,
        middle_name: userData.middleName,
        email: userData.email,
        phone_number: userData.phone,
        description: userData.description,
        level_id: userData.level,
        password: userData.password,
      }

      try {
        const response = await apiRequest({
          method: 'post',
          url: '/auth/register',
          data: data,
          requiresAuth: false
        });

        setLoading(false);
        navigate('/login');

      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    }

    setLoading(false);
  };

  const handleReset = () => {
    setUserData({
      firstName: '',
      lastName: '',
      middleName: '',
      email: '',
      phone: '',
      level: userData.level,
      description: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
  };

  return (
    <div className="signup-container">
      <PageLoader loading={loading} text="Загрузка...">
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
                  value={userData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && (
                  <div className="error-text">
                    <MdError/>
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
                  value={userData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && (
                  <div className="error-text">
                    <MdError/>
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
                  value={userData.middleName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label required">Email</label>
                <input
                  type="email"
                  name="email"
                  className={`form-control ${errors.email ? 'error' : ''}`}
                  value={userData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <div className="error-text">
                    <MdError/>
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
                  value={userData.phone}
                  onChange={handleChange}
                  placeholder="+7XXXXXXXXXX"
                />
                {errors.phone && (
                  <div className="error-text">
                    <MdError/>
                    <span>{errors.phone}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label required">Уровень подготовки</label>
                <select
                  name="level"
                  className="form-control"
                  value={userData.level}
                  onChange={handleChange}
                >
                  {levels.map((level) => {
                    return <option value={level.id} key={level.id}>{level.name}</option>
                  })}
                </select>
              </div>

              <div className="form-group full-width">
                <label className="form-label">Описание профиля</label>
                <textarea
                  name="description"
                  className="form-control"
                  value={userData.description}
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
                  value={userData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <div className="error-text">
                    <MdError/>
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
                  value={userData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && (
                  <div className="error-text">
                    <MdError/>
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
      </PageLoader>
    </div>
  );
};

export default SignUpPage;