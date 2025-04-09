import "./SchedulePage.css"
import NavBar from "../../components/navbar/NavBar";
import "react-day-picker/style.css";
import {DateCalendar} from '@mui/x-date-pickers/DateCalendar';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import ru from 'date-fns/locale/ru';
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LessonListItem} from "../../components/LessonListItem/LessonListItem";
import {useEffect, useState} from "react";
import {filterLessonsByDate} from "../../util";
import {format, isAfter, parseISO} from "date-fns";
import {MdEvent, MdFilterList} from 'react-icons/md';
import { ToggleButton, ToggleButtonGroup, Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const SchedulePage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [markedDates, setMarkedDates] = useState({});
    const [scheduleMode, setScheduleMode] = useState('personal');
    const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
    const [filters, setFilters] = useState({
        teacher: 'all',
        level: 'all'
    });

    const teachers = [
        { id: 1, name: "Анна Петрова" },
        { id: 2, name: "Михаил Иванов" },
        { id: 3, name: "Елена Сидорова" }
    ];

    const levels = [
        { id: 'beginner', name: "Начинающий" },
        { id: 'intermediate', name: "Средний" },
        { id: 'advanced', name: "Продвинутый" }
    ];

    const lessons = [
        {
            name: "Основы хип-хопа",
            description: "Первое занятие по основам хип-хопа.",
            lessonType: "Individual",
            startTime: "2025-04-09T17:00:00.000Z",
            finishTime: "2025-04-09T18:00:00.000Z",
            classroomId: "3b2f8d1a-5e87-4e3a-8f3d-d9f20e83a1c5",
            teacherId: "db8754e3-efc5-4af0-9e72-0d96e5a3d523",
            studentId: "04f4b83e-7a10-4f30-a0f3-d8b53e1bdb62",
            groupId: null
        },
        {
            name: "Урок по контемпорари",
            description: "Групповое занятие по контемпорари танцу.",
            lessonType: "Group",
            startTime: "2025-04-10T15:00:00.000Z",
            finishTime: "2025-04-10T16:30:00.000Z",
            classroomId: "7aebc2f5-0a2f-4c8e-bb6b-f4b5d1b8c22e",
            teacherId: "1b2c3d4e-5f67-4a89-b5c4-e7d8f4c9baff",
            studentId: null,
            groupId: "7c3a9b1f-2e65-4a62-9b1b-3a5b62215d97"
        },
        {
            name: "Сальса для начинающих",
            description: "Индивидуальные занятия по сальсе для новичков.",
            lessonType: "Individual",
            startTime: "2025-04-10T18:00:00.000Z",
            finishTime: "2025-04-10T19:00:00.000Z",
            classroomId: "9b73b7c1-0db2-4a99-8e74-2b845bd3e4f6",
            teacherId: "f5b9279e-7d42-4e7b-bb2e-63a4f1b7cf0a",
            studentId: "015e7b47-56f5-4fd7-928f-b2b19ab4fddb",
            groupId: null
        },
        {
            name: "Современный танец",
            description: "Групповое занятие по современному танцу.",
            lessonType: "Group",
            startTime: "2025-04-10T20:00:00.000Z",
            finishTime: "2025-04-10T21:30:00.000Z",
            classroomId: "2a5c6d8e-9f7b-4e9f-bd1e-5dff3b7c2e3a",
            teacherId: "db8754e3-efc5-4af0-9e72-0d96e5a3d523",
            studentId: null,
            groupId: "5d5d7a89-9b4f-4c1e-b2f7-5d20c9f1a72b"
        },
        {
            name: "Основы брейк-данса",
            description: "Индивидуальное занятие по брейк-дансу для продвинутых.",
            lessonType: "Individual",
            startTime: "2025-04-09T16:30:00.000Z",
            finishTime: "2025-04-09T18:00:00.000Z",
            classroomId: "1f4e3a8d-7c9e-4b0e-b63f-c7d8b4a1e2c4",
            teacherId: "1b2c3d4e-5f67-4a89-b5c4-e7d8f4c9baff",
            studentId: "92edc4d1-986b-4df8-9533-d946b71b0658",
            groupId: null
        }
    ]

    const filteredLessons = filterLessonsByDate(lessons, selectedDate.toString())
        .filter(lesson => {
            if (scheduleMode === 'personal') {
                return lesson.lessonType === 'Individual';
            } else {
                return lesson.lessonType === 'Group';
            }
        })
        .filter(lesson => {
            if (filters.teacher !== 'all' && lesson.teacherId !== filters.teacher) return false;
            if (filters.level !== 'all' && lesson.level !== filters.level) return false;
            return true;
        });

    useEffect(() => {
        const marks = {};
        lessons.forEach(lesson => {
            const date = format(parseISO(lesson.startTime), 'yyyy-MM-dd', {locale: ru});
            if (isAfter(parseISO(lesson.startTime), new Date())) {
                marks[date] = { marked: true };
            }
        });
        setMarkedDates(marks);
    }, []);

    const handleScheduleModeChange = (event, newMode) => {
        if (newMode !== null) {
            setScheduleMode(newMode);
        }
    };

    const handleFilterChange = (event) => {
        setFilters({
            ...filters,
            [event.target.name]: event.target.value
        });
    };

    return (
        <div>
            <NavBar />
            <main className="schedule-content">
                <div className="schedule-container">
                    <div className="calendar-wrapper">
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                            <DateCalendar
                                className="custom-calendar"
                                value={selectedDate}
                                onChange={setSelectedDate}
                                disablePast
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
                                    '& .MuiDayCalendar-weekContainer': {
                                        justifyContent: 'space-around',
                                    },
                                    '& .Mui-selected': {
                                        backgroundColor: '#1a1a1a !important',
                                        color: 'white !important',
                                    },
                                    '& .MuiPickersDay-today': {
                                        border: '2px solid #1a1a1a !important',
                                        color: '#1a1a1a',
                                    },
                                    '& .MuiPickersDay-root:hover': {
                                        backgroundColor: 'rgba(26, 26, 26, 0.1)',
                                    },
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
                        <div className="schedule-mode-container">
                            <ToggleButtonGroup
                                value={scheduleMode}
                                exclusive
                                onChange={handleScheduleModeChange}
                                aria-label="режим расписания"
                                className="schedule-mode-toggle"
                                data-value={scheduleMode}
                            >
                                <ToggleButton value="personal" aria-label="личное расписание">
                                    Личное расписание
                                </ToggleButton>
                                <ToggleButton value="group" aria-label="групповые занятия">
                                    Групповые занятия
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </div>
                    </div>

                    <div className="lessons-wrapper">
                        <div className="lessons-header">
                            <h1 className="lessons-title">
                                {scheduleMode === 'personal' ? 'Личное расписание' : 'Групповые занятия'}
                            </h1>
                        </div>

                        {filteredLessons.length === 0 ? (
                            <div className="no-lessons">
                                <MdEvent className="no-lessons-icon" />
                                <h2 className="no-lessons-title">В этот день нет занятий</h2>
                                <p className="no-lessons-text">Выберите другую дату в календаре</p>
                            </div>
                        ) : (
                            <div className="lessons-list">
                                {filteredLessons.map((lesson, index) => (
                                    <LessonListItem key={index} lesson={lesson} />
                                ))}
                            </div>
                        )}
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
                                        {teacher.name}
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
    )
}

export default SchedulePage;