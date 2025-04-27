import "./RequestDetails.css";
import NavBar from "../../components/navbar/NavBar";
import React, {useState, useEffect} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {Button} from "@mui/material";
import {MdAccessTime, MdEmail, MdPhone, MdStyle, MdCalendarToday, MdInfo} from 'react-icons/md';
import {apiRequest} from "../../util/apiService";
import {convertDateToUTC, formatDateToDMY, formatTimeToHM} from "../../util";
import ConfirmationModal from "../../components/modal/confirm/ConfirmationModal";
import InformationModal from "../../components/modal/info/InformationModal";
import PageLoader from "../../components/PageLoader/PageLoader";

const RequestDetails = () => {

  const navigate = useNavigate();

  const {request_id} = useParams();
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [request, setRequest] = useState({});
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState({});
  const [classrooms, setClassrooms] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [finishTime, setFinishTime] = useState(null);
  const [classroomsFetch, setClassroomsFetch] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [confirmModalInfo, setConfirmModalInfo] = useState({});
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    title: '',
    message: ''
  });

  const getInitials = (firstName, lastName) => {
    if (!firstName || !lastName) return "УЧ";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  useEffect(() => {
    const fetchRequestData = async () => {
      try {
        const response = await apiRequest({
          method: 'GET',
          url: `/lessons/full-info/${request_id}`
        });

        setRequest(response);
        setStartTime(response.start_time);
        setFinishTime(response.finish_time);
        setStudent(response.actual_students[0]);
        setClassroomsFetch(true);

      } catch (error) {
        setModalInfo({
          title: "Ошибка во время загрузки данных заявки",
          message: error.message || String(error)
        });
        setShowInfoModal(true);
        setLoading(false);
      }
    }

    fetchRequestData();
  }, [request_id]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const available_classrooms = await apiRequest({
          method: 'POST',
          url: '/classrooms/search/available',
          data: {
            date_from: convertDateToUTC(startTime),
            date_to: convertDateToUTC(finishTime),
            are_neighbours_allowed: request.are_neighbours_allowed
          }
        });

        setClassrooms(available_classrooms.classrooms);
        setClassroomsFetch(false);
        setLoading(false);

      } catch (error) {
        setModalInfo({
          title: "Ошибка во время загрузки залов",
          message: error.message || String(error)
        });
        setShowInfoModal(true);
        setLoading(false);
      }
    }

    if (classroomsFetch) {
      fetchClasses();
    }
  }, [startTime, finishTime, classroomsFetch, request]);

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
    setShowModal(true);
  }

  const handleReject = () => {
    setConfirmModalInfo({
      title: 'Подтверждение отклонения заявки',
      message: 'Вы уверены, что хотите отклонить заявку?',
      confirmText: 'Подтвердить',
      cancelText: 'Отменить',
      onConfirm: () => rejectRequest()
    });
    setShowModal(true);
  }

  const acceptRequest = async () => {
    try {
      setLoading(true);

      const response = await apiRequest({
        method: 'PATCH',
        url: `/lessons/request/${request.id}`,
        data: {
          is_confirmed: true,
          classroom_id: selectedClassroom.id
        }
      });

      setLoading(false);
      navigate('/requests');

    } catch (error) {
      setShowModal(false);
      setModalInfo({
        title: "Ошибка во время принятия заявки",
        message: error.message || String(error)
      });
      setShowInfoModal(true);
      setLoading(false);
    }
  };

  const rejectRequest = async () => {
    try {
      setLoading(true);

      const response = await apiRequest({
        method: 'PATCH',
        url: `/lessons/request/${request.id}`,
        data: {
          is_confirmed: false,
          classroom_id: null
        }
      });

      setLoading(false);
      navigate('/requests');

    } catch (error) {
      setShowModal(false);
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
                        student.user.first_name,
                        student.user.last_name
                      )}
                    </div>
                    <div className="student-name-level">
                      <h2>{student.user.last_name} {student.user.first_name} {student.user?.middle_name || ''}</h2>
                      <div className="level-badge">{student.level.name}</div>
                    </div>
                  </div>
                  <div className="contact-section">
                    <div className="contact-item">
                      <MdPhone className="contact-icon"/>
                      <span>{student.user.phone_number}</span>
                    </div>
                    <div className="contact-item">
                      <MdEmail className="contact-icon"/>
                      <span>{student.user.email}</span>
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
                        <span className="request-info-value">{request.lesson_type.dance_style.name}</span>
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
                        <span className="request-info-value">{formatDateToDMY(request.start_time)}</span>
                      </div>
                    </div>

                    <div className="request-info-item">
                      <div className="request-info-icon">
                        <MdAccessTime/>
                      </div>
                      <div className="request-info-content">
                        <span className="request-info-label">Время</span>
                        <span className="request-info-value">
                      {formatTimeToHM(request.start_time)} — {formatTimeToHM(request.finish_time)}
                    </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="classrooms-section">
                <h2>Доступные залы</h2>
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
                  disabled={!selectedClassroom}
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
        visible={showModal}
        onClose={() => setShowModal(false)}
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

export default RequestDetails; 