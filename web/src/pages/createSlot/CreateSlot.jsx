import React, {useState} from 'react';
import {TimePicker} from '@mui/x-date-pickers/TimePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {ru} from 'date-fns/locale';
import NavBar from '../../components/navbar/NavBar';
import './CreateSlot.css';
import {timeToUTC} from "../../util";
import InformationModal from "../../components/modal/info/InformationModal";
import PageLoader from "../../components/PageLoader/PageLoader";
import {useSelector} from "react-redux";
import {MdError} from 'react-icons/md';
import {
  Container,
  Typography,
  Box,
  MenuItem,
  TextField,
  Button
} from '@mui/material';
import {createSlot} from "../../api/slots";

const CreateSlot = () => {

  const id = useSelector(state => state.session.id);

  const [loading, setLoading] = useState(false);
  const [weekDay, setWeekDay] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const [errors, setErrors] = useState({});

  const weekDays = [
    {value: 0, label: 'Понедельник'},
    {value: 1, label: 'Вторник'},
    {value: 2, label: 'Среда'},
    {value: 3, label: 'Четверг'},
    {value: 4, label: 'Пятница'},
    {value: 5, label: 'Суббота'},
    {value: 6, label: 'Воскресенье'}
  ];

  const handleWeekDayChange = (e) => {
    setWeekDay(e.target.value);
    if (errors.weekDay) {
      setErrors(prev => ({
        ...prev,
        weekDay: ''
      }));
    }
  };

  const handleStartTimeChange = (value) => {
    setStartTime(value);
    if (errors.startTime) {
      setErrors(prev => ({
        ...prev,
        startTime: ''
      }));
    }
  };

  const handleEndTimeChange = (value) => {
    setEndTime(value);
    if (errors.endTime) {
      setErrors(prev => ({
        ...prev,
        endTime: ''
      }));
    }
  };

  const clearForm = () => {
    setWeekDay('');
    setStartTime(null);
    setEndTime(null);
    setErrors({});
  }

  const validateForm = () => {
    const newErrors = {};
    
    if (weekDay === '') {
      newErrors.weekDay = 'Выберите день недели';
    }
    
    if (!startTime) {
      newErrors.startTime = 'Укажите время начала';
    }
    
    if (!endTime) {
      newErrors.endTime = 'Укажите время окончания';
    } else if (startTime && endTime && startTime >= endTime) {
      newErrors.endTime = 'Время окончания должно быть позже времени начала';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    const request = {
      day_of_week: weekDay,
      start_time: timeToUTC(startTime),
      end_time: timeToUTC(endTime),
      teacher_id: id
    };

    try {
      const response = await createSlot(request);

      setModalInfo({
        title: 'Слот успешно создан',
        message: ''
      });
      setShowModal(true);
      
      clearForm();

      setLoading(false);

    } catch (error) {
      setModalInfo({
        title: 'Ошибка во время создания слота',
        message: error.message || String(error),
      });
      setShowModal(true);
      setLoading(false);
    }
  };

  return (
    <>
      <NavBar/>
      <div className="create-slot-wrapper">
        <PageLoader loading={loading} text="Загрузка...">
          <Container maxWidth="md" className="create-slot-content">
            <Typography variant="h4" component="h1" gutterBottom>
              Создание слота
            </Typography>

            <Box className="form-section">
              <div className="form-group">
                <label className="form-label required">День недели</label>
                <TextField
                  select
                  fullWidth
                  value={weekDay}
                  onChange={handleWeekDayChange}
                  className={`form-control ${errors.weekDay ? 'error' : ''}`}
                  InputProps={{
                    className: errors.weekDay ? 'error' : ''
                  }}
                >
                  {weekDays.map((day) => (
                    <MenuItem key={day.value} value={day.value}>
                      {day.label}
                    </MenuItem>
                  ))}
                </TextField>
                {errors.weekDay && (
                  <div className="error-text">
                    <MdError/>
                    <span>{errors.weekDay}</span>
                  </div>
                )}
              </div>

              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                <Box className="time-section">
                  <div className="form-group">
                    <label className="form-label required">Время начала</label>
                    <TimePicker
                      value={startTime}
                      onChange={handleStartTimeChange}
                      ampm={false}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          className: errors.startTime ? 'time-picker-error' : '',
                          InputProps: {
                            className: errors.startTime ? 'error' : ''
                          }
                        },
                        toolbar: {
                          toolbarTitle: 'Выберите время',
                          toolbarFormat: 'ЧЧ:мм'
                        },
                        actionBar: {
                          actions: ['accept'],
                          sx: {
                            display: 'flex',
                            justifyContent: 'center',
                            padding: '8px',
                            color: "black"
                          },
                        },
                      }}
                    />
                    {errors.startTime && (
                      <div className="error-text">
                        <MdError/>
                        <span>{errors.startTime}</span>
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label required">Время окончания</label>
                    <TimePicker
                      value={endTime}
                      onChange={handleEndTimeChange}
                      ampm={false}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          className: errors.endTime ? 'time-picker-error' : '',
                          InputProps: {
                            className: errors.endTime ? 'error' : ''
                          }
                        },
                        toolbar: {
                          toolbarTitle: 'Выберите время',
                          toolbarFormat: 'ЧЧ:мм'
                        },
                        actionBar: {
                          actions: ['accept'],
                          sx: {
                            display: 'flex',
                            justifyContent: 'center',
                            padding: '8px',
                            color: "black"
                          },
                        },
                      }}
                    />
                    {errors.endTime && (
                      <div className="error-text">
                        <MdError/>
                        <span>{errors.endTime}</span>
                      </div>
                    )}
                  </div>
                </Box>
              </LocalizationProvider>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleSubmit}
                className="submit-button"
              >
                Создать слот
              </Button>
            </Box>
          </Container>
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

export default CreateSlot; 