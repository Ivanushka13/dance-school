import "./GroupLessons.css";
import NavBar from "../../components/navbar/NavBar";
import React, {useCallback, useEffect, useState} from "react";
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
  MenuItem
} from "@mui/material";
import {MdFilterList, MdEvent} from 'react-icons/md';
import {useLocation, useNavigate} from 'react-router-dom';
import {LessonListItem} from "../../components/LessonListItem/LessonListItem";
import PageLoader from "../../components/PageLoader/PageLoader";
import InformationModal from "../../components/modal/info/InformationModal";
import {getGroupLessons} from "../../api/lessons";
import {getTeachers} from "../../api/teachers";
import {getGroups} from "../../api/group";
import {getLessonTypes} from "../../api/lessonTypes";
import {getLevels} from "../../api/levels";

const GroupLessons = () => {
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({});
  const {selectedLessonType} = useLocation().state || {};
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [lessons, setLessons] = useState([])
  const [teachers, setTeachers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [levels, setLevels] = useState([]);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lessonTypes, setLessonTypes] = useState([]);
  const [filters, setFilters] = useState({
    teacher: 'all',
    group: 'all',
    level: 'all',
    lessonType: selectedLessonType ? selectedLessonType.id : 'all'
  });

  useEffect(() => {
    fetchGroupLessons().then(() => setLoading(false));
  }, [selectedDate]);

  const fetchGroupLessons = useCallback(async () => {
    try {
      const date_from = new Date(selectedDate);
      const date_to = new Date(selectedDate);

      date_from.setUTCHours(0, 0, 0, 0);
      date_to.setUTCHours(23, 59, 59, 999);

      const data = {
        date_from: date_from.toISOString(),
        date_to: date_to.toISOString(),
        is_confirmed: true,
        is_group: true,
        terminated: false,
        in_group: false
      }

      const response = await getGroupLessons(data);

      setLessons(response.lessons);

    } catch (error) {
      setModalInfo({
        title: 'Ошибка при загрузке занятий',
        message: error.message || String(error),
      });
      setShowModal(true);
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    fetchTeachers().then();
  }, []);

  const fetchTeachers = useCallback(async () => {
    try {
      const response = await getTeachers({terminated: false})

      setTeachers(response.teachers);

    } catch (error) {
      setModalInfo({
        title: 'Ошибка при загрузке преподавателей',
        message: error.message || String(error),
      });
      setShowModal(true);
    }
  }, []);

  useEffect(() => {
    fetchGroups().then();
  }, []);

  const fetchGroups = useCallback(async () => {
    try {
      const data = {
        has_teachers: true,
        has_students: true,
        terminated: false
      }

      const response = await getGroups(data);

      setGroups(response.groups);

    } catch (error) {
      setModalInfo({
        title: 'Ошибка при загрузке групп',
        message: error.message || String(error),
      });
      setShowModal(true);
    }
  }, [])

  useEffect(() => {
    fetchLevels().then();
  }, []);

  const fetchLevels = useCallback(async () => {
    try {
      const response = await getLevels({terminated: false});

      setLevels(response.levels);

    } catch (error) {
      setModalInfo({
        title: 'Ошибка при загрузке уровней',
        message: error.message || String(error),
      });
      setShowModal(true);
    }
  }, []);

  useEffect(() => {
    fetchLessonTypes().then();
  }, []);

  const fetchLessonTypes = useCallback(async () => {
    try {
      const data = {
        terminated: false,
        is_group: true,
      }

      const response = await getLessonTypes(data);

      setLessonTypes(response.lesson_types);

    } catch (error) {
      setModalInfo({
        title: 'Ошибка при загрузке типов занятий',
        message: error.message || String(error),
      });
      setShowModal(true);
    }
  }, []);

  const handleFilterChange = (event) => {
    setFilters({
      ...filters,
      [event.target.name]: event.target.value
    });
  };

  const filteredLessons = lessons.filter(lesson => {
    if (filters.teacher !== 'all' && !lesson.actual_teachers.some(teacher => filters.teacher === teacher.id)) return false;
    if (filters.group !== 'all' && lesson.group.id !== filters.group) return false;
    if (filters.lessonType !== 'all' && lesson.lesson_type.id !== filters.lessonType) return false;
    return !(filters.level !== 'all' && lesson.group.level.id !== filters.level);
  });

  const handleLessonClick = (lessonId) => {
    navigate(`/lesson/${lessonId}`);
  };

  return (
    <>
      <div>
        <NavBar/>
        <main className="group-lessons-content">
          <PageLoader loading={loading} text="Загрузка занятий...">
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
                  startIcon={<MdFilterList/>}
                >
                  Фильтры
                </Button>
              </div>

              <div className="lessons-content">
                <div className="lessons-header">
                  <h1 className="lessons-title">Групповые занятия</h1>
                </div>

                {filteredLessons.length === 0 ? (
                  <div className="no-lessons">
                    <MdEvent className="no-lessons-icon"/>
                    <h2 className="no-lessons-title">В этот день нет занятий</h2>
                    <p className="no-lessons-text">Выберите другую дату в календаре</p>
                  </div>
                ) : (
                  <div className="lessons-list">
                    {filteredLessons.map((lesson) => (
                      <LessonListItem
                        key={lesson.id}
                        lesson={lesson}
                        onClick={handleLessonClick}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </PageLoader>

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
                      {`${teacher.user.last_name} ${teacher.user.first_name} ${teacher.user?.middle_name}`}
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
                    <MenuItem key={group.id} value={group.id}>
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

              <FormControl fullWidth margin="normal">
                <InputLabel>Стиль танца</InputLabel>
                <Select
                  name="lessonType"
                  value={filters.lessonType}
                  onChange={handleFilterChange}
                  label="Стиль танца"
                >
                  <MenuItem value="all">Все стили танца</MenuItem>
                  {lessonTypes.map(type => (
                    <MenuItem key={type.id} value={type.id}>
                      {type.dance_style.name}
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
      <InformationModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title={modalInfo.title}
        message={modalInfo.message}
      />
    </>
  );
};

export default GroupLessons; 