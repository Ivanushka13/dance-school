import "./RequestDetails.css";
import NavBar from "../../components/navbar/NavBar";
import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {Button} from "@mui/material";
import {MdAccessTime, MdEmail, MdPhone, MdStyle, MdCalendarToday, MdInfo} from 'react-icons/md';
import {convertDateToUTC, formatDateToDMY, formatTimeToHM} from "../../util";
import ConfirmationModal from "../../components/modal/confirm/ConfirmationModal";
import InformationModal from "../../components/modal/info/InformationModal";
import PageLoader from "../../components/PageLoader/PageLoader";
import {editLessonRequest, getRequest} from "../../api/lessons";
import {getClassrooms} from "../../api/classrooms";

const RequestDetails = () => {

  const navigate = useNavigate();

  const {request_id} = useParams();
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [request, setRequest] = useState({});
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [finishTime, setFinishTime] = useState(null);
  const [classrooms, setClassrooms] = useState([]);
  const [classroomsFetch, setClassroomsFetch] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalInfo, setConfirmModalInfo] = useState({});
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});

  const getInitials = (firstName, lastName) => {
    if (!firstName || !lastName) return "УЧ";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  useEffect(() => {
    getRequest(request_id).then((request_data) => {
      setRequest(request_data);
      setStudent(request_data.actual_students[0]);
      setStartTime(request_data.start_time);
      setFinishTime(request_data.finish_time);
      setClassroomsFetch(true);
    }).catch((error) => {
      setModalInfo({
        title: 'Ошибка во время загрузки заявки',
        message: error.message || String(error)
      });
      setShowInfoModal(true);
      setLoading(false)
    });
  }, [request_id]);

  useEffect(() => {
    if (classroomsFetch) {
      const data = {
        date_from: convertDateToUTC(request.start_time),
        date_to: convertDateToUTC(request.finish_time),
        are_neighbours_allowed: request.are_neighbours_allowed
      }

      getClassrooms(data).then((available_classrooms) => {
        setClassrooms(available_classrooms.classrooms);
        setClassroomsFetch(false);
      }).catch((error) => {
        setModalInfo({
          title: 'Ошибка во время загрузки залов',
          message: error.message || String(error)
        });
        setShowInfoModal(true);
      }).finally(() => setLoading(false));
    }
  }, [classroomsFetch, request]);

  const handleClassroomSelect = (classroom) => {
    setSelectedClassroom(classroom.id === selectedClassroom?.id ? null : classroom);
  };

  const handleAccept = () => {
    setConfirmModalInfo({
      title: 'Подтверждение принятия заявки',
      message: 'Вы уверены, что хотите принять заявку?',
      confirmText: 'Подтвердить',
      cancelText: 'Отменить',
      onConfirm: () => acceptRequest()
    });
    setShowConfirmModal(true);
  }

  const handleReject = () => {
    setConfirmModalInfo({
      title: 'Подтверждение отклонения заявки',
      message: 'Вы уверены, что хотите отклонить заявку?',
      confirmText: 'Подтвердить',
      cancelText: 'Отменить',
      onConfirm: () => rejectRequest()
    });
    setShowConfirmModal(true);
  }

  const acceptRequest = async () => {
    try {
      setShowConfirmModal(false);
      setLoading(true);

      const data = {
        is_confirmed: true,
        classroom_id: selectedClassroom.id
      }

      const response = await editLessonRequest(request.id, data);

      setModalInfo({
        title: "Заявка успешно принята",
        message: '',
        onClose: () => navigate('/requests')
      });
      setShowInfoModal(true);

    } catch (error) {
      setShowConfirmModal(false);
      setModalInfo({
        title: "Ошибка во время принятия заявки",
        message: error.message || String(error)
      });
      setShowInfoModal(true);
    } finally {
      setLoading(false);
    }
  };

  const rejectRequest = async () => {
    try {
      setShowConfirmModal(false);
      setLoading(true);

      const data = {
        is_confirmed: false,
        classroom_id: null
      }
      const response = await editLessonRequest(request.id, data);

      navigate('/requests');

    } catch (error) {
      setShowConfirmModal(false);
      setModalInfo({
        title: "Ошибка во время отклонения заявки",
        message: error.message || String(error)
      });
      setShowInfoModal(true);
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <NavBar/>
        <main className="request-details-content">
          <PageLoader loading={loading} text="Загрузка данных...">
            <div className="request-details-container">
              <div className="request-info-section">
                <h1>Информация о заявке</h1>

                <div className="student-info">
                  <div className="student-section">
                    <div className="student-avatar">
                      {getInitials(
                        student.user?.first_name,
                        student.user?.last_name
                      )}
                    </div>
                    <div className="student-name-level">
                      <h2>{student.user?.last_name} {student.user?.first_name} {student.user?.middle_name || ''}</h2>
                      <div className="level-badge">{student.level?.name}</div>
                    </div>
                  </div>
                  <div className="contact-section">
                    <div className="contact-item">
                      <MdPhone className="contact-icon"/>
                      <span>{student.user?.phone_number}</span>
                    </div>
                    <div className="contact-item">
                      <MdEmail className="contact-icon"/>
                      <span>{student.user?.email}</span>
                    </div>
                  </div>
                </div>

                <div className="request-lesson-info">
                  <h3 className="request-lesson-info-title">Детали занятия</h3>

                  <div className="request-info-row">
                    <div className="request-info-item">
                      <div className="request-info-icon">
                        <MdInfo/>
                      </div>
                      <div className="request-info-content">
                        <span className="request-info-label">Тип занятия</span>
                        <span className="request-info-value">Индивидуальное занятие</span>
                      </div>
                    </div>

                    <div className="request-info-item">
                      <div className="request-info-icon">
                        <MdStyle/>
                      </div>
                      <div className="request-info-content">
                        <span className="request-info-label">Стиль танца</span>
                        <span className="request-info-value">{request.lesson_type?.dance_style.name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="request-info-row">
                    <div className="request-info-item">
                      <div className="request-info-icon">
                        <MdCalendarToday/>
                      </div>
                      <div className="request-info-content">
                        <span className="request-info-label">Дата</span>
                        <span className="request-info-value">{formatDateToDMY(startTime)}</span>
                      </div>
                    </div>

                    <div className="request-info-item">
                      <div className="request-info-icon">
                        <MdAccessTime/>
                      </div>
                      <div className="request-info-content">
                        <span className="request-info-label">Время</span>
                        <span className="request-info-value">
                      {formatTimeToHM(startTime)} — {formatTimeToHM(finishTime)}
                    </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="classrooms-section">
                <h2>Доступные залы</h2>
                {classrooms.length > 0 ? (
                  <div className="classrooms-list">
                    {classrooms.map((classroom) => (
                      <div
                        key={classroom.id}
                        className={`classroom-card ${selectedClassroom?.id === classroom.id ? 'selected' : ''}`}
                        onClick={() => handleClassroomSelect(classroom)}
                      >
                        <div className="classroom-header">
                          <h3>{classroom.name}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-classrooms-container">
                    <div className="no-classrooms-card">
                      <div className="no-classrooms-icon">
                        <MdInfo size={24} />
                      </div>
                      <div className="text-content">
                        <h3>Нет доступных залов</h3>
                        <p>В выбранные учеником дату и время нет свободных залов.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="request-details-action-buttons">
                <Button
                  variant="outlined"
                  color="error"
                  className="request-details-reject-button"
                  onClick={handleReject}
                >
                  Отклонить заявку
                </Button>
                <Button
                  variant="contained"
                  className="request-details-accept-button"
                  disabled={!selectedClassroom || classrooms.length === 0}
                  onClick={handleAccept}
                >
                  Принять заявку
                </Button>
              </div>
            </div>
          </PageLoader>
        </main>
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
        onClose={() => {
          setShowInfoModal(false);
          if (modalInfo.onClose) {
            modalInfo.onClose();
          }
        }}
        title={modalInfo.title}
        message={modalInfo.message}
      />
    </>
  );
};

export default RequestDetails; 