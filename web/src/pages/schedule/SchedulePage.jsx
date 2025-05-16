import "./SchedulePage.css"
import NavBar from "../../components/navbar/NavBar";
import "react-day-picker/style.css";
import {DateCalendar} from '@mui/x-date-pickers/DateCalendar';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import ru from 'date-fns/locale/ru';
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LessonListItem} from "../../components/LessonListItem/LessonListItem";
import React, {useCallback, useEffect, useState} from "react";
import {MdEvent} from 'react-icons/md';
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import PageLoader from "../../components/PageLoader/PageLoader";
import InformationModal from "../../components/modal/info/InformationModal";
import {getStudentLessons, getTeacherLessons} from "../../api/lessons";

const SchedulePage = () => {

  const role = useSelector(state => state.session.role);
  const id = useSelector(state => state.session.id);

  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    title: '',
    message: ''
  });

  useEffect(() => {
    fetchLessons().then(() => setLoading(false));
  }, [selectedDate])

  const fetchLessons = useCallback(async () => {
    try {
      const date_from = new Date(selectedDate);
      const date_to = new Date(selectedDate);

      date_from.setUTCHours(0, 0, 0, 0);
      date_to.setUTCHours(23, 59, 59, 999);

      let data = {
        date_from: date_from.toISOString(),
        date_to: date_to.toISOString(),
        terminated: false
      }

      if (role === 'student') {
        data = {
          ...data,
          student_ids: [id]
        };
      } else {
        data = {
          ...data,
          teacher_ids: [id]
        };
      }

      const response = role === 'student'
        ? await getStudentLessons(data)
        : await getTeacherLessons(data);

      setLessons(response?.lessons);

    } catch (error) {
      setModalInfo({
        title: 'Ошибка при загрузке занятий',
        message: error.message || String(error),
      });
      setShowModal(true);
      setLoading(false);
    }
  }, [role, selectedDate]);

  const handleLessonNavigate = (lesson_id) => {
    navigate(`/lesson/${lesson_id}`);
  }

  return (
    <>
      <div>
        <NavBar/>
        <main className="schedule-content">
          <PageLoader loading={loading} text="Загрузка занятий...">
            <div className="schedule-container">
              <div className="calendar-wrapper">
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                  <DateCalendar
                    className="custom-calendar"
                    value={selectedDate}
                    onChange={setSelectedDate}
                    sx={{
                      width: '100%',
                      '& .MuiPickersCalendarHeader-root': {
                        fontSize: '1.1rem',
                        marginTop: '0.3rem',
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
              </div>

              <div className="lessons-wrapper">
                <div className="lessons-header">
                  <h1 className="lessons-title">
                    Расписание
                  </h1>
                </div>
                {!loading && lessons.length === 0 ? (
                  <div className="no-lessons">
                    <MdEvent className="no-lessons-icon"/>
                    <h2 className="no-lessons-title">В этот день нет занятий</h2>
                    <p className="no-lessons-text">Выберите другую дату в календаре</p>
                  </div>
                ) : (
                  <div className="lessons-list">
                    {lessons.map((lesson, index) => (
                      <LessonListItem
                        key={index}
                        lesson={lesson}
                        onClick={() => handleLessonNavigate(lesson.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </PageLoader>
        </main>
      </div>
      <InformationModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        title={modalInfo.title}
        message={modalInfo.message}
      />
    </>
  )
}

export default SchedulePage;