import React, {useEffect, useState} from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Box,
  Container,
  Typography,
  Divider
} from '@mui/material';
import {styled} from '@mui/material/styles';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {LocalizationProvider, DatePicker, TimePicker} from '@mui/x-date-pickers';
import {ru} from 'date-fns/locale';
import {MdPerson, MdRoom, MdClass, MdClose, MdSearch} from 'react-icons/md';
import NavBar from '../../components/navbar/NavBar';
import './Register.css';
import {apiRequest} from "../../util/apiService";
import {createISODate} from "../../util";
import ConfirmationModal from "../../components/modal/confirm/ConfirmationModal";
import InformationModal from "../../components/modal/info/InformationModal";
import PageLoader from "../../components/PageLoader/PageLoader";

const StyledDialog = styled(Dialog)(({theme}) => ({
  '& .MuiDialog-paper': {
    borderRadius: '12px',
    minWidth: '400px',
    width: '450px',
    maxWidth: '90vw',
    height: '550px',
    maxHeight: '80vh'
  }
}));

const StyledDialogTitle = styled(DialogTitle)({
  margin: 0,
  padding: '24px',
  backgroundColor: '#1a1a1a',
  color: '#fff !important',
  textAlign: 'center',
  fontSize: '20px',
  fontWeight: 500,
  lineHeight: '1.5',
  position: 'relative',
  '& .MuiTypography-root': {
    color: '#fff'
  }
});

const CloseButton = styled(IconButton)({
  position: 'absolute',
  right: '8px',
  top: '8px',
  color: 'white'
});

