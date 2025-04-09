import "./ProfilePage.css"
import NavBar from "../../components/navbar/NavBar";
import {useState} from "react";
import {useAuth} from "../../context/AuthContext";
import { PiPencilSimpleLine } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = () => {
        navigate('/editProfile');
    };

    const renderUserInfo = () => (
        <div className="profile-info">
            <div className="profile-header">
                <h2>Профиль</h2>
                <button className="edit-button" onClick={handleEdit}>
                    <PiPencilSimpleLine /> Редактировать
                </button>
            </div>
            
            <div className="info-section">
                <h3>Основная информация</h3>
                <div className="info-grid">
                    <div className="info-item">
                        <label>ФИО</label>
                        <p>{`${user?.lastName || ''} ${user?.firstName || ''} ${user?.middleName || ''}`}</p>
                    </div>
                    <div className="info-item">
                        <label>Email</label>
                        <p>{user?.email || ''}</p>
                    </div>
                    <div className="info-item">
                        <label>Телефон</label>
                        <p>{user?.phone || ''}</p>
                    </div>
                    <div className="info-item">
                        <label>О себе</label>
                        <p>{user?.description || 'Нет описания'}</p>
                    </div>
                </div>
            </div>

            {user?.role === 'student' && (
                <>
                    <div className="info-section">
                        <h3>Уровень подготовки</h3>
                        <p className="level-badge">{user?.level || 'Не указан'}</p>
                    </div>

                    <div className="info-section">
                        <h3>Действующие абонементы</h3>
                        <div className="subscriptions-grid">
                            {user?.subscriptions?.map(sub => (
                                <div key={sub.id} className="subscription-card">
                                    <h4>{sub.name}</h4>
                                    <p>Действует до: {sub.validUntil}</p>
                                    <p>Осталось занятий: {sub.remainingClasses}</p>
                                </div>
                            )) || <p>Нет активных абонементов</p>}
                        </div>
                    </div>

                    <div className="info-section">
                        <h3>Мои группы</h3>
                        <div className="groups-grid">
                            {user?.groups?.map(group => (
                                <div key={group.id} className="group-card">
                                    <h4>{group.name}</h4>
                                    <p>Расписание: {group.schedule}</p>
                                </div>
                            )) || <p>Вы не записаны ни в одну группу</p>}
                        </div>
                    </div>
                </>
            )}
        </div>
    );

    return (
        <div className="page-wrapper">
            <NavBar />
            <div className="profile-container">
                {renderUserInfo()}
            </div>
        </div>
    );
};

export default ProfilePage;