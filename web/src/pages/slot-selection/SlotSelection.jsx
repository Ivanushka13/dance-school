import "./SlotSelection.css";
import NavBar from "../../components/navbar/NavBar";
import React, {useState, useEffect} from "react";
import {DateCalendar} from '@mui/x-date-pickers/DateCalendar';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import ru from 'date-fns/locale/ru';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {MdAccessTime, MdPerson, MdFilterList, MdEventBusy, MdPeople} from 'react-icons/md';
import {useLocation} from 'react-router-dom';
import {formatTimeToHM} from "../../util";
import ConfirmationModal from "../../components/modal/confirm/ConfirmationModal";
import PageLoader from "../../components/PageLoader/PageLoader";
import InformationModal from "../../components/modal/info/InformationModal";
import {getSlots} from "../../api/slots";
import {getTeachers} from "../../api/teachers";
import {postLessonRequest} from "../../api/lessons";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel
} from "@mui/material";

const SlotSelection = () => {

  const location = useLocation();
  const {selectedLessonType} = location.state || {};

  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [allowNeighbors, setAllowNeighbors] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalInfo, setConfirmModalInfo] = useState({});
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});

  const [filters, setFilters] = useState({
    teacher: 'all',
    lessonType: selectedLessonType ? selectedLessonType.id : 'all'
  });

  useEffect(() => {
    setSelectedSlot(null);
    setAllowNeighbors(false);

    const date_from = new Date(selectedDate);
    const date_to = new Date(selectedDate);

    date_from.setUTCHours(0, 0, 0, 0);
    date_to.setUTCHours(23, 59, 59, 999);

    getSlots(
      date_from,
      date_to,
      [selectedLessonType.id]
    ).then((slots) => {
      let count = -1;
      const slots_updated = slots.map((slot) => {
        ++count;
        return {...slot, id: count};
      });
      setSlots(slots_updated);
    }).catch((error) => {
      setModalInfo({
        title: 'Ошибка при загрузке слотов',
        message: error.message || String(error)
      });
      setShowInfoModal(true);
    }).finally(() => setLoading(false));

  }, [selectedDate, selectedLessonType, loading])

  useEffect(() => {
    getTeachers({terminated: false}).then((response) => {
      setTeachers(response.teachers);
    }).catch((error) => {
      setModalInfo({
        title: 'Ошибка при загрузке преподавателей',
        message: error.message || String(error)
      });
      setShowInfoModal(true);
    }).finally(() => setLoading(false));
  }, [])

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value
    });
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot.id === selectedSlot?.id ? null : slot);
  };

  const handleNeighborsChange = (event) => {
    setAllowNeighbors(event.target.checked);
  };

  const handleSubmit = () => {
    setShowConfirmModal(true);
    setConfirmModalInfo({
      title: 'Подтверждение записи',
      message: 'Вы уверены, что хотите отправить заявку на выбранный слот?',
      confirmText: 'Подтвердить',
      cancelText: 'Отменить',
      onConfirm: () => submitSlot(),
    });
  }

  const submitSlot = async () => {
    setLoading(true);
    setShowConfirmModal(false);

    const request = {
      name: "Индивидуальное занятие",
      start_time: selectedSlot.start_time,
      finish_time: selectedSlot.finish_time,
      lesson_type_id: selectedLessonType.id,
      teacher_id: selectedSlot.teacher.id,
      are_neighbours_allowed: allowNeighbors
    };

    postLessonRequest(request).then((response) => {
      setModalInfo({
        title: 'Заявка успешно отправлена',
        message: ''
      });
      setShowInfoModal(true);
    }).catch((error) => {
      setModalInfo({
        title: 'Ошибка при записи в слот',
        message: error.message || String(error)
      });
      setShowInfoModal(true);
    }).finally(() => setLoading(false));
  };

  const filteredSlots = slots.filter(slot => {
    return !(filters.teacher !== 'all' && filters.teacher !== slot.teacher.id);
  });

  return (
    <div>
      <NavBar/>
      <main className="slot-selection-content">
        <PageLoader loading={loading} text="Загрузка слотов...">
          <div className="slot-selection-container">
            <div className="slot-selection-calendar-section">
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                <DateCalendar
                  value={selectedDate}
                  onChange={setSelectedDate}
                  sx={{
                    width: '100%',
                    '& .MuiPickersCalendarHeader-root': {
                      fontSize: '1.1rem',
                      marginTop: '0.5rem',
                      padding: '0 0.5rem',
                    },
                    '& .MuiPickersDay-root': {
                      width: '40px',
                      height: '40px',
                      fontSize: '0.9rem',
                      margin: '0.25rem',
                      borderRadius: '12px',
                      color: '#1a1a1a',
                    },
                    '& .MuiDayCalendar-weekDayLabel': {
                      color: '#1a1a1a',
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      width: '40px',
                      height: '40px',
                      margin: '0.25rem',
                    },
                    '& .Mui-selected': {
                      backgroundColor: '#1a1a1a !important',
                      color: 'white !important',
                    },
                    '& .MuiPickersDay-today': {
                      border: '2px solid #1a1a1a !important',
                      color: '#1a1a1a',
                    }
                  }}
                />
              </LocalizationProvider>
              <Button
                variant="contained"
                className="slot-selection-filter-button"
                onClick={() => setIsFilterDialogOpen(true)}
                startIcon={<MdFilterList/>}
              >
                Фильтры
              </Button>
            </div>

            <div className="slot-selection-slots-content">
              <div className="slot-selection-slots-header">
                <h1>Свободные слоты</h1>
              </div>

              <div className="slot-selection-slots-list">
                {filteredSlots.length > 0 ? (
                  filteredSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`slot-selection-slot-card ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
                      onClick={() => handleSlotClick(slot)}
                    >
                      <h2 className="slot-selection-slot-card__title">Свободный слот</h2>
                      <div className="slot-selection-slot-card__info-list">
                        <div className="slot-selection-slot-card__info-item">
                          <div className="slot-selection-slot-card__info-icon">
                            <MdAccessTime/>
                          </div>
                          <span className="slot-selection-slot-card__info-text">
                          {formatTimeToHM(slot.start_time)} - {formatTimeToHM(slot.finish_time)}
                        </span>
                        </div>
                        <div className="slot-selection-slot-card__info-item">
                          <div className="slot-selection-slot-card__info-icon">
                            <MdPerson/>
                          </div>
                          <span className="slot-selection-slot-card__info-text">
                          {`${slot.teacher.user.last_name} ${slot.teacher.user.first_name} ${slot.teacher.user?.middle_name}`}
                        </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="slot-selection-no-slots">
                    <MdEventBusy className="slot-selection-no-slots-icon"/>
                    <h2 className="slot-selection-no-slots-title">Нет доступных слотов</h2>
                    <p className="slot-selection-no-slots-text">Попробуйте выбрать другую дату или другие параметры фильтра</p>
                  </div>
                )}
              </div>

              {selectedSlot && (
                <div className="slot-selection-neighbors-option">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={allowNeighbors}
                        onChange={handleNeighborsChange}
                        color="default"
                      />
                    }
                    label={
                      <div className="slot-selection-neighbors-label">
                        <span>Разрешить соседей в зале</span>
                        <MdPeople className="slot-selection-neighbors-icon"/>
                      </div>
                    }
                  />
                </div>
              )}

              <Button
                variant="contained"
                className="slot-selection-submit-request-button"
                disabled={!selectedSlot}
                onClick={handleSubmit}
              >
                Подать заявку
              </Button>
            </div>
          </div>

          <Dialog
            open={isFilterDialogOpen}
            onClose={() => setIsFilterDialogOpen(false)}
            className="slot-selection-filter-dialog"
          >
            <DialogTitle>Фильтры</DialogTitle>
            <DialogContent>
              <FormControl fullWidth margin="normal">
                <InputLabel>Преподаватель</InputLabel>
                <Select
                  name="teacher"
                  value={filters.teacher}
                  onChange={handleFilterChange}
                  label="Преподаватель"
                >
                  <MenuItem value="all">Все преподаватели</MenuItem>
                  {teachers.map(teacher => (
                    <MenuItem key={teacher.id} value={teacher.id}>
                      {`${teacher.user.last_name} ${teacher.user.first_name} ${teacher.user?.middle_name || ''}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions className="slot-selection-filter-actions">
              <Button
                onClick={() => setIsFilterDialogOpen(false)}
                variant="contained"
                className="slot-selection-apply-filters-button"
              >
                Применить
              </Button>
            </DialogActions>
          </Dialog>
        </PageLoader>
      </main>
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
    </div>
  );
};

export default SlotSelection; 