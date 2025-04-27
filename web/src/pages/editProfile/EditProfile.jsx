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

const EditProfile = () => {

  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const session = useSelector((state) => state.session);
  const level = useSelector((state) => state.level);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalInfo, setModalInfo] = useState({
    title: '',
    message: ''
  });

  const navigate = useNavigate();

  const [levels, setLevels] = useState([]);
  const [error, setError] = useState('');

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
        setLoading(false);
        setModalInfo({
          title: 'Ошибка при загрузке уровней',
          message: error.message || String(error),
        });
        setShowModal(true);
      }
    }

    fetchLevels()
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
      setLoading(false);
      setModalInfo({
        title: 'Ошибка во время сохранения данных',
        message: error.message || String(error),
      });
      setShowModal(true);
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

    }
    // todo password update
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  return (
    <>
      <div className="page-wrapper">
        <NavBar/>
        <div className="edit-profile-container">
          <PageLoader loading={loading} text="Загрузка данных...">
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
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="firstName">Имя</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="middleName">Отчество</label>
                  <input
                    type="text"
                    id="middleName"
                    name="middleName"
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
                    name="phone"
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
                    value={formData.description}
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
                      value={formData.oldPassword}
                      onChange={handleChange}
                    />
                  </div>
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