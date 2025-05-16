import React, {useEffect, useState} from "react";
import './Profile.css';
import SideBar from '../../Components/SideBar/SideBar';
import NavBar from '../../Components/NavBar/NavBar';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import SecurityIcon from '@mui/icons-material/Security';
import {MdError} from 'react-icons/md';
import {apiRequest} from "../../util/apiService";
import {useDispatch, useSelector} from "react-redux";
import {updateSessionField} from "../../redux/sessionSlice";
import InfoModal from "../../Components/Modal/InfoModal/InfoModal";

const Profile = () => {

  const session = useSelector(state => state.session);
  const user = useSelector(state => state.session.user);

  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});

  const [formData, setFormData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    middle_name: user.middle_name,
    email: user.email,
    phone_number: user.phone_number,
    newPassword: '',
    confirmPassword: '',
    oldPassword: ''
  });

  useEffect(() => {
    setFormData({
      ...user,
      newPassword: '',
      confirmPassword: '',
      oldPassword: ''
    });
  }, [user]);

  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phone: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });


    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен для заполнения';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (!formData.phone_number.trim()) {
      newErrors.phone = 'Номер телефона обязателен для заполнения';
    }

    setErrors(prev => ({
      ...prev,
      ...newErrors
    }));

    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};

    if (!formData.oldPassword) {
      newErrors.oldPassword = 'Введите текущий пароль';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'Введите новый пароль';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Пароль должен быть не менее 8 символов';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Подтвердите новый пароль';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    setErrors(prev => ({
      ...prev,
      ...newErrors
    }));

    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (validateProfileForm()) {
      setIsLoading(true);

      try {
        const user_update = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          middle_name: formData.middle_name,
          ...(formData.email !== user.email && {email: formData.email}),
          ...(formData.phone_number !== user.phone_number && {phone_number: formData.phone_number}),
        };

        const response_data = await apiRequest({
          method: 'patch',
          url: `/admins/${session.id}`,
          data: user_update
        });

        dispatch(updateSessionField(response_data));

        setIsEditing(false);
      } catch (error) {
        setModalInfo({
          title: 'Ошибка при загрузке данных',
          message: error.message || String(error),
        });
        setShowInfoModal(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();

    if (validatePasswordForm()) {
      setIsLoading(true);

      try {
        await apiRequest({
          method: 'patch',
          url: `/admins/${session.id}`,
          data: {
            old_password: formData.oldPassword,
            new_password: formData.newPassword
          }
        });

        setFormData({
          ...formData,
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });

      } catch (error) {
        setModalInfo({
          title: 'Ошибка при загрузке данных',
          message: error.message || String(error),
        });
        setShowInfoModal(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);

    setFormData({
      ...user,
      newPassword: '',
      confirmPassword: '',
      oldPassword: ''
    });

    setErrors({
      firstName: '',
      lastName: '',
      middleName: '',
      email: '',
      phone: '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <>
      <div className="profile-page">
        <SideBar/>
        <div className="profile-container">
          <NavBar/>
          <div className="profile-content">
            <div className="profile-main-content">
              <div className="profile-header">
                <div className="profile-header-content">
                  <div className="profile-header-icon">
                    <PersonIcon/>
                  </div>
                  <div className="profile-header-text">
                    <h1>Профиль</h1>
                  </div>
                </div>
              </div>

              <div className="profile-cards-container">
                <div className="profile-card">
                  <div className="profile-card-header">
                    <h2>Личная информация</h2>
                    <div className="profile-header-controls">
                      {!isEditing && (
                        <button
                          className="edit-button"
                          onClick={() => setIsEditing(true)}
                          disabled={isLoading}
                        >
                          <EditIcon/>
                          <span>Редактировать</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="profile-form">
                    <div className="profile-form-group">
                      <label htmlFor="firstName">Имя</label>
                      <div className={`profile-input-wrapper ${errors.firstName ? 'error' : ''}`}>
                        <input
                          type="text"
                          id="firstName"
                          name="first_name"
                          value={formData.first_name || ''}
                          onChange={handleChange}
                          disabled={!isEditing || isLoading}
                          placeholder="Введите имя"
                        />
                      </div>
                      {errors.firstName &&
                        <div className="profile-error-message">
                          <MdError/>
                          <span>{errors.firstName}</span>
                        </div>}
                    </div>

                    <div className="profile-form-group">
                      <label htmlFor="lastName">Фамилия</label>
                      <div className={`profile-input-wrapper ${errors.lastName ? 'error' : ''}`}>
                        <input
                          type="text"
                          id="lastName"
                          name="last_name"
                          value={formData.last_name || ''}
                          onChange={handleChange}
                          disabled={!isEditing || isLoading}
                          placeholder="Введите фамилию"
                        />
                      </div>
                      {errors.lastName &&
                        <div className="profile-error-message">
                          <MdError/>
                          <span>{errors.lastName}</span>
                        </div>}
                    </div>

                    <div className="profile-form-group">
                      <label htmlFor="middleName">Отчество</label>
                      <div className={`profile-input-wrapper ${errors.middleName ? 'error' : ''}`}>
                        <input
                          type="text"
                          id="middleName"
                          name="middle_name"
                          value={formData.middle_name || ''}
                          onChange={handleChange}
                          disabled={!isEditing || isLoading}
                          placeholder="Введите отчество"
                        />
                      </div>
                      {errors.middleName &&
                        <div className="profile-error-message">
                          <MdError/>
                          <span>{errors.middleName}</span>
                        </div>}
                    </div>

                    <div className="profile-form-group">
                      <label htmlFor="email">Email</label>
                      <div className={`profile-input-wrapper ${errors.email ? 'error' : ''}`}>
                        <EmailIcon className="profile-field-icon"/>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email || ''}
                          onChange={handleChange}
                          disabled={!isEditing || isLoading}
                          placeholder="Введите email"
                        />
                      </div>
                      {errors.email &&
                        <div className="profile-error-message">
                          <MdError/>
                          <span>{errors.email}</span>
                        </div>}
                    </div>

                    <div className="profile-form-group">
                      <label htmlFor="phone">Номер телефона</label>
                      <div className={`profile-input-wrapper ${errors.phone ? 'error' : ''}`}>
                        <PhoneIcon className="profile-field-icon"/>
                        <input
                          type="tel"
                          id="phone"
                          name="phone_number"
                          value={formData.phone_number || ''}
                          onChange={handleChange}
                          disabled={!isEditing || isLoading}
                          placeholder="Введите номер телефона"
                        />
                      </div>
                      {errors.phone &&
                        <div className="profile-error-message">
                          <MdError/>
                          <span>{errors.phone}</span>
                        </div>}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="profile-actions">
                      <button
                        className="cancel-button"
                        onClick={handleCancelEdit}
                        disabled={isLoading}
                      >
                        <CloseIcon/>
                        <span>Отмена</span>
                      </button>
                      <button
                        className="save-button"
                        onClick={handleSaveProfile}
                        disabled={isLoading}
                      >
                        <SaveIcon/>
                        <span>{isLoading ? 'Сохранение...' : 'Сохранить изменения'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="profile-card">
                    <div className="profile-card-header">
                      <h2>Изменение пароля</h2>
                      <div className="security-icon">
                        <SecurityIcon/>
                      </div>
                    </div>

                    <div className="profile-form">
                      <div className="profile-form-group">
                        <label htmlFor="oldPassword">Текущий пароль</label>
                        <div
                          className={`profile-input-wrapper ${errors.oldPassword ? 'error' : ''}`}>
                          <LockIcon className="profile-field-icon"/>
                          <input
                            type={showOldPassword ? "text" : "password"}
                            id="oldPassword"
                            name="oldPassword"
                            value={formData.oldPassword}
                            onChange={handleChange}
                            placeholder="Введите текущий пароль"
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            className="visibility-toggle"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            disabled={isLoading}
                          >
                            {showOldPassword ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                          </button>
                        </div>
                        {errors.oldPassword &&
                          <div className="profile-error-message">
                            <MdError/>
                            <span>{errors.oldPassword}</span>
                          </div>}
                      </div>

                      <div className="profile-form-group">
                        <label htmlFor="newPassword">Новый пароль</label>
                        <div
                          className={`profile-input-wrapper ${errors.newPassword ? 'error' : ''}`}>
                          <LockIcon className="profile-field-icon"/>
                          <input
                            type={showNewPassword ? "text" : "password"}
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="Введите новый пароль"
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            className="visibility-toggle"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            disabled={isLoading}
                          >
                            {showNewPassword ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                          </button>
                        </div>
                        {errors.newPassword &&
                          <div className="profile-error-message">
                            <MdError/>
                            <span>{errors.newPassword}</span>
                          </div>}
                      </div>

                      <div className="profile-form-group">
                        <label htmlFor="confirmPassword">Подтверждение пароля</label>
                        <div
                          className={`profile-input-wrapper ${errors.confirmPassword ? 'error' : ''}`}>
                          <LockIcon className="profile-field-icon"/>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Подтвердите новый пароль"
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            className="visibility-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            disabled={isLoading}
                          >
                            {showConfirmPassword ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                          </button>
                        </div>
                        {errors.confirmPassword &&
                          <div className="profile-error-message">
                            <MdError/>
                            <span>{errors.confirmPassword}</span>
                          </div>}
                      </div>
                    </div>

                    <div className="profile-actions">
                      <button
                        className="save-button full-width"
                        onClick={handleSavePassword}
                        disabled={isLoading}
                      >
                        <LockIcon/>
                        <span>{isLoading ? 'Обновление...' : 'Обновить пароль'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <InfoModal
        visible={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title={modalInfo.title}
        message={modalInfo.message}
      />
    </>
  );
};

export default Profile;