const StyledListItem = styled(ListItem)({
  transition: 'all 0.3s ease',
  borderRadius: '8px',
  margin: '4px 0',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
    transform: 'translateX(8px)'
  }
});
styled(Button)({
  height: '48px',
  borderRadius: '8px',
  textTransform: 'none',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  backgroundColor: '#1a1a1a',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#333',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
  }
});
const Register = () => {

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [lessonTypes, setLessonTypes] = useState([]);
  const [classes, setClasses] = useState([]);
  const [lessonName, setLessonName] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [openDialog, setOpenDialog] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedLessonType, setSelectedLessonType] = useState(null);
  const [description, setDescription] = useState('');
  const [allowNeighbors, setAllowNeighbors] = useState(false);
  const [showClassroomSelection, setClassroomSelection] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalInfo, setConfirmModalInfo] = useState({});
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const available_classrooms = await apiRequest({
          method: 'POST',
          url: '/classrooms/search/available',
          data: {
            date_from: createISODate(startDate, startTime),
            date_to: createISODate(endDate, endTime),
            are_neighbours_allowed: allowNeighbors
          }
        });

        setClasses(available_classrooms.classrooms);
        setClassroomSelection(true);


      } catch (error) {
        setModalInfo({
          title: "Ошибка во время загрузки залов",
          message: error.message || String(error)
        });
        setShowInfoModal(true);
        setLoading(false);
      }
    }

    if (startDate !== null && endDate !== null && startTime !== null && endTime !== null) {
      fetchClasses();
    } else {
      setClassroomSelection(false);
    }

  }, [startDate, endDate, startTime, endTime, allowNeighbors]);

  useEffect(() => {
    const fetchLessonTypes = async () => {
      try {

        const response = await apiRequest({
          method: 'POST',
          url: '/lessonTypes/search/full-info',
          data: {
            is_group: false,
            terminated: false
          }
        });

        setLessonTypes(response.lesson_types);

      } catch (error) {
        setModalInfo({
          title: "Ошибка во время загрузки типов занятий",
          message: error.message || String(error)
        });
        setShowInfoModal(true);
        setLoading(false);
      }
    };

    fetchLessonTypes();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await apiRequest({
          method: 'POST',
          url: '/students/search/full-info',
          data: {terminated: false}
        });

        setStudents(response.students);
        setLoading(true);

      } catch (error) {
        setModalInfo({
          title: "Ошибка во время загрузки учеников",
          message: error.message || String(error)
        });
        setShowInfoModal(true);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleDialogOpen = (type) => {
    setOpenDialog(type);
    setSearchQuery('');
  };

  const handleDialogClose = () => {
    setOpenDialog(null);
  };

  const handleSelect = (type, value) => {
    switch (type) {
      case 'room':
        setSelectedClass(value);
        break;
      case 'student':
        setSelectedStudent(value);
        break;
      case 'lessonType':
        setSelectedLessonType(value);
        break;
      default:
        break;
    }
    handleDialogClose();
  };

  const handleSubmit = () => {
    setConfirmModalInfo({
      title: 'Подтверждение создания занятия',
      message: 'Вы уверены, что хотите создать занятие?',
      confirmText: 'Подтвердить',
      cancelText: 'Отменить',
      onConfirm: () => createLesson()
    });
    setShowConfirmModal(true);
  }

  const createLesson = async () => {
    setLoading(true);

    const request = {
      name: lessonName,
      description: description,
      lesson_type_id: selectedLessonType.id,
      start_time: createISODate(startDate, startTime),
      finish_time: createISODate(endDate, endTime),
      classroom_id: selectedClass.id,
      student_id: selectedStudent.id,
      are_neighbours_allowed: allowNeighbors
    };

    try {
      const response = await apiRequest({
        method: 'POST',
        url: '/lessons/individual',
        data: request
      });

      setShowConfirmModal(false);
      setLoading(false);

      setModalInfo({
        title: "Занятие успешно создано",
        message: ""
      });
      setShowInfoModal(true);

      console.log(response);

    } catch (error) {
      setShowConfirmModal(false);
      setModalInfo({
        title: "Ошибка во время создания занятия",
        message: error.message || String(error)
      });
      setShowInfoModal(true);
      setLoading(false);
    }
  };

  const filterItems = (items, query) => {
    if (!query) return items;

    query = query.toLowerCase();

    switch (openDialog) {
      case 'room':
        return items.filter(item => item.name.toLowerCase().includes(query));
      case 'student':
        return items.filter(student =>
          `${student.user.first_name} ${student.user.last_name} ${student.user?.middle_name || ''}`
            .toLowerCase()
            .includes(query)
        );
      case 'lessonType':
        return items.filter(type =>
          type.dance_style.name.toLowerCase().includes(query) ||
          (type.dance_style.description && type.dance_style.description.toLowerCase().includes(query))
        );
      default:
        return items;
    }
  };

  return (
    <>
      <NavBar/>
      <div className="register-wrapper">
        <PageLoader loading={loading} text="Загрузка...">
          <Container maxWidth="md" className="register-content">
            <Typography variant="h4" component="h1" gutterBottom>
              Создание индивидуального занятия
            </Typography>

            <Box className="form-section">
              <TextField
                fullWidth
                label="Название занятия"
                value={lessonName}
                onChange={(e) => setLessonName(e.target.value)}
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
              />

              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={ru}
              >
                <Box className="date-time-section">
                  <DatePicker
                    label="Дата начала"
                    value={startDate}
                    onChange={setStartDate}
                    dayOfWeekFormatter={(day) => `${day}`}
                    slotProps={{
                      textField: {fullWidth: true},
                      toolbar: {
                        toolbarTitle: 'Выберите дату',
                        toolbarFormat: 'dd MMMM yyyy',
                      },
                      popper: {
                        localeText: {
                          cancelButtonLabel: 'Отмена',
                          clearButtonLabel: 'Очистить',
                          okButtonLabel: 'Ок',
                          todayButtonLabel: 'Сегодня'
                        }
                      }
                    }}
                  />
                  <DatePicker
                    label="Дата окончания"
                    value={endDate}
                    onChange={setEndDate}
                    dayOfWeekFormatter={(day) => `${day}`}
                    slotProps={{
                      textField: {fullWidth: true},
                      toolbar: {
                        toolbarTitle: 'Выберите дату',
                        toolbarFormat: 'dd MMMM yyyy',
                      },
                      popper: {
                        localeText: {
                          cancelButtonLabel: 'Отмена',
                          clearButtonLabel: 'Очистить',
                          okButtonLabel: 'Ок',
                          todayButtonLabel: 'Сегодня'
                        }
                      }
                    }}
                  />
                </Box>

                <Box className="date-time-section">
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

              {showClassroomSelection &&
                <>
                  <TextField
                    fullWidth
                    label="Зал"
                    value={selectedClass ? selectedClass.name : ''}
                    placeholder="Выберите зал"
                    onClick={() => handleDialogOpen('room')}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{marginRight: '8px'}}>
                          <MdRoom/>
                        </InputAdornment>
                      ),
                      readOnly: true,
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: '#1a1a1a'
                        }
                      },
                      '& .MuiInputLabel-root.Mui-focused': {
                        color: '#1a1a1a'
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: 'rgba(0, 0, 0, 0.6)',
                        opacity: 1
                      }
                    }}
                  />
                </>
              }

              <TextField
                fullWidth
                label="Ученик"
                value={
                  selectedStudent ?
                    `${selectedStudent.user.last_name} ${selectedStudent.user.first_name} ${selectedStudent.user?.middle_name || ''}`
                    : ''
                }
                placeholder="Выберите ученика"
                onClick={() => handleDialogOpen('student')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{marginRight: '8px'}}>
                      <MdPerson/>
                    </InputAdornment>
                  ),
                  readOnly: true,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#1a1a1a'
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#1a1a1a'
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(0, 0, 0, 0.6)',
                    opacity: 1
                  }
                }}
              />

              <TextField
                fullWidth
                label="Стиль танца"
                value={selectedLessonType ? selectedLessonType.dance_style.name : ''}
                placeholder="Выберите стиль танца"
                onClick={() => handleDialogOpen('lessonType')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{marginRight: '8px'}}>
                      <MdClass/>
                    </InputAdornment>
                  ),
                  readOnly: true,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#1a1a1a'
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#1a1a1a'
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(0, 0, 0, 0.6)',
                    opacity: 1
                  }
                }}
              />

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Описание"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={allowNeighbors}
                    onChange={(e) => setAllowNeighbors(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#1a1a1a',
                        '&:hover': {
                          backgroundColor: 'rgba(26, 26, 26, 0.04)'
                        }
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#1a1a1a'
                      }
                    }}
                  />
                }
                label="Разрешить соседние занятия"
              />

              <Button
                variant="contained"
                fullWidth
                size="large"
                className="submit-button"
                onClick={handleSubmit}
                sx={{
                  backgroundColor: '#1a1a1a',
                  '&:hover': {
                    backgroundColor: '#333'
                  }
                }}
              >
                Создать занятие
              </Button>
            </Box>
          </Container>

          <StyledDialog
            open={Boolean(openDialog)}
            onClose={handleDialogClose}
            PaperProps={{
              style: {
                overflowY: 'auto'
              }
            }}
          >
            <StyledDialogTitle>
              {openDialog === 'room' && 'Выберите зал'}
              {openDialog === 'student' && 'Выберите ученика'}
              {openDialog === 'lessonType' && 'Выберите вид занятия'}
              <CloseButton onClick={handleDialogClose}>
                <MdClose/>
              </CloseButton>
            </StyledDialogTitle>
            <DialogContent sx={{
              padding: '16px 24px',
              height: 'calc(100% - 80px)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <TextField
                fullWidth
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MdSearch style={{color: '#666', fontSize: '20px'}}/>
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: '#f5f5f5',
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: '#f0f0f0'
                    },
                    padding: '2px 8px',
                    height: '40px'
                  }
                }}
                variant="outlined"
                size="small"
                sx={{
                  mb: 1,
                  mt: 1,
                  flexShrink: 0,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'transparent'
                    },
                    '&:hover fieldset': {
                      borderColor: 'transparent'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1a1a1a',
                      borderWidth: '1px'
                    }
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#1a1a1a'
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: '#666',
                    opacity: 1
                  },
                  '& .MuiInputBase-input': {
                    padding: '8px 4px'
                  }
                }}
              />
              <Divider sx={{mb: 1, flexShrink: 0}}/>
              <Box sx={{
                flexGrow: 1,
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <List sx={{flexGrow: 1}}>
                  {openDialog === 'room' && filterItems(classes, searchQuery).map((item) => (
                    <StyledListItem
                      button
                      key={item.id}
                      onClick={() => handleSelect('room', item)}
                    >
                      <ListItemText
                        primary={item.name}
                      />
                    </StyledListItem>
                  ))}
                  {openDialog === 'student' && filterItems(students, searchQuery).map((student) => (
                    <StyledListItem
                      button
                      key={student.id}
                      onClick={() => handleSelect('student', student)}
                    >
                      <ListItemText
                        primary={`${student.user.first_name} ${student.user.last_name} ${student.user?.middle_name || ''}`}
                        secondary={`${student.level.name}`}
                      />
                    </StyledListItem>
                  ))}
                  {openDialog === 'lessonType' && filterItems(lessonTypes, searchQuery).map((type) => (
                    <StyledListItem
                      button
                      key={type.id}
                      onClick={() => handleSelect('lessonType', type)}
                    >
                      <ListItemText
                        primary={type.dance_style.name}
                        secondary={`${type.dance_style.description}`}
                      />
                    </StyledListItem>
                  ))}
                </List>
              </Box>
            </DialogContent>
          </StyledDialog>
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

export default Register;