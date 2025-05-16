import React, {useState, useEffect, useCallback} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import NavBar from "../../components/navbar/NavBar";
import './Lesson.css';
import {useDispatch, useSelector} from "react-redux";
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
  MdClose,
  MdCheck,
  MdPerson,
  MdSchool
} from 'react-icons/md';
import {Button} from "@mui/material";
import ConfirmationModal from "../../components/modal/confirm/ConfirmationModal";
import PageLoader from "../../components/PageLoader/PageLoader";
import InformationModal from "../../components/modal/info/InformationModal";
import {getLesson, revokeLesson, signUpForLesson} from "../../api/lessons";
import {fetchUserData} from "../../api/auth";
import {setSession} from "../../redux/slices/sessionSlice";

export const Lesson = () => {

  const dispatch = useDispatch();
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
  const [refreshData, setRefreshData] = useState(0);
  const [isGroupLesson, setIsGroupLesson] = useState(false);

  const setLessonInfo = useCallback((lesson) => {
    setLesson(lesson);
    setStudents(lesson.actual_students);
    setTeachers(lesson.actual_teachers);
    setStartTime(lesson.start_time);
    setFinishTime(lesson.finish_time);
    setIsGroupLesson(lesson.lesson_type.is_group);

    if (role === 'student') {
      setIsParticipating(lesson.actual_students.some(student => student.id === session.id));

      if (lesson.lesson_type.is_group) {
        setIsInGroup(lesson.group.students.some(student => student.id === session.id));
      }
    }

    setLoading(false);

  }, [role, session.id]);

  const fetchLesson = useCallback(async () => {
    try {
      const lesson_response = await getLesson(lesson_id)

      await setLessonInfo(lesson_response);

    } catch (error) {
      setModalInfo({
        title: 'Ошибка при загрузке данных занятия',
        message: error.message || String(error),
      });
      setShowInfoModal(true);
      setLoading(false);
    }
  }, [lesson_id, setLessonInfo, refreshData]);

  useEffect(() => {
    fetchLesson().then();
  }, [fetchLesson]);

  const joinLesson = useCallback(async () => {
    try {
      setLoading(true);
      setShowConfirmModal(false);

      await signUpForLesson(selectedSubscription.id, lesson.id);

      const meResponse = await fetchUserData();
      dispatch(setSession(meResponse));

      setSelectedSubscription(null);
      setRefreshData((prev) => prev + 1);

    } catch (error) {
      setModalInfo({
        title: 'Ошибка при записи на занятие',
        message: error.message || String(error),
      });
      setShowInfoModal(true);
      setLoading(false);
    }
  }, [lesson.id, selectedSubscription, setLessonInfo]);

  const cancelLesson = useCallback(async () => {
    try {
      setLoading(true);
      setShowConfirmModal(false);

      await revokeLesson(lesson.used_subscription.id, lesson.id);

      const meResponse = await fetchUserData();
      dispatch(setSession(meResponse));

      setRefreshData((prev) => prev + 1);

    } catch (error) {
      setModalInfo({
        title: 'Ошибка при отмене занятия',
        message: error.message || String(error),
      });
      setShowInfoModal(true);
      setLoading(false);
    }
  }, [lesson.id, lesson.used_subscription]);

  const handleSubscriptionConfirm = () => {
    if (selectedSubscription) {
      setShowSubscriptionsModal(false);
      setConfirmModalInfo({
        title: 'Подтверждение записи на занятие',
        message: `Вы уверены, что хотите записаться на занятие?`,
        confirmText: 'Подтвердить',
        cancelText: 'Отменить',
        onConfirm: () => joinLesson()
      });
      setShowConfirmModal(true);
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

  const handleFittingSubSelections = () => {
    if (lesson.fitting_subscriptions && lesson.fitting_subscriptions.length > 0) {
      setShowSubscriptionsModal(true);
    }
  }

  const handleNavigate = () => {
    navigate(`/group/${lesson.group_id}`);
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

              {role === 'student' && isParticipating && isGroupLesson && (
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
                    <h2>
                      Информация о группе
                    </h2>
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

            {students?.length > 0 && (
              <div className="lesson-student-section">
                <div className="lesson-teachers-header">
                  <h2>
                    <MdPerson className="section-icon"/>
                    Участники занятия
                  </h2>
                </div>
                <div className="lesson-student-info">
                  {students.map((student) => (
                    <div key={student.id} className="lesson-teacher-item">
                      {student?.photo ? (
                        <img src={student.photo} alt={student.user.first_name}/>
                      ) : (
                        <div className="lesson-avatar-circle">
                          {student.user.first_name.charAt(0)}
                          {student.user.last_name.charAt(0)}
                        </div>
                      )}
                      <div className="lesson-teacher-details">
                        <div className="lesson-teacher-name">
                          {`${student.user.last_name} ${student.user.first_name} ${student.user?.middle_name || ''}`}
                        </div>
                        <div className="lesson-teacher-description">
                          {student.description || `Уровень: ${student.level?.name || "Не указан"}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="lesson-teachers-section">
              <div className="lesson-teachers-header">
                <h2>
                  <MdSchool className="section-icon"/>
                  Преподаватели
                </h2>
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

            {role === 'student' && isGroupLesson && (
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
                    <p
                      className="modal-subscription-card-description">{subscription.subscription_template.description}</p>
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