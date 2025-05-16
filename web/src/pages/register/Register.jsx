import React, {useCallback, useEffect, useState} from 'react';
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
import {MdPerson, MdRoom, MdClass, MdClose, MdSearch, MdError, MdInfoOutline} from 'react-icons/md';
import NavBar from '../../components/navbar/NavBar';
import './Register.css';
import {createISODate} from "../../util";
import ConfirmationModal from "../../components/modal/confirm/ConfirmationModal";
import InformationModal from "../../components/modal/info/InformationModal";
import PageLoader from "../../components/PageLoader/PageLoader";
import {useNavigate} from "react-router-dom";
import {getLessonTypes} from "../../api/lessonTypes";
import {getStudents} from "../../api/students";
import {getClassrooms} from "../../api/classrooms";
import {postLesson} from "../../api/lessons";

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
  color: 'white',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: 'translateY(-2px)'
  }
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

  const navigate = useNavigate();

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
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalInfo, setConfirmModalInfo] = useState({});
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const [errors, setErrors] = useState({});

  const fetchClassrooms = useCallback(async () => {
    const data = {
      date_from: createISODate(startDate, startTime),
      date_to: createISODate(endDate, endTime),
      are_neighbours_allowed: allowNeighbors
    }

    getClassrooms(data).then((response) => {
      setClasses(response.classrooms);
    }).catch((error) => {
      setModalInfo({
        title: "Ошибка во время загрузки залов",
        message: error.message || String(error)
      });
      setShowInfoModal(true);
      setLoading(false);
    });
  }, [allowNeighbors, endDate, endTime, startDate, startTime]);

  const fetchLessonTypes = useCallback(async () => {
    try {
      const data = {
        is_group: false,
        terminated: false
      }

      const response = await getLessonTypes(data);

      setLessonTypes(response.lesson_types);

    } catch (error) {
      setModalInfo({
        title: "Ошибка во время загрузки типов занятий",
        message: error.message || String(error)
      });
      setShowInfoModal(true);
      setLoading(false);
    }
  }, [])

  const fetchStudents = useCallback(async () => {
    try {
      const response = await getStudents({terminated: false});

      setStudents(response.students);

    } catch (error) {
      setModalInfo({
        title: "Ошибка во время загрузки учеников",
        message: error.message || String(error)
      });
      setShowInfoModal(true);
      setLoading(false);
    }
  }, [])

  useEffect(() => {
    if (startDate !== null && endDate !== null && startTime !== null && endTime !== null) {
      fetchClassrooms().then();
    }
  }, [fetchClassrooms]);

  useEffect(() => {
    fetchLessonTypes().then();
  }, [fetchLessonTypes]);

  useEffect(() => {
    fetchStudents().then(() => setLoading(false));
  }, [fetchStudents]);

  const handleLessonNameChange = (e) => {
    setLessonName(e.target.value);
    if (errors.lessonName) {
      setErrors(prev => ({...prev, lessonName: ''}));
    }
  };

  const handleStartDateChange = (value) => {
    setStartDate(value);
    setSelectedClass(null);
    if (errors.startDate) {
      setErrors(prev => ({...prev, startDate: ''}));
    }
  };

  const handleEndDateChange = (value) => {
    setEndDate(value);
    setSelectedClass(null);
    if (errors.endDate) {
      setErrors(prev => ({...prev, endDate: ''}));
    }
  };

  const handleStartTimeChange = (value) => {
    setStartTime(value);
    setSelectedClass(null);
    if (errors.startTime) {
      setErrors(prev => ({...prev, startTime: ''}));
    }
  };

  const handleEndTimeChange = (value) => {
    setEndTime(value);
    setSelectedClass(null);
    if (errors.endTime) {
      setErrors(prev => ({...prev, endTime: ''}));
    }
  };

  const handleDialogOpen = (type) => {
    setOpenDialog(type);
    setSearchQuery('');
  };

  const handleDialogClose = () => {
    setOpenDialog(null);
  };

  const clearForm = () => {
    setLessonName('');
    setStartDate(null);
    setEndDate(null);
    setStartTime(null);
    setEndTime(null);
    setSelectedClass(null);
    setSelectedStudent(null);
    setSelectedLessonType(null);
    setDescription('');
    setAllowNeighbors(false);
  }

  const handleSelect = (type, value) => {
    switch (type) {
      case 'room':
        setSelectedClass(value);
        if (errors.selectedClass) {
          setErrors(prev => ({...prev, selectedClass: ''}));
        }
        break;
      case 'student':
        setSelectedStudent(value);
        if (errors.selectedStudent) {
          setErrors(prev => ({...prev, selectedStudent: ''}));
        }
        break;
      case 'lessonType':
        setSelectedLessonType(value);
        if (errors.selectedLessonType) {
          setErrors(prev => ({...prev, selectedLessonType: ''}));
        }
        break;
      default:
        break;
    }
    handleDialogClose();
  };

  const validateForm = () => {
    const newErrors = {};

    if (!lessonName.trim()) {
      newErrors.lessonName = 'Введите название занятия';
    }

    if (!startDate) {
      newErrors.startDate = 'Выберите дату начала';
    }

    if (!endDate) {
      newErrors.endDate = 'Выберите дату окончания';
    } else if (startDate && endDate && startDate > endDate) {
      newErrors.endDate = 'Дата окончания должна быть позже даты начала';
    }

    if (!startTime) {
      newErrors.startTime = 'Выберите время начала';
    }

    if (!endTime) {
      newErrors.endTime = 'Выберите время окончания';
    } else if (
      startTime &&
      endTime &&
      startDate &&
      endDate &&
      startDate.getTime() === endDate.getTime() &&
      startTime >= endTime
    ) {
      newErrors.endTime = 'Время окончания должно быть позже времени начала';
    }

    if (!selectedClass) {
      newErrors.selectedClass = 'Выберите зал';
    }

    if (!selectedStudent) {
      newErrors.selectedStudent = 'Выберите ученика';
    }

    if (!selectedLessonType) {
      newErrors.selectedLessonType = 'Выберите стиль танца';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

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
    setShowConfirmModal(false);
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
      const response = await postLesson(request);

      setModalInfo({
        title: "Занятие успешно создано",
        message: ""
      });
      setShowInfoModal(true);

      clearForm();

    } catch (error) {
      setShowConfirmModal(false);
      setModalInfo({
        title: "Ошибка во время создания занятия",
        message: error.message || String(error)
      });
      setShowInfoModal(true);
      setLoading(false);
    } finally {
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
              <div className="form-group">
                <label className="form-label required">Название занятия</label>
                <TextField
                  fullWidth
                  value={lessonName}
                  placeholder='Введите название занятия'
                  onChange={handleLessonNameChange}
                  className={`form-control ${errors.lessonName ? 'error' : ''}`}
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
                {errors.lessonName && (
                  <div className="error-text">
                    <MdError/>
                    <span>{errors.lessonName}</span>
                  </div>
                )}
              </div>

              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={ru}
              >
                <Box className="date-time-section">
                  <div className="form-group">
                    <label className="form-label required">Дата начала</label>
                    <DatePicker
                      value={startDate}
                      onChange={handleStartDateChange}
                      dayOfWeekFormatter={(day) => `${day}`}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          className: errors.startDate ? 'time-picker-error' : ''
                        },
                        toolbar: {
                          toolbarTitle: 'Выберите дату',
                          toolbarFormat: 'dd MMMM yyyy',
                        },
                        popper: {
                          localetext: {
                            cancelButtonLabel: 'Отмена',
                            clearButtonLabel: 'Очистить',
                            okButtonLabel: 'Ок',
                            todayButtonLabel: 'Сегодня'
                          }
                        }
                      }}
                    />
                    {errors.startDate && (
                      <div className="error-text">
                        <MdError/>
                        <span>{errors.startDate}</span>
                      </div>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label required">Дата окончания</label>
                    <DatePicker
                      value={endDate}
                      onChange={handleEndDateChange}
                      dayOfWeekFormatter={(day) => `${day}`}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          className: errors.endDate ? 'time-picker-error' : ''
                        },
                        toolbar: {
                          toolbarTitle: 'Выберите дату',
                          toolbarFormat: 'dd MMMM yyyy',
                        },
                        popper: {
                          localetext: {
                            cancelButtonLabel: 'Отмена',
                            clearButtonLabel: 'Очистить',
                            okButtonLabel: 'Ок',
                            todayButtonLabel: 'Сегодня'
                          }
                        }
                      }}
                    />
                    {errors.endDate && (
                      <div className="error-text">
                        <MdError/>
                        <span>{errors.endDate}</span>
                      </div>
                    )}
                  </div>
                </Box>

                <Box className="date-time-section">
                  <div className="form-group">
                    <label className="form-label required">Время начала</label>
                    <TimePicker
                      value={startTime}
                      onChange={handleStartTimeChange}
                      ampm={false}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          className: errors.startTime ? 'time-picker-error' : ''
                        },
                        toolbar: {
                          toolbarTitle: 'Выберите время',
                          toolbarFormat: 'HH:mm'
                        },
                        popper: {
                          localetext: {
                            cancelButtonLabel: 'Отмена',
                            clearButtonLabel: 'Очистить',
                            okButtonLabel: 'Ок'
                          }
                        }
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
                          className: errors.endTime ? 'time-picker-error' : ''
                        },
                        toolbar: {
                          toolbarTitle: 'Выберите время',
                          toolbarFormat: 'HH:mm'
                        },
                        popper: {
                          localetext: {
                            cancelButtonLabel: 'Отмена',
                            clearButtonLabel: 'Очистить',
                            okButtonLabel: 'Ок'
                          }
                        }
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

              <div className="form-group">
                <label className="form-label required">Зал</label>
                <TextField
                  fullWidth
                  value={selectedClass ? selectedClass.name : ''}
                  placeholder="Выберите зал"
                  onClick={() => handleDialogOpen('room')}
                  className={`form-control ${errors.selectedClass ? 'error' : ''}`}
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
                {errors.selectedClass && (
                  <div className="error-text">
                    <MdError/>
                    <span>{errors.selectedClass}</span>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label required">Ученик</label>
                <TextField
                  fullWidth
                  value={
                    selectedStudent ?
                      `${selectedStudent.user.last_name} ${selectedStudent.user.first_name} ${selectedStudent.user?.middle_name || ''}`
                      : ''
                  }
                  placeholder="Выберите ученика"
                  onClick={() => handleDialogOpen('student')}
                  className={`form-control ${errors.selectedStudent ? 'error' : ''}`}
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
                {errors.selectedStudent && (
                  <div className="error-text">
                    <MdError/>
                    <span>{errors.selectedStudent}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label required">Стиль танца</label>
                <TextField
                  fullWidth
                  value={selectedLessonType ? selectedLessonType.dance_style.name : ''}
                  placeholder="Выберите стиль танца"
                  onClick={() => handleDialogOpen('lessonType')}
                  className={`form-control ${errors.selectedLessonType ? 'error' : ''}`}
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
                {errors.selectedLessonType && (
                  <div className="error-text">
                    <MdError/>
                    <span>{errors.selectedLessonType}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Описание</label>
                <TextField
                  fullWidth
                  multiline
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
              </div>

              <FormControlLabel
                control={
                  <Switch
                    checked={allowNeighbors}
                    onChange={async (e) => {
                      setAllowNeighbors(e.target.checked);
                      setSelectedClass(null);
                    }}
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
                  {openDialog === 'room' && filterItems(classes, searchQuery).length > 0 ? (
                    filterItems(classes, searchQuery).map((item) => (
                      <StyledListItem
                        button
                        key={item.id}
                        onClick={() => handleSelect('room', item)}
                      >
                        <ListItemText
                          primary={item.name}
                        />
                      </StyledListItem>
                    ))
                  ) : openDialog === 'room' && (
                    <Box sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '100%',
                      textAlign: 'center',
                      padding: '2rem',
                      color: '#666'
                    }}>
                      <MdInfoOutline style={{
                        fontSize: '48px',
                        marginBottom: '16px',
                        color: '#999',
                      }}/>
                      <Typography sx={{
                        fontWeight: 500,
                        fontSize: '1rem',
                        backgroundColor: '#f5f5f5',
                        padding: '12px 20px',
                        borderRadius: '8px',
                        maxWidth: '300px'
                      }}>
                        В выбранные дату и время нет доступных залов.
                      </Typography>
                    </Box>
                  )}
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