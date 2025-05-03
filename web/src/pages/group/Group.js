import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import NavBar from "../../components/navbar/NavBar";
import './Group.css';
import {useSelector} from "react-redux";
import {apiRequest} from "../../util/apiService";
import {
  MdGroup,
  MdClass,
  MdArrowBack,
  MdDone,
  MdLibraryAdd,
  MdLogout,
  MdDelete
} from 'react-icons/md';
import {Button} from "@mui/material";
import ConfirmationModal from "../../components/modal/confirm/ConfirmationModal";
import PageLoader from "../../components/PageLoader/PageLoader";
import InformationModal from "../../components/modal/info/InformationModal";

const fetchGroup = async (
  group_id
) => {
  return await apiRequest({
    method: 'GET',
    url: `/groups/full-info/${group_id}`
  });
};

export const Group = () => {

  const user_role = useSelector(state => state.session.role);
  const user_id = useSelector(state => state.session.id);
  const user_subscriptions = useSelector(state => state.session);

  const navigate = useNavigate();

  const {group_id} = useParams();
  const [group, setGroup] = useState({});
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [danceStyles, setDanceStyles] = useState([]);
  const [availableJoin, setAvailableJoin] = useState(false);
  const [joinedGroup, setJoinedGroup] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalInfo, setConfirmModalInfo] = useState({});
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});

  useEffect(() => {
    fetchGroup(group_id).then((groupResponse) => {
      setGroup(groupResponse);
      setStudents(groupResponse.students);
      setTeachers(groupResponse.teachers);
      setDanceStyles(groupResponse.dance_styles);

      setAvailableJoin(
        groupResponse.max_capacity > groupResponse.students.length &&
        groupResponse.fitting_subscriptions &&
        groupResponse.fitting_subscriptions.length > 0
      );

      if (user_role === 'student') {
        const joined = groupResponse.students.some((student) => student.id === user_id);
        setJoinedGroup(joined);
      }
    }).catch((error) => {
      setModalInfo({
        title: 'Ошибка при загрузке данных группы',
        message: error.message || String(error),
      });
      setShowInfoModal(true);
    }).finally(() => setLoading(false));
  }, [joinedGroup]);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleJoinGroup = () => {
    setShowConfirmModal(true);
    setConfirmModalInfo({
      title: 'Подтверждение записи',
      message: 'Вы уверены, что хотите записаться в группу?',
      confirmText: 'Подтвердить',
      cancelText: 'Отменить',
      onConfirm: () => joinGroup()
    });
  }

  const joinGroup = async () => {
    try {
      setLoading(true);
      setShowConfirmModal(false);

      const request = await apiRequest({
        method: 'POST',
        url: `students/groups/${user_id}/${group.id}`
      });

      setJoinedGroup(true);

      setModalInfo({
        title: 'Уведомление',
        message: 'Вы вступили в группу',
      });
      setShowInfoModal(true);

    } catch (error) {
      setShowConfirmModal(false);
      setModalInfo({
        title: 'Ошибка при вступлении в группу',
        message: error.message || String(error),
      });
      setShowInfoModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveGroup = (student_id) => {
    setShowConfirmModal(true);
    setConfirmModalInfo({
      title: 'Подтверждение удаления',
      message: 'Вы уверены, что хотите выйти из группы?',
      confirmText: 'Подтвердить',
      cancelText: 'Отменить',
      onConfirm: () => removeStudent(student_id)
    });

    setModalInfo({
      title: 'Уведомление',
      message: 'Вы покинули группу',
    });
  }

  const handleRemoveStudent = (student_id) => {
    setShowConfirmModal(true);
    setConfirmModalInfo({
      title: 'Подтверждение удаления',
      message: 'Вы уверены, что хотите удалить ученика из группы?',
      confirmText: 'Подтвердить',
      cancelText: 'Отменить',
      onConfirm: () => removeStudent(student_id)
    });

    setModalInfo({
      title: 'Студент удален из группы',
      message: '',
    });
  };

  const removeStudent = async (student_id) => {
    try {
      setLoading(true);
      setShowConfirmModal(false);

      const request = await apiRequest({
        method: 'DELETE',
        url: `students/groups/${student_id}/${group.id}`
      });

      setJoinedGroup(false);
      setShowInfoModal(true);

    } catch (error) {
      setShowConfirmModal(false);
      setModalInfo({
        title: 'Ошибка при удалении студента из группы',
        message: error.message || String(error),
      });
      setShowInfoModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar/>
      <div className="group-content">
        <PageLoader loading={loading} text="Загрузка...">
          <div className="group-container">
            <div className="group-info-section">
              <button className="group-back-button" onClick={handleGoBack}>
                <MdArrowBack/>
                <span>Назад</span>
              </button>

              <h1>{group.name}</h1>

              {user_role === 'student' && joinedGroup && (
                <div className="group-joined-badge">
                  <MdDone className="group-joined-icon"/>
                  <span>Вы записаны в группу</span>
                </div>
              )}

              <div className="group-info">
                <div className="group-info-row">
                  <div className="group-info-icon">
                    <MdClass/>
                  </div>
                  <div className="group-info-content">
                    <span className="group-info-label">Уровень</span>
                    <span className="group-info-value">
                    {group.level?.name || "Не указан"}
                  </span>
                  </div>
                </div>
                <div className="group-info-row">
                  <div className="group-info-icon">
                    <MdGroup/>
                  </div>
                  <div className="group-info-content">
                    <span className="group-info-label">Количество участников</span>
                    <span className="group-info-value">
                    {students.length}/{group.max_capacity || '-'}
                  </span>
                  </div>
                </div>
              </div>

              <div className="group-description-container">
                <div className="group-description">
                  {group.description || "Описание группы отсутствует"}
                </div>
              </div>
            </div>


            {danceStyles && danceStyles.length > 0 && (
              <div className="group-dance-styles-section">
                <div className="dance-styles-header">
                  <h2>Стили танца</h2>
                </div>
                <div className="dance-styles-list">
                  {danceStyles.map((style) => (
                    <div key={style.id} className="dance-style-item">
                      <div className="dance-style-icon">
                      </div>
                      <div className="dance-style-details">
                        <div className="dance-style-name">{style.name}</div>
                        <div className="dance-style-description">{style.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}


            {teachers && teachers.length > 0 && (
              <div className="group-teachers-section">
                <div className="teachers-section-header">
                  <h2>Преподаватели</h2>
                </div>
                <div className="teachers-list">
                  {teachers.map((teacher) => (
                    <div key={teacher.id} className="teacher-item">
                      {teacher?.photo ? (
                        <img src={teacher?.photo} alt={teacher.user.first_name}/>
                      ) : (
                        <div className="avatar-circle">
                          {teacher.user?.first_name?.charAt(0) || ''}
                          {teacher.user?.last_name?.charAt(0) || ''}
                        </div>
                      )}
                      <div className="teacher-details">
                        <div className="teacher-name">
                          {
                            `${teacher.user.last_name || ''} ${teacher.user.first_name || ''} ${teacher.user?.middle_name || ''}`
                          }
                        </div>
                        <div className="teacher-description">
                          {teacher.description || ""}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}


            <div className="group-students-section">
              <div className="students-section-header">
                <h2>Участники</h2>
                <div className="students-count">
                  <span>{students.length}</span>
                  <span>/</span>
                  <span>{group.max_capacity}</span>
                </div>
              </div>

              <div className="students-list">
                {students.map((student) => (
                  <div key={student.id} className="student-item">
                    {student.photo ? (
                      <img src={student.photo} alt={student.user.first_name}/>
                    ) : (
                      <div className="avatar-circle">
                        {student.user.first_name?.charAt(0) || ''}
                        {student.user.last_name?.charAt(0) || ''}
                      </div>
                    )}
                    <div className="student-details">
                      <div className="student-name">
                        {`${
                          student.user.last_name || ''} ${student.user.first_name || ''} ${student.user?.middle_name || ''}`
                        }
                      </div>
                    </div>
                    {user_role === 'teacher' && teachers.find(teacher => teacher.id === user_id) && (
                      <button
                        className="student-remove-button"
                        onClick={() => handleRemoveStudent(student.id)}
                        title="Удалить из группы"
                      >
                        <MdDelete/>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {user_role === 'student' && (
              <div className="group-action-buttons">
                {joinedGroup ? (
                  <Button
                    variant="outlined"
                    color="error"
                    className="leave-group-button"
                    onClick={() => handleLeaveGroup(user_id)}
                    startIcon={<MdLogout/>}
                  >
                    Выйти из группы
                  </Button>
                ) : availableJoin && (
                  <Button
                    variant="contained"
                    className="join-group-button"
                    onClick={handleJoinGroup}
                    startIcon={<MdLibraryAdd/>}
                  >
                    Записаться в группу
                  </Button>
                )}
              </div>
            )}
          </div>
        </PageLoader>
      </div>
      <ConfirmationModal
        visible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmModalInfo.onConfirm}
        title={confirmModalInfo.title}
        message={confirmModalInfo.message}
        confirmText={confirmModalInfo.confirmText}
        cancelText={confirmModalInfo.cancelText}
      />
      <InformationModal
        visible={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title={modalInfo.title}
        message={modalInfo.message}
      />
    </>
  );
};

export default Group; 