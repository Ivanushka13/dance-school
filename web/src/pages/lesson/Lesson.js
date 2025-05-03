import React, {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import NavBar from "../../components/navbar/NavBar";
import './Lesson.css';
import {useSelector} from "react-redux";
import {apiRequest} from "../../util/apiService";
import {
  getDateFromISOstring,
  getTimeFromISOstring,
} from "../../util";
import {
  MdGroup,
  MdPeopleOutline,
  MdPayment,
  MdCancel,
  MdCheckCircle,
  MdArrowBack,
  MdCreditCard,
  MdClose, MdCheck
} from 'react-icons/md';
import {Button} from "@mui/material";
import ConfirmationModal from "../../components/modal/confirm/ConfirmationModal";
import PageLoader from "../../components/PageLoader/PageLoader";
import InformationModal from "../../components/modal/info/InformationModal";

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
  const [isInGroup, setIsInGroup] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [finishTime, setFinishTime] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalInfo, setConfirmModalInfo] = useState({});
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const [showSubscriptionsModal, setShowSubscriptionsModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchLesson = async () => {
      try {
        const lesson_response = await apiRequest({
          method: 'GET',
          url: `/lessons/full-info/${lesson_id}`
        });

        await setLessonInfo(lesson_response);

      } catch (error) {
        setModalInfo({
          title: 'Ошибка при загрузке данных занятия',
          message: error.message || String(error),
        });
        setShowInfoModal(true);
      } finally {
        setLoading(false);
      }
    }

    fetchLesson();
  }, [lesson_id, role, session.id, session.subscriptions]);

  const setLessonInfo = (lesson) => {

    setLesson(lesson);
    setStudents(lesson.actual_students);
    setTeachers(lesson.actual_teachers);

    setStartTime(lesson.start_time);
    setFinishTime(lesson.finish_time);

    if (role === 'student') {
      setIsParticipating(lesson.actual_students
        .some(student => student.id === session.id));

      setIsInGroup(lesson.group.students
        .some(student => student.id === session.id));
    }
  }

  const handleNavigate = () => {
    navigate(`/group/${lesson.group_id}`);
  }


  const handleFittingSubSelections = () => {
    if (lesson.fitting_subscriptions && lesson.fitting_subscriptions.length > 0) {
      setShowSubscriptionsModal(true);
    }
  }

  const handleSubscriptionConfirm = () => {
    if (selectedSubscription) {
      setShowSubscriptionsModal(false);
      setShowConfirmModal(true);
      setConfirmModalInfo({
        title: 'Подтверждение записи на занятие',
        message: `Вы уверены, что хотите записаться на занятие?`,
        confirmText: 'Подтвердить',
        cancelText: 'Отменить',
        onConfirm: () => joinLesson()
      });
    }
  }

  const joinLesson = async () => {
    try {
      setLoading(true);
      setShowConfirmModal(false);

      const response = await apiRequest({
        method: 'POST',
        url: `/subscriptions/lessons/${selectedSubscription.id}/${lesson.id}`
      });

      await setLessonInfo(response);

    } catch (error) {
      setModalInfo({
        title: 'Ошибка при записи на занятие',
        message: error.message || String(error),
      });
      setShowInfoModal(true);
    } finally {
      setLoading(false);
    }
  }

  const handleCancelLesson = () => {
    setShowConfirmModal(true);
    setConfirmModalInfo({
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
      setShowConfirmModal(false);

      if(!selectedSubscription) {
        setSelectedSubscription(lesson.used_subscription);
      }

      const response = await apiRequest({
        method: 'PATCH',
        url: `/subscriptions/lessons/cancel/${selectedSubscription.id}/${lesson.id}`
      });

      console.log("DELETE:")
      console.log(response);

      await setLessonInfo(response);

    } catch (error) {
      setModalInfo({
        title: 'Ошибка при отмене занятия',
        message: error.message || String(error),
      });
      setShowInfoModal(true);
    } finally {
      setLoading(false);
    }
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
                  {getDateFromISOstring(startTime)}
                </span>
                </div>
                <div className="group-lesson-info-row">
                  <span className="group-lesson-info-label">Время</span>
                  <span className="group-lesson-info-value">
                  {getTimeFromISOstring(startTime)} - {getTimeFromISOstring(finishTime)}
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
                      <span>{lesson?.group?.students.length}</span>
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
                {teachers?.map((teacher) => (
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
                {isParticipating ? (
                  <Button
                    variant="outlined"
                    color="error"
                    className="cancel-lesson-button"
                    onClick={handleCancelLesson}
                    startIcon={<MdCancel/>}
                  >
                    Отменить занятие
                  </Button>
                ) : isInGroup ? (
                  <Button
                    variant="contained"
                    color="primary"
                    className="join-lesson-button"
                    onClick={handleFittingSubSelections}
                    startIcon={<MdCheckCircle/>}
                    style={{backgroundColor: '#1a1a1a', color: 'white'}}
                  >
                    Буду участвовать
                  </Button>
                ) : lesson.fitting_subscriptions && lesson.fitting_subscriptions.length > 0 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    className="buy-subscription-button"
                    onClick={() => navigate(`/group/${lesson.group.id}`)}
                    startIcon={<MdGroup/>}
                    style={{backgroundColor: '#1a1a1a', color: 'white'}}
                  >
                    Перейти на страницу группы
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    className="buy-subscription-button"
                    onClick={() => navigate('/subscriptions')}
                    startIcon={<MdPayment/>}
                    style={{backgroundColor: '#1a1a1a', color: 'white'}}
                  >
                    Приобрести абонемент
                  </Button>
                )}
              </div>
            )}
          </div>
        </PageLoader>
      </div>

      <div className="modal-subscription-modal-backdrop" style={{display: showSubscriptionsModal ? 'flex' : 'none'}}>
        <div className="modal-subscription-modal-container">
          <div className="modal-subscription-modal-header">
            <h2 className="modal-subscription-modal-title">Выберите абонемент для записи</h2>
            <button className="modal-subscription-modal-close" onClick={() => setShowSubscriptionsModal(false)}>
              <MdClose/>
            </button>
          </div>
          <div className="modal-subscription-modal-content">
            <div className="modal-subscription-cards-container">
              {lesson.fitting_subscriptions && lesson.fitting_subscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className={`modal-subscription-card ${selectedSubscription?.id === subscription.id ? 'modal-selected' : ''}`}
                  onClick={() => {
                    if (selectedSubscription?.id === subscription.id) {
                      setSelectedSubscription(null);
                    } else {
                      setSelectedSubscription(subscription);
                    }
                  }}
                >
                  <div className="modal-subscription-card-icon">
                    <MdCreditCard/>
                  </div>
                  <div className="modal-subscription-card-content">
                    <h3 className="modal-subscription-card-title">{subscription.subscription_template.name}</h3>
                    <p className="modal-subscription-card-description">{subscription.subscription_template.description}</p>
                    <div className="modal-subscription-card-lessons-left">
                      <span className="modal-lessons-left-label">Осталось занятий:</span>
                      <span className="modal-lessons-left-value">{subscription.lessons_left}</span>
                    </div>
                  </div>
                  <div className="modal-subscription-card-check">
                    {selectedSubscription?.id === subscription.id && <MdCheckCircle/>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-subscription-modal-actions">
            <button
              className="modal-subscription-modal-button modal-subscription-cancel-button"
              onClick={() => {
                setShowSubscriptionsModal(false);
                setSelectedSubscription(null);
              }}
            >
              Отмена
            </button>
            <button
              className="modal-subscription-modal-button modal-subscription-confirm-button"
              onClick={handleSubscriptionConfirm}
              disabled={!selectedSubscription}
            >
              <MdCheck className="modal-button-icon"/>
              Продолжить
            </button>
          </div>
        </div>
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