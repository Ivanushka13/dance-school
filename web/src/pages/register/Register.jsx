import React, { useState } from 'react';
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
    Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { ru } from 'date-fns/locale';
import { MdAccessTime, MdEvent, MdPerson, MdRoom, MdClass, MdClose } from 'react-icons/md';
import NavBar from '../../components/navbar/NavBar';
import './Register.css';

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialog-paper': {
        borderRadius: '12px',
        minWidth: '400px'
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

const AnimatedButton = styled(Button)({
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
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    const [openDialog, setOpenDialog] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedLessonType, setSelectedLessonType] = useState(null);
    const [description, setDescription] = useState('');
    const [allowNeighbors, setAllowNeighbors] = useState(false);

    const handleDialogOpen = (type) => {
        setOpenDialog(type);
    };

    const handleDialogClose = () => {
        setOpenDialog(null);
    };

    const handleSelect = (type, value) => {
        switch (type) {
            case 'room':
                setSelectedRoom(value);
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


    const rooms = [
        { 
            id: 1, 
            name: 'Большой зал',
            capacity: 30,
            features: ['Зеркала', 'Кондиционер', 'Балетный станок']
        },
        { 
            id: 2, 
            name: 'Зал хореографии',
            capacity: 20,
            features: ['Зеркала', 'Кондиционер', 'Деревянный пол']
        },
        { 
            id: 3, 
            name: 'Малый зал',
            capacity: 15,
            features: ['Зеркала', 'Вентиляция']
        },
        { 
            id: 4, 
            name: 'Зал для бальных танцев',
            capacity: 25,
            features: ['Паркет', 'Кондиционер', 'Звукоизоляция']
        },
        { 
            id: 5, 
            name: 'Тренировочный зал',
            capacity: 10,
            features: ['Зеркала', 'Спортивное покрытие']
        }
    ];

    const students = [
        { 
            id: 1, 
            name: 'Иван Иванов',
            level: 'Начинающий',
            age: 25,
            preferredStyle: 'Хип-хоп'
        },
        { 
            id: 2, 
            name: 'Мария Петрова',
            level: 'Продвинутый',
            age: 22,
            preferredStyle: 'Современные танцы'
        },
        { 
            id: 3, 
            name: 'Алексей Смирнов',
            level: 'Средний',
            age: 30,
            preferredStyle: 'Бальные танцы'
        },
        { 
            id: 4, 
            name: 'Анна Сидорова',
            level: 'Продвинутый',
            age: 19,
            preferredStyle: 'Балет'
        },
        { 
            id: 5, 
            name: 'Дмитрий Козлов',
            level: 'Начинающий',
            age: 27,
            preferredStyle: 'Брейк-данс'
        },
        { 
            id: 6, 
            name: 'Екатерина Новикова',
            level: 'Средний',
            age: 24,
            preferredStyle: 'Джаз'
        }
    ];

    const lessonTypes = [
        { 
            id: 1, 
            name: 'Групповое занятие',
            description: 'Занятие для группы до 15 человек',
            duration: 60,
            price: 1000
        },
        { 
            id: 2, 
            name: 'Индивидуальное занятие',
            description: 'Персональное занятие с преподавателем',
            duration: 45,
            price: 2000
        },
        { 
            id: 3, 
            name: 'Парное занятие',
            description: 'Занятие для двух учеников',
            duration: 60,
            price: 1500
        },
        { 
            id: 4, 
            name: 'Мастер-класс',
            description: 'Углубленное изучение определенного стиля',
            duration: 90,
            price: 2500
        },
        { 
            id: 5, 
            name: 'Пробное занятие',
            description: 'Ознакомительное занятие для новичков',
            duration: 45,
            price: 500
        }
    ];

    const handleSubmit = () => {
        console.log({
            startDate,
            endDate,
            startTime,
            endTime,
            room: selectedRoom,
            student: selectedStudent,
            lessonType: selectedLessonType,
            description,
            allowNeighbors
        });
    };

    return (
        <>
            <NavBar />
            <div className="register-wrapper">
                <Container maxWidth="md" className="register-content">
                    <Typography variant="h4" component="h1" gutterBottom>
                        Создание индивидуального занятия
                    </Typography>
                    
                    <Box className="form-section">
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
                                        textField: { fullWidth: true },
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
                                        textField: { fullWidth: true },
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
                                        textField: { fullWidth: true },
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
                                        textField: { fullWidth: true },
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

                        <TextField
                            fullWidth
                            label="Зал"
                            value={selectedRoom ? selectedRoom.name : ''}
                            onClick={() => handleDialogOpen('room')}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" sx={{ marginRight: '8px' }}>
                                        <MdRoom />
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
                                }
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Ученик"
                            value={selectedStudent ? selectedStudent.name : ''}
                            onClick={() => handleDialogOpen('student')}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" sx={{ marginRight: '8px' }}>
                                        <MdPerson />
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
                                }
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Тип занятия"
                            value={selectedLessonType ? selectedLessonType.name : ''}
                            onClick={() => handleDialogOpen('lessonType')}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start" sx={{ marginRight: '8px' }}>
                                        <MdClass />
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
                >
                    <StyledDialogTitle>
                        {openDialog === 'room' && 'Выберите зал'}
                        {openDialog === 'student' && 'Выберите ученика'}
                        {openDialog === 'lessonType' && 'Выберите вид занятия'}
                        <CloseButton onClick={handleDialogClose}>
                            <MdClose />
                        </CloseButton>
                    </StyledDialogTitle>
                    <DialogContent>
                        <List>
                            {openDialog === 'room' && rooms.map((item) => (
                                <StyledListItem
                                    button
                                    key={item.id}
                                    onClick={() => handleSelect('room', item)}
                                >
                                    <ListItemText 
                                        primary={item.name}
                                        secondary={`Вместимость: ${item.capacity} чел. • ${item.features.join(' • ')}`}
                                    />
                                </StyledListItem>
                            ))}
                            {openDialog === 'student' && students.map((item) => (
                                <StyledListItem
                                    button
                                    key={item.id}
                                    onClick={() => handleSelect('student', item)}
                                >
                                    <ListItemText 
                                        primary={item.name}
                                        secondary={`${item.level} • ${item.age} лет • ${item.preferredStyle}`}
                                    />
                                </StyledListItem>
                            ))}
                            {openDialog === 'lessonType' && lessonTypes.map((item) => (
                                <StyledListItem
                                    button
                                    key={item.id}
                                    onClick={() => handleSelect('lessonType', item)}
                                >
                                    <ListItemText 
                                        primary={item.name}
                                        secondary={`${item.duration} мин • ${item.price} ₽ • ${item.description}`}
                                    />
                                </StyledListItem>
                            ))}
                        </List>
                    </DialogContent>
                </StyledDialog>
            </div>
        </>
    );
};

export default Register; 