import "./SlotSelection.css";
import NavBar from "../../components/navbar/NavBar";
import React, {useState, useEffect} from "react";
import {DateCalendar} from '@mui/x-date-pickers/DateCalendar';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import ru from 'date-fns/locale/ru';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
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
import {MdAccessTime, MdPerson, MdFilterList, MdEventBusy, MdPeople} from 'react-icons/md';
import {useLocation, useNavigate} from 'react-router-dom';
import {apiRequest} from "../../util/apiService";
import {formatTimeToHM} from "../../util";
import ConfirmationModal from "../../components/modal/confirm/ConfirmationModal";
import PageLoader from "../../components/PageLoader/PageLoader";

const SlotSelection = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const {selectedLessonType} = location.state || {};

  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [allowNeighbors, setAllowNeighbors] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const [filters, setFilters] = useState({
    teacher: 'all',
    lessonType: selectedLessonType ? selectedLessonType.id : 'all'
  });

  useEffect(() => {
    setSelectedSlot(null);
    const fetchSlots = async () => {
      try {
        const date_from = new Date(selectedDate);
        const date_to = new Date(selectedDate);

        date_from.setUTCHours(0, 0, 0, 0);
        date_to.setUTCHours(23, 59, 59, 999);

        const response = await apiRequest({
          method: 'POST',
          url: `/slots/search/available`,
          data: {
            date_from: date_from.toISOString(),
            date_to: date_to.toISOString(),
            lesson_type_ids: [selectedLessonType.id]
          }
        });

        let count = -1;
        const slots_updated = response.map((slot) => {
          ++count;
          return {...slot, id: count};
        });

        setSlots(slots_updated);

      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }

    fetchSlots();
  }, [selectedDate, selectedLessonType])

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await apiRequest({
          method: 'GET',
          url: '/teachers/full-info',
        });

        setTeachers(response.teachers);
        setLoading(false);

      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }

    fetchTeachers();
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
    setShowModal(true);
    setModalInfo({
      title: 'Подтверждение записи',
      message: 'Вы уверены, что хотите отправить заявку на выбранный слот?',
      confirmText: 'Подтвердить',
      cancelText: 'Отменить',
      onConfirm: () => submitSlot(),
    });
  }

  const submitSlot = async () => {
    setLoading(true);

    const request = {
      name: "Индивидуальное занятие",
      start_time: selectedSlot.start_time,
      finish_time: selectedSlot.finish_time,
      lesson_type_id: selectedLessonType.id,
      teacher_id: selectedSlot.teacher.id,
      are_neighbours_allowed: allowNeighbors
    };

    try {
      const response = await apiRequest({
        method: 'POST',
        url: 'lessons/request',
        data: request
      });

      setLoading(false);
      navigate('/class-register');

    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const filteredSlots = slots.filter(slot => {
    if (filters.teacher !== 'all' && parseInt(filters.teacher) !== slot.teacher.id) {
      return false;
    }
    return true;
  });

  return (
    <div>
      <NavBar/>
      <main className="slot-selection-content">
        <PageLoader loading={loading} text="Загрузка слотов...">
          <div className="slot-selection-container">
            <div className="calendar-section">
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
                className="filter-button"
                onClick={() => setIsFilterDialogOpen(true)}
                startIcon={<MdFilterList/>}
              >
                Фильтры
              </Button>
            </div>

            <div className="slots-content">
              <div className="slots-header">
                <h1>Свободные слоты</h1>
              </div>

              <div className="slots-list">
                {filteredSlots.length > 0 ? (
                  filteredSlots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`slot-card ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
                      onClick={() => handleSlotClick(slot)}
                    >
                      <h2 className="slot-card__title">Свободный слот</h2>
                      <div className="slot-card__info-list">
                        <div className="slot-card__info-item">
                          <div className="slot-card__info-icon">
                            <MdAccessTime/>
                          </div>
                          <span className="slot-card__info-text">
                          {formatTimeToHM(slot.start_time)} - {formatTimeToHM(slot.finish_time)}
                        </span>
                        </div>
                        <div className="slot-card__info-item">
                          <div className="slot-card__info-icon">
                            <MdPerson/>
                          </div>
                          <span className="slot-card__info-text">
                          {`${slot.teacher.user.last_name} ${slot.teacher.user.first_name} ${slot.teacher.user?.middle_name}`}
                        </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-slots">
                    <MdEventBusy className="no-slots-icon"/>
                    <h2 className="no-slots-title">Нет доступных слотов</h2>
                    <p className="no-slots-text">Попробуйте выбрать другую дату или другие параметры фильтра</p>
                  </div>
                )}
              </div>

              {selectedSlot && (
                <div className="neighbors-option">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={allowNeighbors}
                        onChange={handleNeighborsChange}
                        color="default"
                      />
                    }
                    label={
                      <div className="neighbors-label">
                        <span>Разрешить соседей в зале</span>
                        <MdPeople className="neighbors-icon"/>
                      </div>
                    }
                  />
                </div>
              )}

              <Button
                variant="contained"
                className="submit-request-button"
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
            className="filter-dialog"
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
            <DialogActions className="filter-actions">
              <Button
                onClick={() => setIsFilterDialogOpen(false)}
                variant="contained"
                className="apply-filters-button"
              >
                Применить
              </Button>
            </DialogActions>
          </Dialog>
        </PageLoader>
      </main>
      <ConfirmationModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={modalInfo.onConfirm}
        title={modalInfo.title}
        message={modalInfo.message}
        confirmText={modalInfo.confirmText}
        cancelText={modalInfo.cancelText}
      />
    </div>
  );
};

export default SlotSelection; 