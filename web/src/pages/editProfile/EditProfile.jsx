import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import NavBar from '../../components/navbar/NavBar';
import './EditProfile.css';
import {useDispatch, useSelector} from "react-redux";
import {apiRequest} from "../../util/apiService";
import {setUser} from "../../redux/slices/userSlice";
import {setLevel} from "../../redux/slices/levelSlice";
import InformationModal from "../../components/modal/info/InformationModal";
import PageLoader from "../../components/PageLoader/PageLoader";
import {MdError} from 'react-icons/md';

const EditProfile = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const session = useSelector((state) => state.session);
  const level = useSelector((state) => state.level);

  const [loading, setLoading] = useState(true);
  const [levels, setLevels] = useState([]);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});

  const [formData, setFormData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    middle_name: user.middle_name,
    email: user.email,
    phone_number: user.phone_number,
    description: user.description,
    level: level.id,
    newPassword: '',
    confirmPassword: '',
    oldPassword: ''
  });

  useEffect(() => {
    setFormData({
      ...user,
      level: level.id,
      newPassword: '',
      confirmPassword: '',
      oldPassword: ''
    });
  }, [user, level]);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await apiRequest({
          method: 'POST',
          url: '/levels/search',
          data: {terminated: false}
        });

        setLevels(response.levels);
        setLoading(false);

      } catch (error) {
        setModalInfo({
          title: 'Ошибка при загрузке уровней',
          message: error.message || String(error),
        });
        setShowModal(true);
        setLoading(false);
      }
    }

    fetchLevels()
  }, []);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleMainInfoSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const user_update = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      middle_name: formData.middle_name,
      description: formData.description,
      ...(formData.email !== user.email && {email: formData.email}),
      ...(formData.phone_number !== user.phone_number && {phone_number: formData.phone_number}),
      ...(session.role === 'student' && {level_id: formData.level}),
    };

    try {
      const response = await apiRequest({
        method: 'patch',
        url: session.role === 'student' ? `/students/${session.id}` : `/teachers/${session.id}`,
        data: user_update
      });

      dispatch(setUser(response.user));
      if (session.role === 'student') {
        dispatch(setLevel(response.level));
      }

      setLoading(false);
      navigate('/profile');

    } catch (error) {
      setModalInfo({
        title: 'Ошибка во время сохранения данных',
        message: error.message || String(error),
      });
      setShowModal(true);
      setLoading(false);
    }
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!formData.oldPassword) {
      newErrors.oldPassword = 'Введите текущий пароль';
    } else if (formData.oldPassword.length < 8) {
      newErrors.oldPassword = 'Пароль должен быть не менее 8 символов';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Введите новый пароль';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Пароль должен быть не менее 8 символов';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Подтвердите пароль';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await apiRequest({
        method: 'patch',
        url: session.role === 'student' ? `/students/${session.id}` : `/teachers/${session.id}`,
        data: {
          old_password: formData.oldPassword,
          new_password: formData.newPassword
        }
      });

      setFormData({
        ...formData,
        newPassword: '',
        confirmPassword: '',
        oldPassword: ''
      });

      setModalInfo({
        title: 'Пароль был успешно изменен',
        message: '',
      });
      setShowModal(true);

      setLoading(false);

    } catch (error) {
      setLoading(false);
      setModalInfo({
        title: 'Ошибка при изменении пароля',
        message: error.message || String(error),
      });
      setShowModal(true);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <>
      <div className="page-wrapper">
        <NavBar/>
        <div className="page-content">
          <PageLoader loading={loading} text="Загрузка данных...">
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
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="firstName">Имя</label>
                    <input
                      type="text"
                      id="firstName"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="middleName">Отчество</label>
                    <input
                      type="text"
                      id="middleName"
                      name="middle_name"
                      value={formData.middle_name}
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
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="form-section-title">Дополнительная информация</h3>
                  {session.role === 'student' && (
                    <div className="form-group">
                      <label htmlFor="level">Уровень подготовки</label>
                      <select
                        id="level"
                        name="level"
                        value={formData.level}
                        onChange={handleChange}
                        className="select-input"
                      >
                        {levels.map((item) => (
                          <option key={item.id} value={item.id}>{item.name}</option>
                        ))}

                      </select>
                    </div>
                  )}
                  <div className="form-group">
                    <label htmlFor="description">О себе</label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description || ''}
                      onChange={handleChange}
                      placeholder="Расскажите о своем опыте, интересах и целях"
                    />
                  </div>
                </div>

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
                      <label htmlFor="oldPassword">Текущий пароль</label>
                      <input
                        type="password"
                        id="oldPassword"
                        name="oldPassword"
                        className={`${errors.oldPassword ? 'error' : ''}`}
                        value={formData.oldPassword}
                        onChange={handleChange}
                      />
                      {errors.oldPassword && (
                        <div className="field-error">
                          <MdError/>
                          <span>{errors.oldPassword}</span>
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="newPassword">Новый пароль</label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        className={`${errors.newPassword ? 'error' : ''}`}
                        value={formData.newPassword}
                        onChange={handleChange}
                      />
                      {errors.newPassword && (
                        <div className="field-error">
                          <MdError/>
                          <span>{errors.newPassword}</span>
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="confirmPassword">Подтверждение пароля</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className={`${errors.confirmPassword ? 'error' : ''}`}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      {errors.confirmPassword && (
                        <div className="field-error">
                          <MdError/>
                          <span>{errors.confirmPassword}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="buttons-container">
                  <button type="button" className="save-button" onClick={handlePasswordSubmit}>
                    Изменить пароль
                  </button>
                </div>
              </form>
            </div>
          </PageLoader>
        </div>
      </div>
      <InformationModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title={modalInfo.title}
        message={modalInfo.message}
      />
    </>
  );
};

export default EditProfile; 