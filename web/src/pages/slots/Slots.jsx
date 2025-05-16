import React, {useState, useEffect} from 'react';
import NavBar from '../../components/navbar/NavBar';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {MdArrowBack, MdAccessTime, MdCalendarToday, MdSchedule, MdDelete} from 'react-icons/md';
import './Slots.css';
import PageLoader from "../../components/PageLoader/PageLoader";
import InformationModal from "../../components/modal/info/InformationModal";
import {formatTime} from "../../util";
import ConfirmationModal from "../../components/modal/confirm/ConfirmationModal";
import {deleteTeacherSlot, getAllSlots} from "../../api/slots";

const Slots = () => {
  const session = useSelector(state => state.session);
  const navigate = useNavigate();

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalInfo, setConfirmModalInfo] = useState({});

  useEffect(() => {
    fetchSlots();
  }, [session.id]);
  
  const fetchSlots = async () => {
    try {
      setLoading(true);

      const data = {
        teacher_ids: [session.id]
      }

      const response = await getAllSlots(data);
      
      setSlots(response.slots);

    } catch (error) {
      setModalInfo({
        title: 'Ошибка при загрузке слотов',
        message: error.message || String(error),
      });
      setShowInfoModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleDeleteSlot = (slot_id) => {
    setConfirmModalInfo({
      title: 'Подтверждение удаления слота',
      message: `Вы уверены, что хотите удалить слот?`,
      confirmText: 'Подтвердить',
      cancelText: 'Отменить',
      onConfirm: () => deleteSlot(slot_id)
    });
    setShowConfirmModal(true);
  }
  
  const deleteSlot = async (slot_id) => {
    try {
      setLoading(true);
      setShowConfirmModal(false);
      
      await deleteTeacherSlot(slot_id);
      await fetchSlots();

      setModalInfo({
        title: 'Слот успешно удален',
        message: '',
      });
      setShowInfoModal(true);

    } catch (error) {
      setModalInfo({
        title: 'Ошибка при удалении слота',
        message: error.message || String(error),
      });
      setShowInfoModal(true);
    } finally {
      setLoading(false);
    }
  };

  const getDayOfWeek = (dayNumber) => {
    const days = [
      'Понедельник',
      'Вторник',
      'Среда',
      'Четверг',
      'Пятница',
      'Суббота',
      'Воскресенье',
    ];
    return days[dayNumber];
  };

  return (
    <>
      <NavBar />
      <div className="page-wrapper">
        <PageLoader loading={loading} text="Загрузка слотов...">
          <div className="applications-container">
            <div className="applications-header">
              <button className="back-button" onClick={handleGoBack}>
                <MdArrowBack />
                <span>Назад</span>
              </button>
              <h1>Мои слоты</h1>
            </div>

            <div className="slots-list">
              {slots.length > 0 ? (
                slots.map((slot) => (
                  <div key={slot.id} className="slot-card">
                    <button 
                      className="delete-button" 
                      onClick={() => handleDeleteSlot(slot.id)}
                      aria-label="Удалить слот"
                    >
                      <MdDelete />
                    </button>
                    <div className="slot-info">
                      <div className="slot-info-row">
                        <MdCalendarToday className="time-icon" />
                        <span className="info-value">
                          <span className="day-label">{getDayOfWeek(slot.day_of_week)}</span>
                        </span>
                      </div>

                      <div className="slot-info-row">
                        <MdAccessTime className="time-icon" />
                        <span className="info-value">
                          <span className="time-range">{`${formatTime(slot.start_time)} - ${formatTime(slot.end_time)}`}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-slots">
                  <div className="no-slots-icon">
                    <MdSchedule />
                  </div>
                  <h3>У вас пока нет слотов</h3>
                  <p>Свяжитесь с администрацией для добавления слотов в ваше расписание</p>
                </div>
              )}
            </div>
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

export default Slots; 