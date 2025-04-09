import "./SlotSelection.css";
import NavBar from "../../components/navbar/NavBar";
import { useState } from "react";
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ru from 'date-fns/locale/ru';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { MdAccessTime, MdPerson, MdFilterList } from 'react-icons/md';

const SlotSelection = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [filters, setFilters] = useState({
        teacher: 'all'
    });

    const teachers = [
        { id: 1, name: "Анна Петрова" },
        { id: 2, name: "Михаил Иванов" },
        { id: 3, name: "Елена Сидорова" }
    ];

    const slots = [
        {
            id: 1,
            startTime: "10:00",
            endTime: "11:30",
            teacher: "Анна Петрова",
            classroom: "Большой зал"
        },
        {
            id: 2,
            startTime: "12:00",
            endTime: "13:30",
            teacher: "Михаил Иванов",
            classroom: "Малый зал"
        },
        {
            id: 3,
            startTime: "15:00",
            endTime: "16:30",
            teacher: "Елена Сидорова",
            classroom: "Зал для бальных танцев"
        }
    ];

    const handleFilterChange = (event) => {
        setFilters({
            ...filters,
            [event.target.name]: event.target.value
        });
    };

    const handleSlotClick = (slot) => {
        setSelectedSlot(slot.id === selectedSlot?.id ? null : slot);
    };

    const handleSubmitRequest = () => {
        if (selectedSlot) {
            console.log("Отправка заявки на слот:", selectedSlot);
        }
    };

    const filteredSlots = slots.filter(slot => {
        if (filters.teacher !== 'all' && slot.teacher !== filters.teacher) return false;
        return true;
    });

    return (
        <div>
            <NavBar />
            <main className="slot-selection-content">
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
                            startIcon={<MdFilterList />}
                        >
                            Фильтры
                        </Button>
                    </div>

                    <div className="slots-content">
                        <div className="slots-header">
                            <h1>Свободные слоты</h1>
                        </div>

                        <div className="slots-list">
                            {filteredSlots.map((slot) => (
                                <div 
                                    key={slot.id} 
                                    className={`slot-card ${selectedSlot?.id === slot.id ? 'selected' : ''}`}
                                    onClick={() => handleSlotClick(slot)}
                                >
                                    <div className="slot-header">
                                        <h2>Свободный слот</h2>
                                    </div>
                                    <div className="slot-details">
                                        <div className="detail-item">
                                            <MdAccessTime className="detail-icon" />
                                            <span>{slot.startTime} - {slot.endTime}</span>
                                        </div>
                                        <div className="detail-item">
                                            <MdPerson className="detail-icon" />
                                            <span>{slot.teacher}</span>
                                        </div>
                                    </div>
                                    <div className="slot-location">{slot.classroom}</div>
                                </div>
                            ))}
                        </div>

                        <Button
                            variant="contained"
                            className="submit-request-button"
                            disabled={!selectedSlot}
                            onClick={handleSubmitRequest}
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
                                    <MenuItem key={teacher.id} value={teacher.name}>
                                        {teacher.name}
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
            </main>
        </div>
    );
};

export default SlotSelection; 