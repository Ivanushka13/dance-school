import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    MenuItem,
    TextField,
    Button
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import NavBar from '../../components/navbar/NavBar';
import './CreateSlot.css';

const CreateSlot = () => {
    const [weekDay, setWeekDay] = useState('');
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    const weekDays = [
        { value: 'monday', label: 'Понедельник' },
        { value: 'tuesday', label: 'Вторник' },
        { value: 'wednesday', label: 'Среда' },
        { value: 'thursday', label: 'Четверг' },
        { value: 'friday', label: 'Пятница' },
        { value: 'saturday', label: 'Суббота' },
        { value: 'sunday', label: 'Воскресенье' }
    ];

    const handleSubmit = () => {
        console.log({
            weekDay,
            startTime,
            endTime
        });
    };

    return (
        <>
            <NavBar />
            <div className="create-slot-wrapper">
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
            </div>
        </>
    );
};

export default CreateSlot; 