import React, {useState, useEffect, useCallback} from 'react';
import NavBar from '../../components/navbar/NavBar';
import {useNavigate} from 'react-router-dom';
import {MdArrowBack, MdAccessTime, MdPerson, MdOutlineBookmark, MdDateRange, MdAssignment} from 'react-icons/md';
import './Applications.css';
import {formatDateToDMY, formatTimeToHM} from '../../util';
import PageLoader from "../../components/PageLoader/PageLoader";
import InformationModal from "../../components/modal/info/InformationModal";
import {getApplications} from "../../api/applications";

const Applications = () => {

  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});


  useEffect(() => {
    fetchApplications().then(() => setLoading(false));
  }, []);

  const fetchApplications = useCallback(async () => {
    try {
      const response = await getApplications({is_group: false});

      setApplications(response.lessons);

    } catch (error) {
      setModalInfo({
        title: 'Ошибка при загрузке заявок',
        message: error.message || String(error),
      });
      setShowModal(true);
      setLoading(false);
    }
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  const getStatusLabel = (application) => {
    if (application.is_confirmed) {
      return {label: 'Одобрена', className: 'status-approved'};
    } else if (application.terminated) {
      return {label: 'Отклонена', className: 'status-rejected'};
    } else {
      return {label: 'На рассмотрении', className: 'status-pending'};
    }
  };

  return (
    <>
      <NavBar/>
      <div className="page-wrapper">
        <PageLoader loading={loading} text="Загрузка заявок...">
          <div className="applications-container">
            <div className="applications-header">
              <button className="back-button" onClick={handleGoBack}>
                <MdArrowBack/>
                <span>Назад</span>
              </button>
              <h1>Мои заявки</h1>
            </div>

            <div className="applications-list">
              {applications.length > 0 ? (
                applications.map((application) => {
                  const {label, className} = getStatusLabel(application);
                  return (
                    <div key={application.id} className="application-card">
                      <span className={className}>{label}</span>
                      <div className="application-card-header">
                        <h2>Заявка на индивидуальное занятие</h2>
                      </div>

                      <div className="application-info">
                        <div className="application-info-row">
                          <MdPerson className="time-icon"/>
                          <span className="info-label">Преподаватель:</span>
                          <span className="info-value">
                          {`${application.actual_teachers[0].user.last_name} ${application.actual_teachers[0].user.first_name} ${application.actual_teachers[0].user.middle_name || ''}`}
                        </span>
                        </div>

                        <div className="application-info-row">
                          <MdOutlineBookmark className="time-icon"/>
                          <span className="info-label">Стиль танца:</span>
                          <span className="info-value">{application.lesson_type.dance_style.name}</span>
                        </div>

                        <div className="application-info-row">
                          <MdDateRange className="time-icon"/>
                          <span className="info-label">Дата:</span>
                          <span className="info-value">{formatDateToDMY(application.start_time)}</span>
                        </div>

                        <div className="application-info-row">
                          <MdAccessTime className="time-icon"/>
                          <span className="info-label">Время:</span>
                          <span className="info-value">
                          {`${formatTimeToHM(application.start_time)} - ${formatTimeToHM(application.finish_time)}`}
                        </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="no-applications">
                  <div className="no-applications-icon">
                    <MdAssignment/>
                  </div>
                  <h3>У вас пока нет заявок</h3>
                </div>
              )}
            </div>
          </div>
        </PageLoader>
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

export default Applications; 