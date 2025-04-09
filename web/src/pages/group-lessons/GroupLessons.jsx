import "./GroupLessons.css";
import NavBar from "../../components/navbar/NavBar";
import { useState } from "react";
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import ru from 'date-fns/locale/ru';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format } from "date-fns";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel } from "@mui/material";
import { MdAccessTime, MdPerson, MdFilterList } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const GroupLessons = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
    const [filters, setFilters] = useState({
        teacher: 'all',
        group: 'all',
        level: 'all'
    });

    // Тестовые данные
    const teachers = [
        { id: 1, name: "Анна Петрова" },
        { id: 2, name: "Михаил Иванов" },
        { id: 3, name: "Елена Сидорова" }
    ];

    const groups = [
        { id: 1, name: "Группа 1" },
        { id: 2, name: "Группа 2" },
        { id: 3, name: "Группа 3" }
    ];

    const levels = [
        { id: 'beginner', name: "Начинающий" },
        { id: 'intermediate', name: "Средний" },
        { id: 'advanced', name: "Продвинутый" }
    ];

    const lessons = [
        {
            id: 1,
            name: "Хип-хоп для начинающих",
            startTime: "10:00",
            endTime: "11:30",
            teacher: "Анна Петрова",
            description: "Базовые движения и основы хип-хопа для новичков",
            group: "Группа 1",
            level: "beginner"
        },
        {
            id: 2,
            name: "Контемпорари",
            startTime: "12:00",
            endTime: "13:30",
            teacher: "Михаил Иванов",
            description: "Современная хореография для среднего уровня",
            group: "Группа 2",
            level: "intermediate"
        },
        {
            id: 3,
            name: "Продвинутый джаз",
            startTime: "15:00",
            endTime: "16:30",
            teacher: "Елена Сидорова",
            description: "Сложные связки и импровизация",
            group: "Группа 3",
            level: "advanced"
        }
    ];

    const handleFilterChange = (event) => {
        setFilters({
            ...filters,
            [event.target.name]: event.target.value
        });
    };

    const filteredLessons = lessons.filter(lesson => {
        if (filters.teacher !== 'all' && lesson.teacher !== filters.teacher) return false;
        if (filters.group !== 'all' && lesson.group !== filters.group) return false;
        if (filters.level !== 'all' && lesson.level !== filters.level) return false;
        return true;
    });

    const handleLessonClick = (lessonId) => {
        const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
        navigate(`/group-lesson/${lessonId}?date=${selectedDateStr}`);
    };

    return (
        <div>
            <NavBar />
            <main className="group-lessons-content">
                <div className="group-lessons-container">
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

                    <div className="lessons-content">
                        <div className="lessons-header">
                            <h1>Групповые занятия</h1>
                        </div>

                        <div className="lessons-list">
                            {filteredLessons.map((lesson) => (
                                <div 
                                    key={lesson.id} 
                                    className="lesson-card"
                                    onClick={() => handleLessonClick(lesson.id)}
                                >
                                    <div className="lesson-main">
                                        <div className="lesson-title-section">
                                            <h2>{lesson.name}</h2>
                                            <div className={`level-tag ${lesson.level}`}>
                                                {levels.find(l => l.id === lesson.level)?.name}
                                            </div>
                                        </div>
                                        <p className="lesson-description">{lesson.description}</p>
                                        <div className="lesson-meta">
                                            <div className="meta-item">
                                                <MdAccessTime />
                                                <span>{lesson.startTime} - {lesson.endTime}</span>
                                            </div>
                                            <div className="meta-item">
                                                <MdPerson />
                                                <span>{lesson.teacher}</span>
                                            </div>
                                        </div>
                                        <div className="lesson-group-tag">{lesson.group}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
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

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Группа</InputLabel>
                            <Select
                                name="group"
                                value={filters.group}
                                onChange={handleFilterChange}
                                label="Группа"
                            >
                                <MenuItem value="all">Все группы</MenuItem>
                                {groups.map(group => (
                                    <MenuItem key={group.id} value={group.name}>
                                        {group.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Уровень</InputLabel>
                            <Select
                                name="level"
                                value={filters.level}
                                onChange={handleFilterChange}
                                label="Уровень"
                            >
                                <MenuItem value="all">Все уровни</MenuItem>
                                {levels.map(level => (
                                    <MenuItem key={level.id} value={level.id}>
                                        {level.name}
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

export default GroupLessons; 