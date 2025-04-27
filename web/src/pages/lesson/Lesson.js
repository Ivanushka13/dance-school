import React, {useState, useEffect} from 'react';
import {useNavigate, useParams, useSearchParams} from 'react-router-dom';
import {format, parseISO} from 'date-fns';
import {ru} from 'date-fns/locale';
import NavBar from "../../components/navbar/NavBar";
import './Lesson.css';
import {useSelector} from "react-redux";
import {apiRequest} from "../../util/apiService";
import {formatDateToDMY, formatTimeToHM} from "../../util";
import {
  MdGroup,
  MdPeopleOutline,
  MdOutlineDescription,
  MdEvent,
  MdPayment,
  MdCancel,
  MdCheckCircle,
  MdArrowBack
} from 'react-icons/md';
import {Button} from "@mui/material";
import ConfirmationModal from "../../components/modal/confirm/ConfirmationModal";
import PageLoader from "../../components/PageLoader/PageLoader";

export const Lesson = () => {

  const role = useSelector(state => state.session.role);
  const session = useSelector(state => state.session);
  const navigate = useNavigate();

  const {lesson_id} = useParams();
  const [lesson, setLesson] = useState({});
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isParticipating, setIsParticipating] = useState(false);
  const [hasValidSubscription, setHasValidSubscription] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [finishTime, setFinishTime] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchLesson = async () => {
      try {
        const lesson_response = await apiRequest({
          method: 'GET',
          url: `/lessons/full-info/${lesson_id}`
        });

        setLesson(lesson_response);
        setStudents(lesson_response.actual_students);
        setTeachers(lesson_response.actual_teachers);

        setStartTime(lesson_response.start_time);
        setFinishTime(lesson_response.finish_time);

        if (role === 'student' && lesson_response.actual_students) {
          const isCurrentStudentParticipating = lesson_response.actual_students.some(
            student => student.id === session.id
          );
          setIsParticipating(isCurrentStudentParticipating);
        }

        if (role === 'student' && session.subscriptions && lesson_response.subscription_templates) {
          const hasSubscription = checkSubscriptions(lesson_response.subscription_templates);
          setHasValidSubscription(hasSubscription);
        }

        setLoading(false);

      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }

    fetchLesson();
  }, [lesson_id, role, session.id, session.subscriptions]);

  const handleNavigate = () => {
    navigate(`/group/${lesson.group_id}`);
  }

  const checkSubscriptions = (templates) => {
    if (!session.subscriptions || !templates) return false;

    for (const subscription of session.subscriptions) {
      const templateId = subscription.subscription_template.id;
      if (templates.some(t => t.id === templateId)) {
        return true;
      }
    }
    return false;
  }

  const handleJoinLesson = () => {
    setShowModal(true);
    setModalInfo({
      title: 'Подтверждение участия',
      message: 'Вы уверены, что хотите записаться на занятие?',
      confirmText: 'Подтвердить',
      cancelText: 'Отменить',
      onConfirm: () => joinLesson()
    });
  }

  const joinLesson = async () => {
    try {
      setLoading(true);
      setShowModal(false);
      setIsParticipating(true);
      setLoading(false);
    } catch (error) {
      console.error("Ошибка при записи на занятие:", error);
      setLoading(false);
    }
  }

  const handleCancelLesson = () => {
    setShowModal(true);
    setModalInfo({
      title: 'Подтверждение отмены занятия',
      message: 'Вы уверены, что хотите отменить запись на занятие?',
      confirmText: 'Подтвердить',
      cancelText: 'Отменить',
      onConfirm: () => cancelLesson()
    });
  }

  const cancelLesson = async () => {
    try {
      setLoading(true);
      setShowModal(false);
      setIsParticipating(false);
      setLoading(false);
    } catch (error) {
      console.error("Ошибка при отмене занятия:", error);
      setLoading(false);
    }
  }

  const handleBuySubscription = () => {
    navigate('/subscriptions');
  }

  return (
    <>
      <NavBar/>
      <div className="group-lesson-content">
        <PageLoader loading={loading} text="Загрузка занятия...">
          <div className="group-lesson-container">
            <div className="group-lesson-info-section">
              <button className="group-back-button" onClick={() => navigate(-1)}>
                <MdArrowBack/>
                <span>Назад</span>
              </button>

              <h1>Информация о занятии</h1>

              {role === 'student' && isParticipating && (
                <div className="participation-badge">
                  <MdCheckCircle className="participation-icon"/>
                  <span>Вы записаны на это занятие</span>
                </div>
              )}

              <div className="group-lesson-info">
                <div className="group-lesson-info-row">
                  <span className="group-lesson-info-label">Название</span>
                  <span className="group-lesson-info-value">
                  {lesson.name}
                </span>
                </div>
                <div className="group-lesson-info-row">
                  <span className="group-lesson-info-label">Тип занятия</span>
                  <span className="group-lesson-info-value">
                  {lesson.group_id == null ? "Индивидуальное занятие" : "Групповое занятие"}
                </span>
                </div>
                <div className="group-lesson-info-row">
                  <span className="group-lesson-info-label">Стиль танца</span>
                  <span className="group-lesson-info-value">
                  {lesson.lesson_type?.dance_style.name}
                </span>
                </div>
                <div className="group-lesson-info-row">
                  <span className="group-lesson-info-label">Дата</span>
                  <span className="group-lesson-info-value">
                  {formatDateToDMY(startTime)}
                </span>
                </div>
                <div className="group-lesson-info-row">
                  <span className="group-lesson-info-label">Время</span>
                  <span className="group-lesson-info-value">
                  {formatTimeToHM(startTime)} - {formatTimeToHM(finishTime)}
                </span>
                </div>
                <div className="group-lesson-info-row">
                  <span className="group-lesson-info-label">Зал</span>
                  <span className="group-lesson-info-value">{lesson.classroom?.name || "Не указан"}</span>
                </div>
                {lesson.group_id && (
                  <div className="group-lesson-info-row">
                    <span className="group-lesson-info-label">Участники</span>
                    <span className="group-lesson-info-value">
                  {students.length}/{lesson?.group?.max_capacity || '-'}
                </span>
                  </div>
                )}
                {lesson.are_neighbours_allowed !== undefined && (
                  <div className="group-lesson-info-row">
                    <span className="group-lesson-info-label">Соседи в зале</span>
                    <span className="group-lesson-info-value">
                    {lesson.are_neighbours_allowed ? 'Да' : 'Нет'}
                  </span>
                  </div>
                )}
              </div>

              <div className="group-lesson-description">
                {lesson.description || "Описание занятия отсутствует"}
              </div>
            </div>

            {lesson.group_id && (
              <div className="group-card-container">
                <div className="lesson-group-card">
                  <div className="lesson-group-card-header">
                    <h2>Информация о группе</h2>
                    <div className="lesson-group-count">
                      <MdPeopleOutline/>
                      <span>{students.length}</span>
                      <span>/</span>
                      <span>{lesson.group?.max_capacity || '-'}</span>
                    </div>
                  </div>
                  <div className="lesson-group-info" onClick={handleNavigate}>
                    <div className="lesson-group-item">
                      <div className="lesson-group-icon">
                        <MdGroup/>
                      </div>
                      <div className="lesson-group-details">
                        <div className="lesson-group-name">{lesson.group.name}</div>
                        <div className="lesson-group-description">
                          {lesson.group?.description || ""}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="lesson-teachers-section">
              <div className="lesson-teachers-header">
                <h2>Преподаватели</h2>
              </div>
              <div className="lesson-teachers-list">
                {teachers.map((teacher) => (
                  <div key={teacher.id} className="lesson-teacher-item">
                    {teacher?.photo ? (
                      <img src={teacher.photo} alt={teacher.user.first_name}/>
                    ) : (
                      <div className="lesson-avatar-circle">
                        {teacher.user.first_name.charAt(0)}
                        {teacher.user.last_name.charAt(0)}
                      </div>
                    )}
                    <div className="lesson-teacher-details">
                      <div className="lesson-teacher-name">
                        {`${teacher.user.last_name} ${teacher.user.first_name} ${teacher.user?.middle_name || ''}`}
                      </div>
                      <div className="lesson-teacher-description">
                        {teacher.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {role === 'student' && (
              <div className="lesson-action-buttons">
                {!hasValidSubscription ? (
                  <Button
                    variant="contained"
                    color="primary"
                    className="buy-subscription-button"
                    onClick={handleBuySubscription}
                    startIcon={<MdPayment/>}
                    style={{backgroundColor: '#1a1a1a', color: 'white'}}
                  >
                    Приобрести абонемент
                  </Button>
                ) : isParticipating ? (
                  <Button
                    variant="outlined"
                    color="error"
                    className="cancel-lesson-button"
                    onClick={handleCancelLesson}
                    startIcon={<MdCancel/>}
                  >
                    Отменить занятие
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    className="join-lesson-button"
                    onClick={handleJoinLesson}
                    startIcon={<MdCheckCircle/>}
                    style={{backgroundColor: '#1a1a1a', color: 'white'}}
                  >
                    Буду участвовать
                  </Button>
                )}
              </div>
            )}
          </div>
        </PageLoader>
      </div>
      <ConfirmationModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={modalInfo.onConfirm}
        title={modalInfo.title}
        message={modalInfo.message}
        confirmText={modalInfo.confirmText}
        cancelText={modalInfo.cancelText}
      />
    </>
  );
};