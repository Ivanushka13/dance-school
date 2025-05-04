import "./ProfilePage.css"
import NavBar from "../../components/navbar/NavBar";
import {PiPencilSimpleLine} from "react-icons/pi";
import {useNavigate} from "react-router-dom";
import {useSelector} from 'react-redux';
import {
  MdAccessTime,
  MdAssessment,
  MdAssignment,
  MdCardMembership,
  MdGroups,
  MdPerson,
  MdOutlineClass,
  MdSchedule,
  MdEmail,
  MdPhone,
  MdInfo,
  MdStar
} from 'react-icons/md';
import {useEffect, useState} from "react";
import PageLoader from "../../components/PageLoader/PageLoader";

const ProfilePage = () => {

  const user = useSelector((state) => state.user);
  const session = useSelector((state) => state.session);
  const level = useSelector((state) => state.level);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (user && session && level) {
      setLoading(false);
    }
  }, [user, session, level])

  const handleEdit = async () => {
    navigate('/editProfile');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указано';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const handleApplications = () => {
    navigate('/applications');
  };

  const handleSlots = () => {
    navigate('/slots');
  };

  const handleGroupClick = (group_id) => {
    navigate(`/group/${group_id}`);
  }

  const renderUserInfo = () => (
    <div className="profile-info">
      <div className="profile-header">
        <h2>{user.last_name} {user.first_name} {user?.middle_name}</h2>
        <div className="profile-actions">
          {session.role === 'student' && (
            <button className="profile-button" onClick={handleApplications}>
              <MdAssignment/> Мои заявки
            </button>
          )}
          {session.role === 'teacher' && (
            <button className="profile-button" onClick={handleSlots}>
              <MdSchedule/> Мои слоты
            </button>
          )}
          <button className="edit-button" onClick={handleEdit}>
            <PiPencilSimpleLine/> Редактировать
          </button>
        </div>
      </div>

      <div className="info-section">
        <h3>Основная информация</h3>
        <div className="user-info-cards">
          <div className="user-info-card">
            <div className="user-info-icon">
              <MdEmail/>
            </div>
            <div className="user-info-content">
              <label>Email</label>
              <p>{user?.email || 'Не указан'}</p>
            </div>
          </div>

          <div className="user-info-card">
            <div className="user-info-icon">
              <MdPhone/>
            </div>
            <div className="user-info-content">
              <label>Телефон</label>
              <p>{user?.phone_number || 'Не указан'}</p>
            </div>
          </div>

          {session.role === 'student' && (
            <div className="user-info-card">
              <div className="user-info-icon">
                <MdStar/>
              </div>
              <div className="user-info-content">
                <label>Уровень подготовки</label>
                <p>{level.name || 'Не указан'}</p>
              </div>
            </div>
          )}

          <div className="user-info-card user-info-card-full">
            <div className="user-info-icon">
              <MdInfo/>
            </div>
            <div className="user-info-content">
              <label>О себе</label>
              <p className="user-description">{user?.description || 'Нет описания'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="info-section">
        <h3>Мои группы</h3>
        {session.groups && session.groups.length > 0 ? (
          <div className="groups-grid">
            {session.groups.map(group => (
              <div key={group.id} className="group-card" onClick={() => handleGroupClick(group.id)}>
                <h4>{group.name}</h4>
                <p><MdOutlineClass/> {group.level.name}</p>
                <p><MdPerson/> {group?.description || "Нет описания"}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-items-container">
            <MdGroups className="no-items-icon"/>
            <h3>Вы пока не записаны ни в одну группу</h3>
            <p>Запишитесь на занятия в разделе "Запись"</p>
          </div>
        )}
      </div>

      {session.role === 'student' && (
        <>
          <div className="info-section">
            <h3>Действующие абонементы</h3>
            {session.subscriptions && session.subscriptions.filter(sub => sub.payment_id !== null).length > 0 ? (
              <div className="subscriptions-grid">
                {session.subscriptions
                  .filter(sub => sub.payment_id !== null)
                  .map(sub => (
                    <div key={sub.id} className="profile-subscription-card profile-active-subscription">
                      <div className="profile-active-badge">Активен</div>
                      <div className="profile-card-header">
                        <h2 className="profile-card-title">{sub.subscription_template.name}</h2>
                      </div>
                      <div className="profile-card-details">
                        <div className="profile-detail-item">
                          <MdAssessment className="profile-detail-icon"/>
                          <span className="profile-detail-text">
                          Оставшихся занятий: {sub.lessons_left}
                        </span>
                        </div>
                        <div className="profile-detail-item">
                          <MdAccessTime className="profile-detail-icon"/>
                          <span className="profile-detail-text">
                          Действует до: {formatDate(sub.subscription_template.expiration_date)}
                        </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="no-items-container">
                <MdCardMembership className="no-items-icon"/>
                <h3>У вас пока нет активных абонементов</h3>
                <p>Приобретите абонемент в разделе "Абонементы"</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="profile-page-wrapper">
      <NavBar/>
      <PageLoader loading={loading} text="Загрузка данных...">
        <div className="profile-container">
          {renderUserInfo()}
        </div>
      </PageLoader>
    </div>
  );
};

export default ProfilePage;