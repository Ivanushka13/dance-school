import React, {useState} from 'react';
import {
  Container,
  Typography,
  Box,
  MenuItem,
  TextField,
  Button
} from '@mui/material';
import {TimePicker} from '@mui/x-date-pickers/TimePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {ru} from 'date-fns/locale';
import NavBar from '../../components/navbar/NavBar';
import './CreateSlot.css';
import {apiRequest} from "../../util/apiService";
import {timeToUTC} from "../../util";
import InformationModal from "../../components/modal/info/InformationModal";
import PageLoader from "../../components/PageLoader/PageLoader";

const CreateSlot = () => {

  const [loading, setLoading] = useState(true);
  const [weekDay, setWeekDay] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    title: '',
    message: ''
  });

  const weekDays = [
    {value: 0, label: 'Понедельник'},
    {value: 1, label: 'Вторник'},
    {value: 2, label: 'Среда'},
    {value: 3, label: 'Четверг'},
    {value: 4, label: 'Пятница'},
    {value: 5, label: 'Суббота'},
    {value: 6, label: 'Воскресенье'}
  ];

  const handleSubmit = async () => {
    const request = {
      day_of_week: weekDay,
      start_time: timeToUTC(startTime),
      end_time: timeToUTC(endTime),
    };

    try {
      const response = await apiRequest({
        method: 'POST',
        url: '/slots',
        data: request
      });

      setLoading(false);

      setModalInfo({
        title: 'Слот успешно создан',
        message: '',
      });
      setShowModal(true);

    } catch (error) {
      console.log(error.message);
      setLoading(false);
      setModalInfo({
        title: 'Ошибка во время создания слота',
        message: error.message || String(error),
      });
      setShowModal(true);
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
              <TextField
                select
                fullWidth
                label="День недели"
                value={weekDay}
                onChange={(e) => setWeekDay(e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#1a1a1a'
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#1a1a1a'
                  }
                }}
              >
                {weekDays.map((day) => (
                  <MenuItem key={day.value} value={day.value}>
                    {day.label}
                  </MenuItem>
                ))}
              </TextField>

              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                <Box className="time-section">
                  <TimePicker
                    label="Время начала"
                    value={startTime}
                    onChange={setStartTime}
                    ampm={false}
                    slotProps={{
                      textField: {fullWidth: true},
                      toolbar: {
                        toolbarTitle: 'Выберите время',
                        toolbarFormat: 'HH:mm'
                      },
                      popper: {
                        localeText: {
                          cancelButtonLabel: 'Отмена',
                          clearButtonLabel: 'Очистить',
                          okButtonLabel: 'Ок'
                        }
                      }
                    }}
                  />
                  <TimePicker
                    label="Время окончания"
                    value={endTime}
                    onChange={setEndTime}
                    ampm={false}
                    slotProps={{
                      textField: {fullWidth: true},
                      toolbar: {
                        toolbarTitle: 'Выберите время',
                        toolbarFormat: 'HH:mm'
                      },
                      popper: {
                        localeText: {
                          cancelButtonLabel: 'Отмена',
                          clearButtonLabel: 'Очистить',
                          okButtonLabel: 'Ок'
                        }
                      }
                    }}
                  />
                </Box>
              </LocalizationProvider>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleSubmit}
                className="submit-button"
                sx={{
                  backgroundColor: '#1a1a1a',
                  marginTop: '2rem',
                  height: '48px',
                  '&:hover': {
                    backgroundColor: '#333',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                  }
                }}
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